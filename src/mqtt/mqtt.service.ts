import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as mqtt from 'mqtt';

@Injectable()
export class MqttService implements OnModuleInit, OnModuleDestroy {
  private client: mqtt.MqttClient;

  onModuleInit() {
    const brokerUrl = 'mqtt://broker.emqx.io'; 

    this.client = mqtt.connect(brokerUrl, {
      port: 1883, 
    });

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

    this.client.on('message', (topic, message) => {
      console.log(`Received message on topic ${topic}: ${message.toString()}`);
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

  onModuleDestroy() {
    if (this.client) {
      this.client.end();
    }
  }
}
