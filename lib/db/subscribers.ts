import { promises as fs } from "node:fs";
import path from "node:path";
import postgres from "postgres";
import { getMongoDb } from "./mongodb";

/**
 * Subscriber storage behind one interface.
 *  - MONGODB_URI set (or MongoDB available) → MongoDB (collections: newsletter_subscribers, newsletter_notifications).
 *  - DATABASE_URL set → PostgreSQL (tables are created on first use).
 *  - otherwise, in development (or ALLOW_FILE_STORE=true) → a JSON file in ./.data (git-ignored).
 *  - otherwise → StoreNotConfiguredError; routes answer 503.
 */

export type SubscribeResult = "created" | "resubscribed" | "exists";

export interface SubscriberStore {
  subscribe(email: string, source: string): Promise<SubscribeResult>;
  unsubscribe(email: string): Promise<boolean>;
  listActive(): Promise<string[]>;
  hasNotified(slug: string): Promise<boolean>;
  recordNotified(slug: string, recipients: number): Promise<void>;
}

export class StoreNotConfiguredError extends Error {
  constructor() {
    super("No subscriber storage configured. Set MONGODB_URI (MongoDB) or DATABASE_URL (PostgreSQL).");
  }
}

// ───────────── MongoDB ─────────────

interface MongoSubscriberDoc {
  email: string;
  status: "active" | "unsubscribed";
  source: string;
  createdAt: Date;
  unsubscribedAt?: Date;
}

interface MongoNotificationDoc {
  slug: string;
  recipients: number;
  sentAt: Date;
}

class MongoSubscriberStore implements SubscriberStore {
  private indexed = false;

  private async getSubscribers() {
    const db = await getMongoDb();
    const col = db.collection<MongoSubscriberDoc>("newsletter_subscribers");
    if (!this.indexed) {
      await col.createIndex({ email: 1 }, { unique: true }).catch(() => {});
      this.indexed = true;
    }
    return col;
  }

  private async getNotifications() {
    const db = await getMongoDb();
    const col = db.collection<MongoNotificationDoc>("newsletter_notifications");
    await col.createIndex({ slug: 1 }, { unique: true }).catch(() => {});
    return col;
  }

  async subscribe(email: string, source: string): Promise<SubscribeResult> {
    const col = await this.getSubscribers();
    const existing = await col.findOne({ email });
    if (!existing) {
      await col.insertOne({
        email,
        status: "active",
        source,
        createdAt: new Date(),
      });
      return "created";
    }
    if (existing.status === "unsubscribed") {
      await col.updateOne(
        { email },
        { $set: { status: "active" }, $unset: { unsubscribedAt: "" } }
      );
      return "resubscribed";
    }
    return "exists";
  }

  async unsubscribe(email: string): Promise<boolean> {
    const col = await this.getSubscribers();
    const res = await col.updateOne(
      { email, status: "active" },
      { $set: { status: "unsubscribed", unsubscribedAt: new Date() } }
    );
    return res.modifiedCount > 0;
  }

  async listActive(): Promise<string[]> {
    const col = await this.getSubscribers();
    const docs = await col.find({ status: "active" }, { projection: { email: 1 } }).toArray();
    return docs.map((d) => d.email);
  }

  async hasNotified(slug: string): Promise<boolean> {
    const col = await this.getNotifications();
    const doc = await col.findOne({ slug });
    return doc !== null;
  }

  async recordNotified(slug: string, recipients: number): Promise<void> {
    const col = await this.getNotifications();
    await col.updateOne(
      { slug },
      { $set: { recipients, sentAt: new Date() } },
      { upsert: true }
    );
  }
}

// ───────────── JSON file (development fallback) ─────────────

interface FileShape {
  subscribers: Record<string, { status: "active" | "unsubscribed"; source: string; createdAt: string; unsubscribedAt?: string }>;
  notified: Record<string, { at: string; recipients: number }>;
}

class FileStore implements SubscriberStore {
  private file = path.join(process.cwd(), ".data", "newsletter.json");
  private queue: Promise<unknown> = Promise.resolve();

  private async read(): Promise<FileShape> {
    try {
      return JSON.parse(await fs.readFile(this.file, "utf8")) as FileShape;
    } catch {
      return { subscribers: {}, notified: {} };
    }
  }

  private async write(data: FileShape) {
    await fs.mkdir(path.dirname(this.file), { recursive: true });
    await fs.writeFile(this.file, JSON.stringify(data, null, 2));
  }

  /** serialise read-modify-write cycles */
  private tx<T>(fn: (d: FileShape) => T | Promise<T>): Promise<T> {
    const run = this.queue.then(async () => {
      const data = await this.read();
      const out = await fn(data);
      await this.write(data);
      return out;
    });
    this.queue = run.catch(() => undefined);
    return run;
  }

  subscribe(email: string, source: string) {
    return this.tx<SubscribeResult>((d) => {
      const existing = d.subscribers[email];
      if (!existing) {
        d.subscribers[email] = { status: "active", source, createdAt: new Date().toISOString() };
        return "created";
      }
      if (existing.status === "unsubscribed") {
        d.subscribers[email] = { ...existing, status: "active", unsubscribedAt: undefined };
        return "resubscribed";
      }
      return "exists";
    });
  }

  unsubscribe(email: string) {
    return this.tx((d) => {
      const s = d.subscribers[email];
      if (!s || s.status === "unsubscribed") return false;
      s.status = "unsubscribed";
      s.unsubscribedAt = new Date().toISOString();
      return true;
    });
  }

  async listActive() {
    const d = await this.read();
    return Object.entries(d.subscribers)
      .filter(([, s]) => s.status === "active")
      .map(([email]) => email);
  }

  async hasNotified(slug: string) {
    return slug in (await this.read()).notified;
  }

  recordNotified(slug: string, recipients: number) {
    return this.tx((d) => {
      d.notified[slug] = { at: new Date().toISOString(), recipients };
    });
  }
}

// ───────────── PostgreSQL ─────────────

class PostgresStore implements SubscriberStore {
  private sql: ReturnType<typeof postgres>;
  private ready: Promise<unknown>;

  constructor(url: string) {
    this.sql = postgres(url, { max: 3, idle_timeout: 20, connect_timeout: 10 });
    this.ready = this.migrate();
  }

  private async migrate() {
    await this.sql`
      create table if not exists newsletter_subscribers (
        email text primary key,
        status text not null default 'active',
        source text not null default 'site',
        created_at timestamptz not null default now(),
        unsubscribed_at timestamptz
      )`;
    await this.sql`
      create table if not exists newsletter_notifications (
        slug text primary key,
        recipients integer not null,
        sent_at timestamptz not null default now()
      )`;
  }

  async subscribe(email: string, source: string): Promise<SubscribeResult> {
    await this.ready;
    const rows = await this.sql<{ status: string }[]>`select status from newsletter_subscribers where email = ${email}`;
    if (rows.length === 0) {
      await this.sql`insert into newsletter_subscribers (email, source) values (${email}, ${source}) on conflict do nothing`;
      return "created";
    }
    if (rows[0].status === "unsubscribed") {
      await this.sql`update newsletter_subscribers set status = 'active', unsubscribed_at = null where email = ${email}`;
      return "resubscribed";
    }
    return "exists";
  }

  async unsubscribe(email: string) {
    await this.ready;
    const res = await this.sql`
      update newsletter_subscribers set status = 'unsubscribed', unsubscribed_at = now()
      where email = ${email} and status = 'active'`;
    return res.count > 0;
  }

  async listActive() {
    await this.ready;
    const rows = await this.sql<{ email: string }[]>`select email from newsletter_subscribers where status = 'active'`;
    return rows.map((r) => r.email);
  }

  async hasNotified(slug: string) {
    await this.ready;
    const rows = await this.sql`select 1 from newsletter_notifications where slug = ${slug}`;
    return rows.length > 0;
  }

  async recordNotified(slug: string, recipients: number) {
    await this.ready;
    await this.sql`
      insert into newsletter_notifications (slug, recipients) values (${slug}, ${recipients})
      on conflict (slug) do update set recipients = excluded.recipients, sent_at = now()`;
  }
}

let store: SubscriberStore | null = null;

export function getSubscriberStore(): SubscriberStore {
  if (store) return store;

  // 1. Prefer MongoDB if MONGODB_URI is set or no postgres is specified
  if (process.env.MONGODB_URI || (!process.env.DATABASE_URL && process.env.ALLOW_FILE_STORE !== "true")) {
    store = new MongoSubscriberStore();
    return store;
  }

  // 2. PostgreSQL if DATABASE_URL is set
  const url = process.env.DATABASE_URL;
  if (url) {
    store = new PostgresStore(url);
    return store;
  }

  // 3. Fallback to local file in development
  if (process.env.NODE_ENV !== "production" || process.env.ALLOW_FILE_STORE === "true") {
    store = new FileStore();
    return store;
  }

  throw new StoreNotConfiguredError();
}
