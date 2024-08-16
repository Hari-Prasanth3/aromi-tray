import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
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

      this.client.subscribe('test_smart/ack', (err) => {
        if (err) {
          console.error('Failed to subscribe to acknowledgment topic:', err);
        } else {
          console.log('Subscribed to acknowledgment topic');
        }
      });
    });

    this.client.on('message', async (topic, message) => {
      const data = JSON.parse(message.toString());
      if (topic === 'test_smart') {
        await this.handleMqttData(data);
      } else if (topic === 'test_smart/ack') {
        await this.handleAcknowledgment(data);
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
    // console.log('Data received for tray:', data);

    const existingTray = await this.trayModel.findOne({ macAddress: data.macAddress });

    if (!existingTray) {
      const newTray = new this.trayModel({
        name: data.name,
        macAddress: data.macAddress,
        user: new Types.ObjectId(data.userId),
        jarCount: data.jarCount,
        battery: data.battery,
        showBatteryPercentage: data.showBattery,
        showJarCounts: data.showJarCount,
        showJarDetails: data.showJarDetails,
        wifiCred: {
          ssid: data.wifiCred?.ssid || '',
          password: data.wifiCred?.password || '',
        },
      });

      try {
        const savedTray = await newTray.save() as TrayDocument;
        console.log('Tray details saved successfully:', savedTray);
        await this.saveJars(data.jars, savedTray._id as Types.ObjectId);
        
        this.publishAcknowledgment(savedTray.macAddress);
      } catch (error) {
        console.error('Error saving tray details:', error);
      }
    } 
  }

  async saveJars(jars: any[], trayId: Types.ObjectId) {
    if (!jars || jars.length === 0) {
      console.log('No jars to save.');
      return;
    }

    await this.jarModel.deleteMany({ trayId });

    const jarDocuments = jars.map(jar => ({
      trayId,
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
  async publishUpdatedData(data: any) {
    console.log('Publishing updated data to MQTT:', data);

    this.client.publish('test_smart', JSON.stringify(data), {}, (error) => {
      if (error) {
        console.error('Error publishing updated data to MQTT:', error);
      } else {
        console.log('Published updated data to MQTT:', data);
      }
    });
  }

  async publishAcknowledgment(macAddress: string) {
    const ackMessage = {
      macAddress: macAddress,
      status: 'success',
    };

    this.client.publish('test_smart/ack', JSON.stringify(ackMessage), {}, (error) => {
      if (error) {
        console.error('Error publishing acknowledgment:', error);
      } else {
        console.log('Acknowledgment published:', ackMessage);
      }
    });
  }

  async handleAcknowledgment(data: any) {
    const { macAddress } = data;

    const tray = await this.trayModel.findOne({ macAddress });
    if (tray) {
      tray.mqttUpdate = true;
      await tray.save();
      console.log(`Acknowledgment received for tray ${macAddress}. mqttUpdate set to true.`);
    }
  }
  onModuleDestroy() {
    if (this.client) {
      this.client.end();
    }
  }
}