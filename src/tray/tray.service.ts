import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Tray, TrayDocument } from './tray.schema';
import { BaseService } from 'src/base/base.service';
import { Jar } from 'src/jar/jar.schema';
import { MqttService } from 'src/mqtt/mqtt.service';
import { UpdateTrayDto } from './tray.dto';

@Injectable()
export class TrayService extends BaseService<TrayDocument> {
  constructor(
    @InjectModel(Tray.name) private readonly trayModel: Model<TrayDocument>,
    @InjectModel(Jar.name) private readonly jarModel: Model<Jar>,
    private readonly mqttService: MqttService,
  ) {
    super(trayModel);
  }

  async getTrayWithJars(id: string): Promise<any> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid tray ID format');
    }

    const tray = await this.trayModel.findById(id).exec();
    if (!tray) {
      throw new NotFoundException('Tray not found');
    }

    const jars = await this.jarModel.find({ trayId: tray._id }).exec();

    return {
      _id: tray._id.toString(),
      name: tray.name,
      macAddress: tray.macAddress,
      userId: tray.user.toString(),
      jarCount: tray.jarCount,
      battery: tray.battery,
      showBattery: tray.showBatteryPercentage,
      showJarCount: tray.showJarCounts,
      showJarDetails: tray.showJarDetails,
      wifiCred: tray.wifiCred,
      jars: jars.map(jar => ({
        _id: jar._id.toString(),
        name: jar.name,
        uniqueId: jar.uniqueId,
        quantity: jar.quantity,
        expirtyDate: jar.expirtyDate,
        showQuantity: jar.showQuantity,
        primaryPosition: jar.primaryPosition,
        assignedPosition: jar.assignedPosition,
      })),
    };
  }
  async update(id: string, trayData: UpdateTrayDto): Promise<any> {
    const updatedTray = await this.trayModel.findByIdAndUpdate(id, { ...trayData, mqttUpdate: false }, { new: true });

    if (!updatedTray) {
      throw new NotFoundException('Tray not found');
    }

    await this.publishTrayUpdate(updatedTray);

    const jars = await this.jarModel.find({ trayId: updatedTray._id });
    const responseData = {
      _id: updatedTray._id,
      name: updatedTray.name,
      macAddress: updatedTray.macAddress,
      userId: updatedTray.user.toString(),
      jarCount: updatedTray.jarCount,
      battery: updatedTray.battery,
      showBattery: updatedTray.showBatteryPercentage,
      showJarCount: updatedTray.showJarCounts,
      showJarDetails: updatedTray.showJarDetails,
      wifiCred: {
        ssid: updatedTray.wifiCred.ssid,
        password: updatedTray.wifiCred.password,
      },
      jars: jars.map(jar => ({
        _id: jar._id.toString(),
        name: jar.name,
        uniqueId: jar.uniqueId,
        quantity: jar.quantity,
        expirtyDate: jar.expirtyDate,
        showQuantity: jar.showQuantity,
        primaryPosition: jar.primaryPosition,
        assignedPosition: jar.assignedPosition,
      })),
    };

    return {
      status: true,
      data: responseData,
    };
  }

  async publishTrayUpdate(tray: TrayDocument) {
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

    try {
      await this.mqttService.publishUpdatedData(trayData);
    } catch (error) {
      console.error('Error publishing tray update to MQTT:', error);
    }
  }
}