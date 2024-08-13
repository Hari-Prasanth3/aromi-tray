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
    const brokerUrl = 'tcp://68.183.247.103:15000';
    const options: mqtt.IClientOptions = {
      username: 'katomaran',
      password: 'KatoTest',
    };

    this.client = mqtt.connect(brokerUrl, options);

    this.client.on('connect', () => {
      console.log('Connected to MQTT broker');
      this.client.subscribe('/topic/qos1', (err) => {
        if (err) {
          console.error('Failed to subscribe to topic:', err);
        } else {
          console.log('Subscribed to topic');
        }
      });
    });

    this.client.on('message', async (topic, message) => {
      // console.log(`Received message on topic ${topic}: ${message.toString()}`);
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
    if (!data || !data.macAddress) {
      throw new BadRequestException('Invalid data received');
    }

    const existingTray = await this.trayModel.findOne({ macAddress: data.macAddress });

    if (existingTray) {
      console.log('MAC address already exists. Skipping data save.');
      return;
    }

    const newTray = new this.trayModel({
      name: data.name,
      macAddress: data.macAddress,
      user: data.userId, 
      jarCount: data.jarCount,
      battery: data.battery,
      showBatteryPercentage: data.showBattery, 
      showJarCounts: data.showJarCount,
      showJarDetails: data.showJarDetails,
      wifiCred: {
        ssid: data.wifiCred.ssid,
        password: data.wifiCred.password,
      },
    });

    // Save the tray document to the database
    try {
      const savedTray = await newTray.save();
      console.log('Tray details saved successfully:', savedTray);

      // Save the jars associated with this tray
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
      trayId: trayId, // Use the ObjectId directly
      name: jar.name,
      uniqueId: jar.uniqueId,
      quantity: jar.quantity,
      expirtyDate: jar.expirtyDate, // Store as a string
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

  onModuleDestroy() {
    if (this.client) {
      this.client.end();
    }
  }
}