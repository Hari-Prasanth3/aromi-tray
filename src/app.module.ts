import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module'; 
import { config } from './config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MqttService } from './mqtt/mqtt.service';
import { TrayModule } from './tray/tray.module';
import { JarModule } from './jar/jar.module';
import { MqttModule } from './mqtt/mqtt.module';
import { ScheduleModule } from '@nestjs/schedule';
import { UpdatePublisherService } from './utils/UpdatePublisherService';
import { Tray, TraySchema } from './tray/tray.schema';
import { Jar, JarSchema } from './jar/jar.schema';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forRoot(config.dbUrl),
    MongooseModule.forFeature([
      { name: Tray.name, schema: TraySchema },
      { name: Jar.name, schema: JarSchema },
    ]),
    ConfigModule.forRoot({ isGlobal: true }), 
   MqttModule,
    AuthModule,
    UserModule,
    TrayModule,
    JarModule,
    
  ],
  controllers:[AppController],
  providers:[AppService,UpdatePublisherService
    // MqttService
  ]
})
export class AppModule {}