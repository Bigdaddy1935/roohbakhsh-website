/**
 * seed: ایجاد کاربر admin برای محیط development
 * اجرا: npx ts-node -r tsconfig-paths/register src/db/seed-admin.ts
 */
import "reflect-metadata";
import { DataSource } from "typeorm";
import * as bcrypt from "bcrypt";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env.developer") });

async function main() {
  const ds = new DataSource({
    type: "mysql",
    host: process.env["DB_HOST"],
    port: Number(process.env["DB_PORT"]),
    username: process.env["DB_USERNAME"],
    password: process.env["DB_PASSWORD"],
    database: process.env["DB_DATABASE"],
    entities: [__dirname + "/../modules/**/entities/*.entity.{ts,js}"],
    synchronize: false,
  });

  await ds.initialize();
  const repo = ds.getRepository("User");

  const existing = await repo.findOne({ where: { email: "admin@roohbakhsh.com" } });
  if (existing) {
    console.log("admin already exists");
    await ds.destroy();
    return;
  }

  await repo.save(repo.create({
    email: "admin@roohbakhsh.com",
    fullName: "Super Admin",
    passwordHash: await bcrypt.hash("Admin@1234", 12),
    role: "admin",
    preferredLocale: "ar",
    phone: null,
    avatarUrl: null,
  }));

  console.log("admin created: admin@roohbakhsh.com / Admin@1234");
  await ds.destroy();
}

main().catch(console.error);
