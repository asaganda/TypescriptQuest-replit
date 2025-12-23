import "dotenv/config";
import { db } from "../server/db";
import { sql } from "drizzle-orm";

async function addAdminField() {
  console.log("Adding isAdmin field to users table...");

  try {
    // Add column with default false
    await db.execute(sql`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT false
    `);

    console.log("✓ isAdmin field added");

    // Optional: Set specific user as admin by email
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      await db.execute(sql`
        UPDATE users
        SET is_admin = true
        WHERE email = ${adminEmail}
      `);
      console.log(`✓ Set ${adminEmail} as admin`);
    } else {
      console.log("ℹ No ADMIN_EMAIL set in .env - skipping admin user setup");
      console.log("  To set an admin user, add ADMIN_EMAIL=your@email.com to .env and run this script again");
    }

    console.log("✅ Migration complete");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  } finally {
    process.exit(0);
  }
}

addAdminField();
