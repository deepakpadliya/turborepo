import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { HealthModule } from './health/health.module';
import { FormsModule } from './forms/forms.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uri =
          configService.get<string>('MONGO_URI') ||
          'mongodb://localhost:27017/api_service';
        return {
          uri,
        } as any;
      },
      inject: [ConfigService],
    }),
    HealthModule,
    FormsModule,
  ],
})
export class AppModule {}
