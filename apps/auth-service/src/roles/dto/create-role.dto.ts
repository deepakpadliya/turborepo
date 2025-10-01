import { IsString, IsArray, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({ type: String, name: 'name', description: 'Role name', example: 'admin' })
  @IsString()
  name!: string;

  @ApiProperty({ type: [String], description: 'Array of permissions for the role', example: ['read:users', 'write:users'], required: false })
  @IsArray()
  @IsOptional()
  permissions?: string[];
}