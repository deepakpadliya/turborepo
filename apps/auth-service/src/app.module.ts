import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { MailModule } from './mail/mail.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        join(process.cwd(), '.env.local'),
        join(process.cwd(), '.env'),
        join(process.cwd(), 'apps/auth-service/.env.local'),
        join(process.cwd(), 'apps/auth-service/.env'),
      ],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('MONGO_URI') || 'mongodb://localhost:27017/auth';
        return {
          uri,
        } as any; // Type assertion to work around strict type checking
      },
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    RolesModule,
    MailModule,
    HealthModule,
  ],
})
export class AppModule {}
