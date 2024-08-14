import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MqttService } from './mqtt.service';
import { Tray, TraySchema } from '../tray/tray.schema';
import { Jar, JarSchema } from '../jar/jar.schema'; 

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tray.name, schema: TraySchema }]),
    MongooseModule.forFeature([{ name: Jar.name, schema: JarSchema }]), 
  ],
  providers: [MqttService],
  exports: [MqttService],
})
export class MqttModule {}
