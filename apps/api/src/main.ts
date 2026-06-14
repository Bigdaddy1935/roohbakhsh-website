import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // اجازه‌ی دسترسی فرانت (web/cms) به API در حالت توسعه
  app.enableCors();
  app.setGlobalPrefix("api");

  // اعتبارسنجی خودکار همه‌ی ورودی‌ها طبق DTOها
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // مستندات خودکار API → فرانت‌کارها اینجا همه‌ی endpointها را می‌بینند:
  // http://localhost:3001/api/docs
  const config = new DocumentBuilder()
    .setTitle("Roohbakhsh API")
    .setDescription("قرارداد API آکادمی روح‌بخش")
    .setVersion("0.1.0")
    .addBearerAuth()
    .build();
  const doc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, doc);

  await app.listen(3001);
  // eslint-disable-next-line no-console
  console.log("API → http://localhost:3001/api   |   Docs → /api/docs");
}
bootstrap();
