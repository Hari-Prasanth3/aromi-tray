import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Tray } from 'src/tray/tray.schema';


export type JarDocument = Jar & Document;

@Schema({ timestamps: true, strict: true })
export class Jar {


  @Prop({ type: MongooseSchema.Types.ObjectId, ref: Tray.name, required: true })
  trayId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true ,unique: true})
  uniqueId: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  expirtyDate: string;

  @Prop({ default: false })
  showQuantity: boolean;

  @Prop({ required: true })
  primaryPosition: number;

  @Prop({ required: true })
  assignedPosition: number;
}

export const JarSchema = SchemaFactory.createForClass(Jar);
