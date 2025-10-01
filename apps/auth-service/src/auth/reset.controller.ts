import { Body, Controller, Post, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { randomBytes } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@ApiTags('auth')
@Controller('auth')
export class ResetController {
  constructor(
    @Inject(UsersService) private usersService: UsersService,
    @Inject(MailService) private mailService: MailService,
    @Inject(ConfigService) private cs: ConfigService,
  ) {}

  @ApiOperation({ summary: 'Request a password reset link' })
  @Post('forgot-password')
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({ status: 200, description: 'Password reset email sent (if user exists)' })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid email format' })
  async forgot(@Body() body: ForgotPasswordDto) {
    const user = await this.usersService.findByEmail(body.email);
    if (!user) return { ok: true };
    const token = randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + (Number(this.cs.get('RESET_TOKEN_EXPIRES_MIN') || 60) * 60 * 1000));
    await this.usersService.updateResetToken(body.email, token, expires);
    await this.mailService.sendResetEmail(body.email, token);
    return { ok: true };
  }

  @ApiOperation({ summary: 'Reset password with token' })
  @Post('reset-password')
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({ status: 200, description: 'Password successfully reset' })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid token or password' })
  @ApiResponse({ status: 410, description: 'Gone - Token expired or already used' })
  async reset(@Body() body: ResetPasswordDto) {
    await this.usersService.resetPassword(body.token, body.newPassword);
    return { ok: true };
  }
}
