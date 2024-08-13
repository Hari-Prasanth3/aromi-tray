import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tray, TrayDocument } from './tray.schema';

@Injectable()
export class TrayService {
  constructor(
    @InjectModel(Tray.name) private readonly trayModel: Model<TrayDocument>,
  ) {}

  async getTrayById(id: string): Promise<Tray | null> {
    return this.trayModel.findById(id).exec();
  }

  async updateTray(id: string, trayData: Partial<Tray>): Promise<Tray | null> {
    return this.trayModel.findByIdAndUpdate(id, trayData, { new: true }).exec();
  }

  async deleteTray(id: string): Promise<Tray | null> {
    return this.trayModel.findByIdAndDelete(id).exec();
  }
}