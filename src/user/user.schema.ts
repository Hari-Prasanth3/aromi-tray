import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ toJSON: { virtuals: true }, timestamps: true, strict: true })
export class User {
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ unique: true })
  email: string;

  @Prop()
  lastName: string;

  @Prop({ default: "" })
  avatar: string;

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop()
  lastLogin: Date;

  @Prop({ unique: true })
  phoneNumber: string;

  @Prop()
  name: string;

  @Prop()
  accessToken: string;

  @Prop()
  refreshToken: string;

  @Prop({ default: false })
  notification: boolean;

  @Prop({ enum: ['pending', 'completed', 'deleted'], default: 'pending' })
  status: string;

  @Prop()
  otp: string;

  @Prop()
  otpCreatedAt: Date;
}

const userSchema = SchemaFactory.createForClass(User);

export { userSchema };
