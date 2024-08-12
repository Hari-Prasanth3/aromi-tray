import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from './user.schema';
import { UserService } from './user.service'; 
import { UserController } from './user.controller';
import { AuthGuard } from 'src/utils/authGuard';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: userSchema }]),
    ConfigModule,
  ],
  providers: [UserService,AuthGuard],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
