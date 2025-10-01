import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ type: String, name:'email', description: 'User email address', example: 'user@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ type: String, name:'password', description: 'User password', example: 'strongPassword123' })
  @IsNotEmpty()
  @MinLength(8)
  password!: string;

  @ApiProperty({ type: String, description: 'User full name', example: 'John Doe', required: false })
  @IsOptional()
  name?: string;
}
