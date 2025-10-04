import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module'; // Use full app module with auth endpoints
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

let cachedApp: INestApplication;

const createApp = async () => {
  if (!cachedApp) {
    cachedApp = await NestFactory.create(AppModule, {
      bodyParser: true, // Enable body parser for API requests
      logger: ['error', 'warn']
    });
    
    cachedApp.enableCors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      allowedHeaders: 'Content-Type,Authorization',
    });
    
    // Setup Swagger with proper configuration for Vercel
    const config = new DocumentBuilder()
      .setTitle('Auth Service')
      .setDescription('Authentication and Authorization API')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(cachedApp, config);
    
    // Configure Swagger for Vercel serverless environment
    SwaggerModule.setup('api/docs', cachedApp, document, {
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
      },
      customSiteTitle: 'Auth Service API',
      customfavIcon: '/favicon.ico',
      customCss: '.swagger-ui .topbar { display: none }',
    });
    
    await cachedApp.init();
  }
  return cachedApp;
};

// Default export for Vercel
export default async (req: any, res: any) => {
  try {
    
    const app = await createApp();
    const httpAdapter = app.getHttpAdapter();
    const expressInstance = httpAdapter.getInstance();
    
    // Handle the request directly with Express
    expressInstance(req, res);
    
  } catch (error: any) {
    if (!res.headersSent) {
      res.status(500).json({ 
        error: 'Internal server error', 
        message: error.message 
      });
    }
  }
};
