import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { Form } from './form.schema';

export type FormSubmissionDocument = FormSubmission & Document;

@Schema({ timestamps: true })
export class FormSubmission {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: Form.name, required: true, index: true })
  formId!: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.Mixed, required: true })
  data!: Record<string, unknown>;

  @Prop({ type: String })
  submittedBy?: string;
}

export const FormSubmissionSchema = SchemaFactory.createForClass(FormSubmission);
