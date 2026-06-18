import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import * as path from "path";

// برای اجرای migration از CLI — خارج از NestJS
dotenv.config({
  path: path.resolve(
    __dirname,
    "../../../",
    process.env.NODE_ENV === "production"
      ? ".env.production"
      : ".env.developer",
  ),
});

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [path.join(__dirname, "../**/*.entity{.ts,.js}")],
  migrations: [path.join(__dirname, "./migrations/*{.ts,.js}")],
  synchronize: false,
});
