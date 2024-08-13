import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Jar, JarDocument } from './jar.schema';

@Injectable()
export class JarService {
  constructor(
    @InjectModel(Jar.name) private readonly jarModel: Model<JarDocument>,
  ) {}

  async getJarById(id: string): Promise<Jar | null> {
    return this.jarModel.findById(id).exec();
  }

  async getJarsByTrayId(trayId: string): Promise<Jar[]> {
    return this.jarModel.find({ trayId }).exec();
  }

  async updateJar(id: string, jarData: Partial<Jar>): Promise<Jar | null> {
    return this.jarModel.findByIdAndUpdate(id, jarData, { new: true }).exec();
  }

  async deleteJar(id: string): Promise<Jar | null> {
    return this.jarModel.findByIdAndDelete(id).exec();
  }
}