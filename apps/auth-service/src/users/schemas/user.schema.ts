import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, required: true, unique: true })
  email!: string;

  @Prop({ type: String, required: true })
  passwordHash!: string;

  @Prop({ type: Boolean, default: true })
  active!: Boolean;

  @Prop({ type: [String], default: [] })
  roles!: string[];

  @Prop({ type: String })
  resetToken?: string;

  @Prop({ type: Date })
  resetTokenExpiresAt?: Date;

  @Prop({ type: String })
  name?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
