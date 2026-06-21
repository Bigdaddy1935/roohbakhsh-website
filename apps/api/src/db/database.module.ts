import { Module, OnApplicationBootstrap, Injectable, Logger } from "@nestjs/common";
import { TypeOrmModule, InjectDataSource } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { DataSource } from "typeorm";

const SET_NAMES_SQL = "SET NAMES utf8mb4";

/**
 * Ensures every mysql2 pool connection uses utf8mb4.
 *
 * Why this is needed: on Windows, MySQL defaults the connection charset to
 * cp850/latin1, which corrupts multi-byte characters (Arabic/Urdu) when
 * TypeORM reads JSON columns back.  We hook both existing and future
 * connections in the pool.
 */
@Injectable()
class Utf8mb4Initializer implements OnApplicationBootstrap {
  private readonly logger = new Logger(Utf8mb4Initializer.name);

  constructor(@InjectDataSource() private readonly ds: DataSource) {}

  async onApplicationBootstrap(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const driver = this.ds.driver as any;
    // TypeORM stores the raw mysql2 pool on driver.pool
    const pool = driver.pool as {
      on: (event: string, cb: (conn: unknown) => void) => void;
      getConnection: (cb: (err: Error | null, conn: { query: (sql: string, cb: () => void) => void; release: () => void } | null) => void) => void;
      config: { connectionLimit: number };
    } | undefined;

    if (!pool) {
      this.logger.warn("MySQL pool not found — SET NAMES skipped");
      return;
    }

    // Hook future connections
    pool.on("connection", (conn: unknown) => {
      (conn as { query: (sql: string, cb: () => void) => void }).query(SET_NAMES_SQL, () => {});
    });

    // Saturate existing connections in the pool and run SET NAMES on each
    const limit = pool.config?.connectionLimit ?? 10;
    const promises: Promise<void>[] = [];
    for (let i = 0; i < limit; i++) {
      promises.push(
        new Promise<void>((resolve) => {
          pool.getConnection((err, conn) => {
            if (err || !conn) { resolve(); return; }
            conn.query(SET_NAMES_SQL, () => { conn.release(); resolve(); });
          });
        }),
      );
    }
    await Promise.all(promises);

    this.logger.log(`SET NAMES utf8mb4 applied to ${limit} pool connections (collation: db default)`);

  }
}

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: "mysql",
        host: config.get<string>("DB_HOST"),
        port: config.get<number>("DB_PORT"),
        username: config.get<string>("DB_USERNAME"),
        password: config.get<string>("DB_PASSWORD"),
        database: config.get<string>("DB_DATABASE"),
        synchronize: config.get<boolean>("DB_SYNCHRONIZE"),
        autoLoadEntities: true,
        migrations: ["dist/db/migrations/*.js"],
        migrationsRun: false,
      }),
    }),
  ],
  providers: [Utf8mb4Initializer],
})
export class DatabaseModule {}
