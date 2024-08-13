import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../user/user.schema';
import { Jar } from '../jar/jar.schema';

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

  @Prop({ required: true,unique:true })
  macAddress: string;

  @Prop({ required: true })
  jarCount: number;

  @Prop({ required: true })
  battery: number;

  @Prop({ type: Object })
  wifiCred: {
    ssid: string;
    password: string;
  };

  
}

export const TraySchema = SchemaFactory.createForClass(Tray);
