import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class FormFieldDto {
  @ApiProperty({ type: String, description: 'Field identifier key', example: 'first_name' })
  @IsString()
  key!: string;

  @ApiProperty({ type: String, description: 'Field display label', example: 'First Name' })
  @IsString()
  label!: string;

  @ApiProperty({ type: String, description: 'Field input type', example: 'text' })
  @IsString()
  type!: string;

  @ApiProperty({ type: Boolean, required: false, description: 'Whether the field is mandatory', example: true })
  @IsOptional()
  @IsBoolean()
  required?: boolean;

  @ApiProperty({ type: [String], required: false, description: 'Selectable options for fields like dropdown/radio' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  options?: string[];
}
