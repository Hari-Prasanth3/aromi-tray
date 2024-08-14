import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Jar, JarDocument } from './jar.schema';
import { CreateJarDto, UpdateJarDto } from './jar.dto';
import { BaseService } from 'src/base/base.service';
import { TrayService } from 'src/tray/tray.service';

@Injectable()
export class JarService extends BaseService<JarDocument> {
  constructor(
    @InjectModel(Jar.name) 
    private readonly jar: Model<JarDocument>,
    private readonly trayService: TrayService,


  ) {
    super(jar)
  }


  async createJar(jarData: CreateJarDto): Promise<Jar> {
    const newJar = new this.jar(jarData);
    return newJar.save();
  }
  async getJarsByTrayId(trayId: string): Promise<Jar[]> {
    return this.jar.find({ trayId }).exec();
  }


  
  async update(id: string, jarData: UpdateJarDto): Promise<JarDocument | null> {
    const updatedJar = await this.jar.findByIdAndUpdate(id, jarData, { new: true });

    if (updatedJar) {
      await this.trayService.update(updatedJar.trayId.toString(), { mqttUpdate: false }); 
    }

    return updatedJar;
  }
}

