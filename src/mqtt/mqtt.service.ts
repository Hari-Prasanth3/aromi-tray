import { Injectable, OnModuleInit, OnModuleDestroy, BadRequestException } from '@nestjs/common';
import * as mqtt from 'mqtt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Tray, TrayDocument } from '../tray/tray.schema';
import { Jar, JarDocument } from '../jar/jar.schema';

@Injectable()
export class MqttService implements OnModuleInit, OnModuleDestroy {
  private client: mqtt.MqttClient;

  constructor(
    @InjectModel(Tray.name) private readonly trayModel: Model<TrayDocument>,
    @InjectModel(Jar.name) private readonly jarModel: Model<JarDocument>,
  ) {}

  onModuleInit() {
    const brokerUrl = 'mqtt://broker.emqx.io:1883';
    const options: mqtt.IClientOptions = {
      username: 'katomaran',
      password: 'KatoTest',
    };

    this.client = mqtt.connect(brokerUrl, options);

    this.client.on('connect', () => {
      console.log('Connected to MQTT broker');
      this.client.subscribe('test_smart', (err) => {
        if (err) {
          console.error('Failed to subscribe to topic:', err);
        } else {
          console.log('Subscribed to topic');
        }
      });
    });

    this.client.on('message', async (topic, message) => {
      try {
        const data = JSON.parse(message.toString());
        await this.handleMqttData(data);
      } catch (error) {
        console.error('Error handling MQTT data:', error);
      }
    });

    this.client.on('error', (err) => {
      console.error('MQTT client error:', err);
    });

    this.client.on('offline', () => {
      console.log('MQTT client is offline');
    });

    this.client.on('reconnect', () => {
      console.log('MQTT client is reconnecting');
    });

    this.client.on('close', () => {
      console.log('MQTT client connection closed');
    });
  }

  async handleMqttData(data: any) {
    // if (!data || !data.macAddress || !data.userId || !data.name) {
    //   throw new BadRequestException('Invalid data received: Missing required fields');
    // }

    const existingTray = await this.trayModel.findOne({ macAddress: data.macAddress });

    if (existingTray) {
      console.log('MAC address already exists. Skipping data save.');
      return;
    }

    if (!Types.ObjectId.isValid(data?.tray?.userId)) {
      throw new BadRequestException('Invalid user ID');
    }

    const newTray = new this.trayModel({
      name: data.name,
      macAddress: data.macAddress,
      user: new Types.ObjectId(data.userId),
      jarCount: data?.tray?.jarCount,
      battery: data?.tray?.battery,
      showBatteryPercentage: data?.tray?.showBattery, 
      showJarCounts: data?.tray?.showJarCount,
      showJarDetails: data?.tray?.showJarDetails,
      wifiCred: {
        ssid: data.wifiCred?.ssid || '',
        password: data.wifiCred?.password || '', 
      },
    });

    try {
      const savedTray = await newTray.save();
      console.log('Tray details saved successfully:', savedTray);

      await this.saveJars(data.jars, savedTray._id as Types.ObjectId);
    } catch (error) {
      console.error('Error saving tray details:', error);
    }
  }

  async saveJars(jars: any[], trayId: Types.ObjectId) {
    if (!jars || jars.length === 0) {
      console.log('No jars to save.');
      return;
    }

    const jarDocuments = jars.map(jar => ({
      trayId: trayId, 
      name: jar.name,
      uniqueId: jar.uniqueId,
      quantity: jar.quantity,
      expirtyDate: jar.expirtyDate,
      showQuantity: jar.showQuantity,
      primaryPosition: jar.primaryPosition,
      assignedPosition: jar.assignedPosition,
    }));

    try {
      await this.jarModel.insertMany(jarDocuments);
      console.log('Jar details saved successfully:', jarDocuments);
    } catch (error) {
      console.error('Error saving jar details:', error);
    }
  }

  async publishCombinedUpdate(data: any, callback: (error?: Error) => void) {
    console.log('Attempting to publish combined update to MQTT:', data);
    this.client.publish('test_smart', JSON.stringify(data), {}, (error) => {
      if (error) {
        console.error('Error publishing combined update to MQTT:', error);
        callback(error);
      } else {
        console.log('Published combined update to MQTT:', data);
        callback();
      }
    });
  }

  onModuleDestroy() {
    if (this.client) {
      this.client.end();
    }
  }
}