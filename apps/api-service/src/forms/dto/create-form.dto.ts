import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';
import { FormFieldDto } from './form-field.dto';

export class CreateFormDto {
  @ApiProperty({ type: String, description: 'Form title', example: 'Employee Onboarding' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'Form description/purpose',
    example: 'Collect onboarding details for new employees',
  })
  @IsOptional()
  @IsString()
  description!: string;

  @ApiProperty({
    type: [FormFieldDto],
    required: false,
    description: 'Structured list of form fields',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FormFieldDto)
  fields?: FormFieldDto[];

  @ApiProperty({
    type: String,
    required: false,
    description: 'Optional template identifier',
    example: 'template_123',
  })
  @IsOptional()
  @IsString()
  templateId?: string;

  @ApiProperty({
    type: [String],
    required: false,
    description: 'Ordered list of form group ids',
    example: ['personal_details'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  groupOrder?: string[];

  @ApiProperty({
    type: Object,
    required: false,
    description: 'Form groups and fields keyed by group id',
    example: {
      personal_details: {
        label: 'Personal Details',
        fields: [{ id: 'first_name-text-0', label: 'First Name', type: 'text' }],
      },
    },
  })
  @IsOptional()
  @IsObject()
  groupData?: Record<string, unknown>;
}
