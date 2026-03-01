import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class UpdateFormSubmissionDto {
  @ApiProperty({
    type: Object,
    description: 'Updated user-entered data for this submission',
    example: { first_name: 'Alice', email: 'alice.updated@example.com' },
  })
  @IsObject()
  @IsNotEmpty()
  data!: Record<string, unknown>;

  @ApiProperty({ type: String, required: false, description: 'Optional submitter identifier', example: 'admin_updated' })
  @IsOptional()
  @IsString()
  submittedBy?: string;
}