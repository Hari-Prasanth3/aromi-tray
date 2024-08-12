import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../user/user.schema'; // Import the User schema

export type TrayDocument = Tray & Document;

@Schema({ toJSON: { virtuals: true }, timestamps: true, strict: true })
export class Tray {
  @Prop({ required: true })
  name: string;

  @Prop({ default: false })
  showBatteryPercentage: boolean;

  @Prop({ default: false })
  showJarCounts: boolean;

  @Prop({ default: false })
  showJarDetails: boolean;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name, required: true })
  user: MongooseSchema.Types.ObjectId; 
}

const traySchema = SchemaFactory.createForClass(Tray);

export { traySchema };
