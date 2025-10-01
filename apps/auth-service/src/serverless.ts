import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import serverless from 'serverless-http';

let cachedHandler: any;

export const handler = async (req: any, res: any) => {
  if (!cachedHandler) {
    const app = await NestFactory.create(AppModule);
    await app.init();
    cachedHandler = serverless(app.getHttpAdapter().getInstance());
  }
  return cachedHandler(req, res);
};
