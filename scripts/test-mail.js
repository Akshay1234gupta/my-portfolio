import nodemailer from "nodemailer";
import fs from "fs";

// Load .env.local if present
try {
  const envContent = fs.readFileSync(".env.local", "utf8");
  envContent.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const idx = trimmed.indexOf("=");
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  });
} catch {
  // ignore
}

async function main() {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const user = process.env.SMTP_USER || "akshayguptaa444@gmail.com";
  const pass = process.env.SMTP_PASS;
  const to = process.env.CONTACT_TO_EMAIL || "akshayguptaa444@gmail.com";

  console.log("Testing SMTP Mail Delivery...");
  console.log("Host:", host);
  console.log("User:", user);
  console.log("Recipient:", to);

  if (!pass) {
    console.log("\n⚠️  SMTP_PASS is not set in .env.local.");
    console.log("Please create a 16-character Google App Password:");
    console.log("1. Go to https://myaccount.google.com/apppasswords");
    console.log("2. Create an App password (select App name: 'Portfolio')");
    console.log("3. Add it to .env.local: SMTP_PASS=your-16-char-code\n");
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  console.log("Verifying SMTP credentials...");
  await transporter.verify();
  console.log("✅ SMTP credentials verified successfully!");

  console.log("Sending test email to", to, "...");
  const info = await transporter.sendMail({
    from: `"Akshay Portfolio" <${user}>`,
    to,
    subject: "✅ Test Email from your Portfolio",
    text: "Congrats! Your portfolio email notification system is working perfectly.",
    html: `
      <div style="font-family: sans-serif; background: #0b0d12; color: #fff; padding: 24px; border-radius: 12px;">
        <h2 style="color: #2dd4bf;">Portfolio Email Connected!</h2>
        <p>This is a test notification confirming that your contact form and newsletter alerts are configured and working.</p>
        <p style="color: #8b93a3;">Time: ${new Date().toLocaleString()}</p>
      </div>
    `,
  });

  console.log("✅ Email sent successfully! MessageId:", info.messageId);
}

main().catch((err) => {
  console.error("❌ Mail test error:", err.message);
});
