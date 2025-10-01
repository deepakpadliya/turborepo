import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty({ type: String, name: 'email', description: 'User email address for password reset', example: 'user@example.com' })
  @IsEmail()
  email!: string;
}