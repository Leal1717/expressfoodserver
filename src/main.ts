import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);



  app.enableCors({
    origin: "*",
    // origin: "http://localhost:3001",
    // credentials: true
  })


  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,           // remove campos não permitidos
      transform: true,           // transforma tipos automaticamente
    }),
  )


  const port = process.env.PORT || 3000;
  const host = process.env.HOST || '0.0.0.0';
  await app.listen(port, host);
  console.log(__dirname)
}
bootstrap();
