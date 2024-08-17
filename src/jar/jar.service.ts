import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Jar, JarDocument } from './jar.schema';
import { UpdateJarDto } from './jar.dto';
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

  async update(id: string, jarData: UpdateJarDto): Promise<JarDocument | null> {
    const updatedJar = await this.jar.findByIdAndUpdate(id, jarData, { new: true });

    if (!updatedJar) {
        throw new NotFoundException('Tray not found');
      }
      await this.trayService.update(updatedJar.trayId.toString(), { mqttUpdate: false }); 
    

    return updatedJar;
  }
}

