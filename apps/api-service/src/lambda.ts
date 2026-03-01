import { NestFactory } from '@nestjs/core';
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

let cachedApp: INestApplication;

const createApp = async () => {
  if (!cachedApp) {
    cachedApp = await NestFactory.create(AppModule, {
      bodyParser: true,
      logger: ['error', 'warn'],
    });

    cachedApp.enableCors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      allowedHeaders: 'Content-Type,Authorization',
    });

    const config = new DocumentBuilder()
      .setTitle('API Service')
      .setDescription('Common backend API service')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(cachedApp, config);

    SwaggerModule.setup('api/docs', cachedApp, document, {
      swaggerOptions: {
        displayRequestDuration: true,
      },
      customSiteTitle: 'API Service Docs',
      customCss: '.swagger-ui .topbar { display: none }',
    });

    await cachedApp.init();
  }

  return cachedApp;
};

export default async (req: any, res: any) => {
  try {
    const app = await createApp();
    const httpAdapter = app.getHttpAdapter();
    const expressInstance = httpAdapter.getInstance();
    expressInstance(req, res);
  } catch (error: any) {
    if (!res.headersSent) {
      res.status(500).json({
        error: 'Internal server error',
        message: error.message,
      });
    }
  }
};
