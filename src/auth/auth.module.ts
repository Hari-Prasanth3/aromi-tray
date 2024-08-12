import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from '../user/user.schema'; 
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ name: 'User', schema: userSchema }]),
    UserModule,
    
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {
  
}
