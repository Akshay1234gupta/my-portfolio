import { getMongoDb } from "./mongodb";

export interface ContactMessage {
  name: string;
  email: string;
  intent: string;
  message: string;
  createdAt: Date;
  ip?: string;
  emailSent: boolean;
  emailError?: string;
}

export async function saveContactMessage(msg: {
  name: string;
  email: string;
  intent: string;
  message: string;
  ip?: string;
  emailSent: boolean;
  emailError?: string;
}): Promise<string> {
  const db = await getMongoDb();
  const col = db.collection<ContactMessage>("contact_messages");
  const res = await col.insertOne({
    ...msg,
    createdAt: new Date(),
  });
  return res.insertedId.toString();
}

export async function updateContactEmailStatus(
  id: string,
  emailSent: boolean,
  emailError?: string
): Promise<void> {
  try {
    const { ObjectId } = await import("mongodb");
    const db = await getMongoDb();
    const col = db.collection<ContactMessage>("contact_messages");
    await col.updateOne(
      { _id: new ObjectId(id) as unknown as never },
      { $set: { emailSent, ...(emailError ? { emailError } : {}) } }
    );
  } catch (err) {
    console.error("[contact:db] Failed to update email status for", id, err);
  }
}

export async function listContactMessages(limit = 100) {
  const db = await getMongoDb();
  const col = db.collection<ContactMessage>("contact_messages");
  return col.find().sort({ createdAt: -1 }).limit(limit).toArray();
}
