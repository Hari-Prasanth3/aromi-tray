import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class NotificationScheduler {
  constructor(private readonly notificationService: NotificationService) {}

  @Cron(CronExpression.EVERY_HOUR) // Adjust the frequency as needed
  async checkForNotifications() {
    console.log('Checking for notifications...');
    await this.notificationService.checkConditionsAndNotify();
  }
}