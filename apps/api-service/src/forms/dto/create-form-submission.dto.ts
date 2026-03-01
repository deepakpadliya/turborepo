import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateFormSubmissionDto {
  @ApiProperty({
    type: Object,
    description: 'User-entered data for this form',
    example: { first_name: 'Alice', email: 'alice@example.com' },
  })
  @IsObject()
  @IsNotEmpty()
  data!: Record<string, unknown>;

  @ApiProperty({ type: String, required: false, description: 'Optional submitter identifier', example: 'user_123' })
  @IsOptional()
  @IsString()
  submittedBy?: string;
}
