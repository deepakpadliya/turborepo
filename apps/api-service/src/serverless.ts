import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import serverless from 'serverless-http';
import { AppModule } from './app.module';

let cachedHandler: any;

export const handler = async (req: any, res: any) => {
  if (!cachedHandler) {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
      origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:5173',
        /^https:\/\/.*\.vercel\.app$/,
      ],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    });

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    const config = new DocumentBuilder()
      .setTitle('API Service')
      .setDescription('Common backend API service')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app as any, config);
    SwaggerModule.setup('api/docs', app as any, document);

    await app.init();
    cachedHandler = serverless(app.getHttpAdapter().getInstance());
  }

  return cachedHandler(req, res);
};
