import "reflect-metadata";

// mysql2 3.x maps UTF8MB4_UNICODE_CI (charset index 224) to 'cesu8',
// which is not a valid Node.js Buffer encoding and throws ERR_UNKNOWN_ENCODING.
// Patch it to 'utf8' at startup so Arabic/Urdu text is decoded correctly.
// We require via absolute path to bypass mysql2's package.json "exports" restriction.
import { join, dirname } from "path";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const _mysql2Root = dirname(require.resolve("mysql2"));
// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-explicit-any
const _charsetEncodings: Record<number, string> = require(
  join(_mysql2Root, "lib/constants/charset_encodings.js"),
);
_charsetEncodings[224] = "utf8"; // UTF8MB4_UNICODE_CI → utf8 (guard against older mysql2 that maps this to 'cesu8')
_charsetEncodings[192] = "utf8"; // UTF8_UNICODE_CI    → utf8
_charsetEncodings[246] = "utf8"; // UTF8MB4_UNICODE_520_CI → utf8

import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import cookieParser from "cookie-parser";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.enableCors({ origin: true, credentials: true });
  app.setGlobalPrefix("api");

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle("Roohbakhsh API")
    .setDescription("قرارداد API آکادمی روح‌بخش")
    .setVersion("0.1.0")
    .addBearerAuth()
    .addCookieAuth("access_token")
    .build();
  const doc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, doc);

  await app.listen(3001);
  // eslint-disable-next-line no-console
  console.log("API → http://localhost:3001/api   |   Docs → /api/docs");
}
bootstrap();
