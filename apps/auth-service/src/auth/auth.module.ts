import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { ResetController } from './reset.controller';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    MailModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (cs: ConfigService) => {
        const secret = cs.get<string>('JWT_SECRET');

        if (!secret) {
          throw new Error('JWT_SECRET is required');
        }

        return {
          secret,
          signOptions: { expiresIn: cs.get<string>('JWT_EXPIRES_IN') || '3600s' },
        };
      },
    }),
  ],
  providers: [
    {
      provide: AuthService,
      useClass: AuthService,
    },
    {
      provide: JwtStrategy,
      useClass: JwtStrategy,
    }
  ],
  controllers: [AuthController, ResetController],
  exports: [AuthService],
})
export class AuthModule {}
