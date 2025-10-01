import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({ type: String, name: 'token', description: 'Password reset token', example: 'abc123def456' })
  @IsString()
  token!: string;

  @ApiProperty({ type: String, name: 'newPassword', description: 'New password (minimum 8 characters)', example: 'newStrongPassword123' })
  @IsString()
  @MinLength(8)
  newPassword!: string;
}