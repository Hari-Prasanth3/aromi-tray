import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TrayController } from './tray.controller';
import { TrayService } from './tray.service';
import { Tray, traySchema } from './tray.schema';
import { User, userSchema } from '../user/user.schema'; 
import { AuthGuard } from 'src/utils/authGuard';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tray.name, schema: traySchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: userSchema }]),
    UserModule
  ],
  controllers: [TrayController],
  providers: [TrayService,AuthGuard],
})
export class TrayModule {}
