import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/my_portfolio";

async function main() {
  console.log("Testing MongoDB integration at:", uri);
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db();
  console.log("Connected successfully to DB:", db.databaseName);

  // 1. Test contact messages collection
  const contactCol = db.collection("contact_messages");
  const testContact = {
    name: "Akshay Verification Tester",
    email: "test.visitor@example.com",
    intent: "Let's collaborate on a project",
    message: "Hey Akshay, this is an automated verification of MongoDB contact storage.",
    createdAt: new Date(),
    ip: "127.0.0.1",
    emailSent: false,
  };
  const contactRes = await contactCol.insertOne(testContact);
  console.log("Inserted test contact message with ID:", contactRes.insertedId.toString());

  const foundContact = await contactCol.findOne({ _id: contactRes.insertedId });
  if (!foundContact) throw new Error("Could not find inserted contact message!");
  console.log("Successfully verified contact message in MongoDB!");

  // Clean up test contact
  await contactCol.deleteOne({ _id: contactRes.insertedId });
  console.log("Cleaned up test contact record.");

  // 2. Test newsletter subscribers collection
  const subCol = db.collection("newsletter_subscribers");
  const testEmail = "test.subscriber@example.com";
  // Clean up if already exists
  await subCol.deleteOne({ email: testEmail });

  await subCol.insertOne({
    email: testEmail,
    status: "active",
    source: "verification_test",
    createdAt: new Date(),
  });
  console.log("Inserted test newsletter subscriber:", testEmail);

  const foundSub = await subCol.findOne({ email: testEmail });
  if (!foundSub || foundSub.status !== "active") throw new Error("Could not find inserted subscriber!");
  console.log("Successfully verified subscriber in MongoDB!");

  // Clean up test subscriber
  await subCol.deleteOne({ email: testEmail });
  console.log("Cleaned up test subscriber record.");

  await client.close();
  console.log("ALL TESTS PASSED! MongoDB is ready and storing data perfectly.");
}

main().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
