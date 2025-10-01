import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LocalAuthDto {
  @ApiProperty({ type: String, name: 'email', description: 'User email address', example: 'user@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ type: String, name: 'password', description: 'User password', example: 'strongPassword123' })
  @IsNotEmpty()
  password!: string;
}
