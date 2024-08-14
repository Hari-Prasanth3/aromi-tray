import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../user/user.schema';

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

  
  @Prop({ required: true, default: false })
  mqttUpdate: boolean;
}

export const TraySchema = SchemaFactory.createForClass(Tray);
