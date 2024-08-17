import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Notification, NotificationSchema } from './notification.schema';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { TrayModule } from '../tray/tray.module'; 
import { NotificationScheduler } from 'src/utils/notification.scheduler';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }]),
    TrayModule,
  ],
  providers: [NotificationService,NotificationScheduler],
  controllers: [NotificationController],
  exports:[NotificationService]
})
export class NotificationModule {}