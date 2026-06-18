import "reflect-metadata";
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
