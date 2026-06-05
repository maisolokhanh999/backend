import dns from "dns";
import mongoose from "mongoose";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const MONGODB_URI =
  "mongodb+srv://maisolokhanh999_db_user:aErBrzAFLYD7Blhb@khanh.9fx0gwx.mongodb.net/?appName=khanh";

try {
  console.log("Connecting...");
  await mongoose.connect(MONGODB_URI);

  console.log("✅ Connected");
} catch (err) {
  console.error("❌ Full Error:");
  console.error(err);
}