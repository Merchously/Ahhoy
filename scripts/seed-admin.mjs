// Standalone admin user seeder — uses globally installed pg + bcryptjs
// Runs on startup in Docker to ensure admin user exists
import { createRequire } from "module";
import { randomBytes } from "crypto";

// Use createRequire so ESM can load CJS packages from NODE_PATH
const require = createRequire(import.meta.url);
const pg = require("pg");
const bcrypt = require("bcryptjs");

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.log("seed-admin: DATABASE_URL not set, skipping");
  process.exit(0);
}

const email = process.env.ADMIN_EMAIL || "admin@ahhoy.com";
const password = process.env.ADMIN_PASSWORD || "AdminPass123!";

const pool = new pg.Pool({ connectionString: DATABASE_URL });

try {
  const existing = await pool.query(
    'SELECT id, role FROM "User" WHERE email = $1',
    [email]
  );

  if (existing.rows.length > 0) {
    if (existing.rows[0].role === "ADMIN") {
      console.log(`seed-admin: Admin user already exists (${email})`);
    } else {
      await pool.query('UPDATE "User" SET role = $1 WHERE email = $2', [
        "ADMIN",
        email,
      ]);
      console.log(`seed-admin: Upgraded ${email} to ADMIN role`);
    }
  } else {
    const hashedPassword = bcrypt.hashSync(password, 12);
    const id = `cm${Date.now().toString(36)}${randomBytes(8).toString("hex")}`;

    await pool.query(
      `INSERT INTO "User" (id, email, "firstName", "lastName", "hashedPassword", role, "createdAt", "updatedAt", "stripeOnboardingComplete")
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW(), false)`,
      [id, email, "Admin", "User", hashedPassword, "ADMIN"]
    );
    console.log(`seed-admin: Created admin user (${email})`);
  }
} catch (err) {
  console.error("seed-admin: Error:", err.message);
} finally {
  await pool.end();
}
