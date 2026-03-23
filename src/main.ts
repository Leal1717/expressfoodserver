import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // app.useStaticAssets(join(__dirname , "..",  "public/outros"))
  // app.setBaseViewsDir(join(__dirname , "..",  "public/views"))

  app.useStaticAssets(join(process.cwd(),  "public/outros"))
  app.setBaseViewsDir(join(process.cwd(), "public/views"))


  app.setViewEngine('ejs')


  app.enableCors({
    origin: "*",
    // origin: "http://localhost:3001",
    // credentials: true
  })


  const port = process.env.PORT || 3000;
  const host = process.env.HOST || '0.0.0.0';
  await app.listen(port, host);
  console.log(__dirname)
}
bootstrap();
