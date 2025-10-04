import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module'; // Use full app module with auth endpoints
import { ExpressAdapter } from '@nestjs/platform-express';
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import express from 'express';

let cachedApp: INestApplication;

const createApp = async () => {
  if (!cachedApp) {
    const expressApp = express();
    
    // Configure Express middleware before creating NestJS app
    expressApp.use(express.json({ limit: '10mb' }));
    expressApp.use(express.urlencoded({ extended: true, limit: '10mb' }));
    
    const adapter = new ExpressAdapter(expressApp);
    
    cachedApp = await NestFactory.create(AppModule, adapter, {
      bodyParser: false, // Disable NestJS body parser since Express handles it
      logger: ['error', 'warn']
    });
    
    cachedApp.enableCors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      allowedHeaders: 'Content-Type,Authorization',
    });
    
    // Setup Swagger
    const config = new DocumentBuilder()
      .setTitle('Auth Service')
      .setDescription('Authentication and Authorization API')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(cachedApp, config);
    SwaggerModule.setup('api/docs', cachedApp, document);
    
    await cachedApp.init();
  }
  return cachedApp;
};

// Default export for Vercel
export default async (req: any, res: any) => {
  try {
    console.log('Vercel handler called:', req.method, req.url);
    
    const app = await createApp();
    const httpAdapter = app.getHttpAdapter();
    const expressInstance = httpAdapter.getInstance();
    
    // Handle the request directly with Express
    expressInstance(req, res);
    
  } catch (error: any) {
    console.error('Vercel handler error:', error);
    if (!res.headersSent) {
      res.status(500).json({ 
        error: 'Internal server error', 
        message: error.message 
      });
    }
  }
};
