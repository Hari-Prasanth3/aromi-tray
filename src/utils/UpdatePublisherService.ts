import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tray, TrayDocument } from '../tray/tray.schema';
import { Jar, JarDocument } from '../jar/jar.schema';
import { MqttService } from '../mqtt/mqtt.service';

@Injectable()
export class UpdatePublisherService {
  constructor(
    @InjectModel(Tray.name) private readonly trayModel: Model<TrayDocument>,
    @InjectModel(Jar.name) private readonly jarModel: Model<JarDocument>,
    private readonly mqttService: MqttService,
  ) {}

  @Cron('*/30 * * * * *')
  async publishUpdates() {
    const traysToPublish = await this.trayModel.find({ mqttUpdate: false });

    const publishPromises = traysToPublish.map(async (tray) => {
      const jars = await this.jarModel.find({ trayId: tray._id });

      const trayData = {
        name: tray.name,
        macAddress: tray.macAddress,
        userId: tray.user.toString(),
        jarCount: tray.jarCount,
        battery: tray.battery,
        showBattery: tray.showBatteryPercentage,
        showJarCount: tray.showJarCounts,
        showJarDetails: tray.showJarDetails,
        wifiCred: {
          ssid: tray.wifiCred.ssid,
          password: tray.wifiCred.password,
        },
        jars: jars.map(jar => ({
          name: jar.name,
          uniqueId: jar.uniqueId,
          quantity: jar.quantity,
          expirtyDate: jar.expirtyDate,
          showQuantity: jar.showQuantity,
          primaryPosition: jar.primaryPosition,
          assignedPosition: jar.assignedPosition,
        })),
      };

      await this.mqttService.publishUpdatedData(trayData);

     
      await tray.save();
    });

    await Promise.all(publishPromises);
  }
}