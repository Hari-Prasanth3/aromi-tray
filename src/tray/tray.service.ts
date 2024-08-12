import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tray } from './tray.schema';
import { User } from '../user/user.schema';
import { CreateTrayDto } from './tray.dto';

@Injectable()
export class TrayService {
  constructor(
    @InjectModel(Tray.name) private trayModel: Model<Tray>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async create(createTrayDto: CreateTrayDto, userId: string): Promise<Tray> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const createdTray = new this.trayModel({
      ...createTrayDto,
      user: userId,
    });

    return createdTray.save();
  }
}
