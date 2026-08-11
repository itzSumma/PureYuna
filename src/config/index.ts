import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

// Strict check: .env এ JWT_SECRET না থাকলে সার্ভার রান হওয়া আটকাবে
if (!process.env.JWT_SECRET) {
  throw new Error("❌ FATAL ERROR: JWT_SECRET is not defined in environment variables.");
}

export default {
  port: process.env.PORT || 6000,
  database_url: process.env.DATABASE_URL,
  jwt_secret: process.env.JWT_SECRET,
};