import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type FormDocument = Form & Document;

@Schema({ _id: false })
class FormField {
  @Prop({ type: String, required: true })
  key!: string;

  @Prop({ type: String, required: true })
  label!: string;

  @Prop({ type: String, required: true })
  type!: string;

  @Prop({ type: Boolean, default: false })
  required!: boolean;

  @Prop({ type: [String], default: [] })
  options!: string[];
}

const FormFieldSchema = SchemaFactory.createForClass(FormField);

@Schema({ timestamps: true })
export class Form {
  @Prop({ type: String, required: true, trim: true })
  title!: string;

  @Prop({ type: String, default: '', trim: true })
  description!: string;

  @Prop({ type: String })
  templateId?: string;

  @Prop({ type: [String], default: [] })
  groupOrder!: string[];

  @Prop({ type: MongooseSchema.Types.Mixed, default: {} })
  groupData!: Record<string, unknown>;

  @Prop({ type: [FormFieldSchema], default: [] })
  fields!: FormField[];

  @Prop({ type: Boolean, default: false })
  isPublished!: boolean;

  @Prop({ type: String, index: true, unique: true, sparse: true })
  publicId?: string;
}

export const FormSchema = SchemaFactory.createForClass(Form);
