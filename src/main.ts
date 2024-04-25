import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';
import { HttpExceptionFilter } from './exceptions/http.exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  console.log(process.env.NODE_ENV);
  app.use(json({ limit: '50mb' }));
  app.useGlobalFilters(new HttpExceptionFilter());

  app.use(urlencoded({ extended: true, limit: '50mb' }));

  await app.listen(3000);
}
bootstrap();
