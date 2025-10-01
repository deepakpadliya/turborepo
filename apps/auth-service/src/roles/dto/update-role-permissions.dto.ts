import { IsArray, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRolePermissionsDto {
  @ApiProperty({ type: [String], description: 'Array of permissions to update for the role', example: ['read:users', 'write:users', 'delete:users'], required: false })
  @IsArray()
  @IsOptional()
  permissions?: string[];
}