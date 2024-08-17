import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  async createNotification(@Body() body: { userId: string; message: string }) {
    return this.notificationService.createNotification(body.userId, body.message);
  }

  @Post('check-conditions')
  async checkConditionsAndNotify() {
    return this.notificationService.checkConditionsAndNotify();
  }

  @Get(':userId')
  async getUserNotifications(@Param('userId') userId: string) {
    return this.notificationService.getUserNotifications(userId);
  }

  @Post(':id/read')
  async markAsRead(@Param('id') id: string) {
    return this.notificationService.markAsRead(id);
  }
}