import { Body, Controller, Delete, Get, Param, Patch, Post, Inject } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FormsService } from './forms.service';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { CreateFormSubmissionDto } from './dto/create-form-submission.dto';
import { UpdateFormSubmissionDto } from './dto/update-form-submission.dto';

@ApiTags('forms')
@Controller('forms')
export class FormsController {
  constructor(@Inject(FormsService) private readonly formsService: FormsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a form template/metadata' })
  @ApiBody({ type: CreateFormDto })
  @ApiResponse({ status: 201, description: 'Form template created successfully' })
  createForm(@Body() dto: CreateFormDto) {
    return this.formsService.createForm(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all form templates' })
  @ApiResponse({ status: 200, description: 'List of form templates' })
  findAllForms() {
    return this.formsService.findAllForms();
  }

  @Post(':id/publish')
  @ApiOperation({ summary: 'Publish a form and generate a public link id' })
  @ApiResponse({ status: 200, description: 'Form published successfully' })
  publishForm(@Param('id') formId: string) {
    return this.formsService.publishForm(formId);
  }

  @Get('public/:publicId')
  @ApiOperation({ summary: 'Get published form by public id' })
  @ApiResponse({ status: 200, description: 'Published form details' })
  getPublishedForm(@Param('publicId') publicId: string) {
    return this.formsService.getPublishedForm(publicId);
  }

  @Post('public/:publicId/submissions')
  @ApiOperation({ summary: 'Submit data to a published form' })
  @ApiBody({ type: CreateFormSubmissionDto })
  @ApiResponse({ status: 201, description: 'Public form submission saved successfully' })
  createPublicSubmission(
    @Param('publicId') publicId: string,
    @Body() dto: CreateFormSubmissionDto,
  ) {
    return this.formsService.createPublicSubmission(publicId, dto);
  }

  @Post(':id/submissions')
  @ApiOperation({ summary: 'Save user-entered form submission data' })
  @ApiBody({ type: CreateFormSubmissionDto })
  @ApiResponse({ status: 201, description: 'Form submission saved successfully' })
  createSubmission(@Param('id') formId: string, @Body() dto: CreateFormSubmissionDto) {
    return this.formsService.createSubmission(formId, dto);
  }

  @Get(':id/submissions')
  @ApiOperation({ summary: 'List all submissions for a form' })
  @ApiResponse({ status: 200, description: 'List of submissions' })
  listSubmissionsByForm(@Param('id') formId: string) {
    return this.formsService.listSubmissionsByForm(formId);
  }

  @Get('submissions/:submissionId')
  @ApiOperation({ summary: 'Get a submission by id' })
  @ApiResponse({ status: 200, description: 'Submission details' })
  findSubmissionById(@Param('submissionId') submissionId: string) {
    return this.formsService.findSubmissionById(submissionId);
  }

  @Patch('submissions/:submissionId')
  @ApiOperation({ summary: 'Update a submission by id (admin)' })
  @ApiBody({ type: UpdateFormSubmissionDto })
  @ApiResponse({ status: 200, description: 'Submission updated successfully' })
  updateSubmission(
    @Param('submissionId') submissionId: string,
    @Body() dto: UpdateFormSubmissionDto,
  ) {
    return this.formsService.updateSubmission(submissionId, dto);
  }

  @Delete('submissions/:submissionId')
  @ApiOperation({ summary: 'Delete a submission by id (admin)' })
  @ApiResponse({ status: 200, description: 'Submission deleted successfully' })
  deleteSubmission(@Param('submissionId') submissionId: string) {
    return this.formsService.deleteSubmission(submissionId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a form template by id' })
  @ApiResponse({ status: 200, description: 'Form template details' })
  findFormById(@Param('id') formId: string) {
    return this.formsService.findFormById(formId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a form template' })
  @ApiBody({ type: UpdateFormDto })
  @ApiResponse({ status: 200, description: 'Form template updated successfully' })
  updateForm(@Param('id') formId: string, @Body() dto: UpdateFormDto) {
    return this.formsService.updateForm(formId, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete form template and all related submissions' })
  @ApiResponse({ status: 200, description: 'Form template deleted successfully' })
  deleteForm(@Param('id') formId: string) {
    return this.formsService.deleteForm(formId);
  }
}
