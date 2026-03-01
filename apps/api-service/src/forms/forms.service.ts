import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { randomUUID } from 'crypto';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { Form, FormDocument } from './schemas/form.schema';
import { CreateFormSubmissionDto } from './dto/create-form-submission.dto';
import { UpdateFormSubmissionDto } from './dto/update-form-submission.dto';
import { FormSubmission, FormSubmissionDocument } from './schemas/form-submission.schema';

@Injectable()
export class FormsService {
  constructor(
    @InjectModel(Form.name) private readonly formModel: Model<FormDocument>,
    @InjectModel(FormSubmission.name) private readonly submissionModel: Model<FormSubmissionDocument>,
  ) {}

  async createForm(dto: CreateFormDto) {
    const created = new this.formModel(dto);
    return created.save();
  }

  async findAllForms() {
    return this.formModel.find().sort({ createdAt: -1 });
  }

  async findFormById(formId: string) {
    if (!Types.ObjectId.isValid(formId)) {
      throw new NotFoundException('Form not found');
    }

    const form = await this.formModel.findById(formId);
    if (!form) {
      throw new NotFoundException('Form not found');
    }

    return form;
  }

  async publishForm(formId: string) {
    const form = await this.findFormById(formId);
    if (!form.publicId) {
      form.publicId = randomUUID().replace(/-/g, '');
    }
    form.isPublished = true;
    const saved = await form.save();

    return {
      formId: String(saved._id),
      publicId: saved.publicId,
      sharePath: `/forms/public/${saved.publicId}`,
      isPublished: saved.isPublished,
    };
  }

  async getPublishedForm(publicId: string) {
    const form = await this.formModel.findOne({ publicId, isPublished: true });
    if (!form) {
      throw new NotFoundException('Published form not found');
    }

    return {
      publicId: form.publicId,
      title: form.title,
      description: form.description,
      templateId: form.templateId,
      groupOrder: form.groupOrder,
      groupData: form.groupData,
      fields: form.fields,
    };
  }

  async createPublicSubmission(publicId: string, dto: CreateFormSubmissionDto) {
    const form = await this.formModel.findOne({ publicId, isPublished: true });
    if (!form) {
      throw new NotFoundException('Published form not found');
    }

    const created = new this.submissionModel({
      formId: form._id,
      data: dto.data,
      submittedBy: dto.submittedBy,
    });

    return created.save();
  }

  async updateForm(formId: string, dto: UpdateFormDto) {
    if (!Types.ObjectId.isValid(formId)) {
      throw new NotFoundException('Form not found');
    }

    const updated = await this.formModel.findByIdAndUpdate(formId, dto, { new: true });
    if (!updated) {
      throw new NotFoundException('Form not found');
    }

    return updated;
  }

  async deleteForm(formId: string) {
    if (!Types.ObjectId.isValid(formId)) {
      throw new NotFoundException('Form not found');
    }

    const deleted = await this.formModel.findByIdAndDelete(formId);
    if (!deleted) {
      throw new NotFoundException('Form not found');
    }

    await this.submissionModel.deleteMany({ formId: deleted._id });
    return { message: 'Form deleted successfully' };
  }

  async createSubmission(formId: string, dto: CreateFormSubmissionDto) {
    const form = await this.findFormById(formId);

    const created = new this.submissionModel({
      formId: form._id,
      data: dto.data,
      submittedBy: dto.submittedBy,
    });

    return created.save();
  }

  async listSubmissionsByForm(formId: string) {
    await this.findFormById(formId);

    return this.submissionModel
      .find({ formId })
      .sort({ createdAt: -1 });
  }

  async findSubmissionById(submissionId: string) {
    if (!Types.ObjectId.isValid(submissionId)) {
      throw new NotFoundException('Form submission not found');
    }

    const submission = await this.submissionModel.findById(submissionId);
    if (!submission) {
      throw new NotFoundException('Form submission not found');
    }

    return submission;
  }

  async updateSubmission(submissionId: string, dto: UpdateFormSubmissionDto) {
    if (!Types.ObjectId.isValid(submissionId)) {
      throw new NotFoundException('Form submission not found');
    }

    const updated = await this.submissionModel.findByIdAndUpdate(
      submissionId,
      {
        data: dto.data,
        submittedBy: dto.submittedBy,
      },
      { new: true },
    );

    if (!updated) {
      throw new NotFoundException('Form submission not found');
    }

    return updated;
  }

  async deleteSubmission(submissionId: string) {
    if (!Types.ObjectId.isValid(submissionId)) {
      throw new NotFoundException('Form submission not found');
    }

    const deleted = await this.submissionModel.findByIdAndDelete(submissionId);
    if (!deleted) {
      throw new NotFoundException('Form submission not found');
    }

    return { message: 'Submission deleted successfully' };
  }
}
