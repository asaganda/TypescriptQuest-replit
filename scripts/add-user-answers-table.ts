import { db } from "../server/db";
import { sql } from "drizzle-orm";

async function addUserAnswersTable() {
  console.log("Creating user_answers table...");

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS user_answers (
      id VARCHAR PRIMARY KEY,
      user_id VARCHAR NOT NULL REFERENCES users(id),
      challenge_id VARCHAR NOT NULL REFERENCES challenges(id),
      answer_data TEXT NOT NULL,
      is_correct BOOLEAN NOT NULL,
      submitted_at TIMESTAMP DEFAULT NOW() NOT NULL
    )
  `);

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS user_answers_user_challenge_idx
    ON user_answers(user_id, challenge_id)
  `);

  console.log("✅ user_answers table created");
  process.exit(0);
}

addUserAnswersTable().catch((error) => {
  console.error("❌ Migration failed:", error);
  process.exit(1);
});
