import { MongoClient, type Db } from "mongodb";

/**
 * MongoDB client singleton for Next.js App Router.
 * Caches the connection in global scope to avoid connection exhaustion in dev/serverless.
 */

const getMongoUri = () => process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/my_portfolio";

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

export function getMongoClientPromise(): Promise<MongoClient> {
  const uri = getMongoUri();

  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      const client = new MongoClient(uri);
      global._mongoClientPromise = client.connect();
    }
    return global._mongoClientPromise;
  }

  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  return global._mongoClientPromise;
}

export async function getMongoDb(): Promise<Db> {
  const client = await getMongoClientPromise();
  return client.db();
}

export async function isMongoAvailable(): Promise<boolean> {
  try {
    const db = await getMongoDb();
    await db.command({ ping: 1 });
    return true;
  } catch {
    return false;
  }
}

export default getMongoClientPromise;
