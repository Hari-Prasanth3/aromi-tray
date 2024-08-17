import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin'; // Import Firebase Admin SDK
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification, NotificationDocument } from './notification.schema';
import { Tray, TrayDocument } from '../tray/tray.schema';
import { Jar, JarDocument } from '../jar/jar.schema';

@Injectable()
export class NotificationService {
    constructor(
        @InjectModel(Notification.name) private readonly notificationModel: Model<NotificationDocument>,
        @InjectModel(Tray.name) private readonly trayModel: Model<TrayDocument>, 
        @InjectModel(Jar.name) private readonly jarModel: Model<JarDocument>,   
      ) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(), // Use your Firebase credentials
    });
  }

  async createNotification(userId: string, message: string) {
    const notification = new this.notificationModel({ userId, message });
    await notification.save();
    return notification; 
  }

  async getUserNotifications(userId: string) {
    return this.notificationModel.find({ userId }).sort({ createdAt: -1 }).exec();
  }

  async markAsRead(notificationId: string) {
    return this.notificationModel.findByIdAndUpdate(notificationId, { read: true }, { new: true }).exec(); 
  }

  async sendPushNotification(userId: string, message: string) {
    const registrationToken = await this.getUserDeviceToken(userId); // Implement this method to fetch device token

    const payload = {
      notification: {
        title: 'Important Notification',
        body: message,
      },
    };

    try {
      await admin.messaging().sendToDevice(registrationToken, payload);
      console.log('Push notification sent successfully:', message);
    } catch (error) {
      console.error('Error sending push notification:', error);
    }
  }

  private async getUserDeviceToken(userId: string): Promise<string> {
    // Implement logic to retrieve the device token for the user
    // This might involve querying your database where you store user tokens
    return 'user-device-token'; // Replace with actual token retrieval logic
  }

  async checkConditionsAndNotify() {
    const trays = await this.trayModel.find().populate('user'); 

    for (const tray of trays) {
      await this.checkBatteryLevel(tray);
      await this.checkJarQuantity(tray);
      await this.checkJarExpiry(tray);
    }
  }

  private async checkBatteryLevel(tray: TrayDocument) {
    if (tray.battery < 20) {
      const message = `Battery level is low for tray ${tray.name}. Current level: ${tray.battery}%`;
      await this.createNotification(tray.user.toString(), message);
      await this.sendPushNotification(tray.user.toString(), message);
    }
  }

  private async checkJarQuantity(tray: TrayDocument) {
    const jars = await this.jarModel.find({ trayId: tray._id });
    const lowJarQuantityJars = jars.filter(jar => jar.quantity < 1);

    if (lowJarQuantityJars.length > 0) {
      const message = `Jar quantity is low for tray ${tray.name}. ${lowJarQuantityJars.length} jar(s) affected.`;
      await this.createNotification(tray.user.toString(), message);
      await this.sendPushNotification(tray.user.toString(), message);
    }
  }

  private async checkJarExpiry(tray: TrayDocument) {
    const jars = await this.jarModel.find({ trayId: tray._id });
    const currentDate = new Date();

    for (const jar of jars) {
      const expiryDate = new Date(jar.expirtyDate);
      const daysUntilExpiry = (expiryDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24);

      if (daysUntilExpiry <= 7) { 
        const message = `Jar ${jar.name} is nearing its expiry date: ${jar.expirtyDate}`;
        console.log(message,"message");
        
        await this.createNotification(tray.user.toString(), message);
        await this.sendPushNotification(tray.user.toString(), message);
      }
    }
  }
}