/**
 * This script makes the first user in the database an admin
 * Run with: npx tsx scripts/make-first-user-admin.ts
 */

import "dotenv/config";
import { db } from "../server/db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";

async function makeFirstUserAdmin() {
  console.log("Checking for users...\n");

  try {
    // Get the first user (oldest account)
    const allUsers = await db.query.users.findMany({
      orderBy: (users, { asc }) => [asc(users.createdAt)],
      limit: 1
    });

    if (allUsers.length === 0) {
      console.log("❌ No users found in database.");
      console.log("Please register an account first, then run this script.");
      return;
    }

    const firstUser = allUsers[0];

    if (firstUser.isAdmin) {
      console.log("✅ First user is already an admin!");
      console.log(`   Email: ${firstUser.email}`);
      console.log(`   Display Name: ${firstUser.displayName}`);
      return;
    }

    // Make the first user an admin
    await db.update(users)
      .set({ isAdmin: true })
      .where(eq(users.id, firstUser.id));

    console.log("✅ First user is now an admin!");
    console.log(`   Email: ${firstUser.email}`);
    console.log(`   Display Name: ${firstUser.displayName}`);
    console.log(`   User ID: ${firstUser.id}`);

  } catch (error) {
    console.error("❌ Error:", error);
    throw error;
  }
}

makeFirstUserAdmin()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
