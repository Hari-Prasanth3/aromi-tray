import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Tray, TraySchema } from '../tray/tray.schema';
import { Jar, JarSchema } from '../jar/jar.schema';
import { TrayService } from './tray.service';
import { TrayController } from './tray.controller';
import { MqttService } from '../mqtt/mqtt.service';
import { AuthGuard } from 'src/utils/authGuard';
import { User, userSchema } from 'src/user/user.schema';
import { UserModule } from 'src/user/user.module';
import { JarModule } from 'src/jar/jar.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tray.name, schema: TraySchema }]),
    MongooseModule.forFeature([{ name: Jar.name, schema: JarSchema }]), 
    MongooseModule.forFeature([{ name: User.name, schema: userSchema }]),
    UserModule,
    JarModule,
    
  ],
  controllers: [TrayController],
  providers: [TrayService, MqttService,AuthGuard],
  exports: [TrayService,MqttService,MongooseModule],

})
export class TrayModule {}
