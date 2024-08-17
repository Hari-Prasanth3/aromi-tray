import { Injectable, HttpException, HttpStatus, UnprocessableEntityException, BadRequestException, NotFoundException, InternalServerErrorException, UnauthorizedException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SendOtpDto, VerifyOtpDto, RefreshTokensDto } from './auth.dto';
import { User, UserDocument } from '../user/user.schema';
import { Twilio } from 'twilio'; 
import * as jwt from 'jsonwebtoken';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt'; 
import { UserService } from 'src/user/user.service';
import { errMessage } from 'src/utils/apiResponse';
const Axios = require('axios')

const Verifier = require('apple-signin-verify-token');

@Injectable()
export class AuthService {
  private otpExpirationTime: number;
  private readonly twilioClient: Twilio;
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    @InjectModel('User') private readonly userModel: Model<UserDocument>
  ) {
    this.otpExpirationTime = Number(this.configService.get<string>('OTP_EXPIRATION_TIME')) || 30 * 1000;

    this.twilioClient = new Twilio(
      this.configService.get<string>('TWILIO_ACCOUNT_SID'),
      this.configService.get<string>('TWILIO_AUTH_TOKEN')
    );
  }


  async sendOtp(sendOtpDto: SendOtpDto): Promise<{ tempToken: string, status: string }> {
    const { phoneNumber } = sendOtpDto;

    const phoneNumberDigitsOnly = phoneNumber.replace(/^\+(\d{1,3})/, '');

    if (!/^\d{10}$/.test(phoneNumberDigitsOnly)) {
        throw new BadRequestException('Phone number must be 10 digits long.');
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const otpCreatedAt = new Date();

    const tempData = JSON.stringify({ phoneNumber });
    const tempToken = Buffer.from(tempData).toString('base64');

    console.log(otp, 'otp');

    try {
        const user = await this.userModel.findOne({ phoneNumber }).lean();

        if (user) {
            if (user.status === 'deleted') {
                throw new BadRequestException('Your account has been deleted.');
            }

            await this.userModel.findOneAndUpdate(
                { phoneNumber },
                { otp, otpCreatedAt, status: user.status === 'completed' ? 'completed' : 'pending' },
                { new: true }
            );

            return { tempToken, status: user.status === 'completed' ? 'completed' : 'pending' };
        } else {
            await this.userModel.create({ phoneNumber, otp, otpCreatedAt, status: 'pending' });
            return { tempToken, status: 'pending' };
        }
    } catch (error) {
        console.error('Error sending OTP:', error.message);

        if (error instanceof BadRequestException) {
            throw error;
        } else {
            throw new InternalServerErrorException('Failed to send OTP. Please try again later.');
        }
    }
}

async verifyOtp(otp: string, tempToken: string): Promise<{ _id: string, phoneNumber: string, accessToken: string, refreshToken: string, notification: boolean, status: string }> {
  try {
    if (!tempToken) {
      throw new BadRequestException('Token must be provided');
    }

    let decodedToken: any;
    try {
      const decodedString = Buffer.from(tempToken, 'base64').toString('utf-8');
      decodedToken = JSON.parse(decodedString);
    } catch (err) {
      throw new BadRequestException('Invalid token format');
    }

    const currentTime = new Date();
    const user = await this.userModel.findOne({ phoneNumber: decodedToken.phoneNumber }) as UserDocument;

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const otpValid = otp === user.otp;
    const otpNotExpired = (currentTime.getTime() - new Date(user.otpCreatedAt).getTime()) < this.otpExpirationTime;

    if (!otpValid) {
      throw new BadRequestException('Invalid OTP');
    }
    if (!otpNotExpired) {
      throw new BadRequestException('OTP expired');
    }

    user.status = 'completed';
    user.accessToken = generateAccessToken(user._id.toString(), user.phoneNumber, user.email || '', this.configService);
    user.refreshToken = generateRefreshToken(user._id.toString(), user.phoneNumber, user.email || '', this.configService);
    
    await user.save();

    return { 
      _id: user._id.toString(), 
      phoneNumber: user.phoneNumber, 
      notification: user.notification, 
      accessToken: user.accessToken, 
      refreshToken: user.refreshToken, 
      status: user.status 
    };
  } catch (error) {
    console.error('Error verifying OTP:', error.message);

    if (error instanceof BadRequestException || error instanceof NotFoundException) {
      throw error;
    } else {
      throw new InternalServerErrorException('An unexpected error occurred during OTP verification');
    }
  }
}

  
  
  


  async refreshTokens(refreshTokensDto: RefreshTokensDto): Promise<{ accessToken: string, refreshToken: string }> {
    const { refreshToken } = refreshTokensDto;
  
    try {
      const decodedToken: any = jwt.verify(refreshToken, this.configService.get<string>('REFRESH_TOKEN_SECRET'));
  
      const userId = decodedToken.userId;
      const phoneNumber = decodedToken.phoneNumber || '';
      const email = decodedToken.email || ''; 
  
      const newAccessToken = generateAccessToken(userId, phoneNumber, email, this.configService);
      const newRefreshToken = generateRefreshToken(userId, phoneNumber, email, this.configService);
  
      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
      console.error('Error refreshing tokens:', error.message);
  
      if (error.name === 'TokenExpiredError') {
        throw new BadRequestException('Refresh token expired');
      }
      if (error.name === 'JsonWebTokenError') {
        throw new BadRequestException('Invalid refresh token');
      }
      throw new BadRequestException('Invalid refresh token');
    }
  }


  
  async loginWithGOOGLE(reqBody: any): Promise<any> {
    try {
      const config = {
        method: 'get',
        url: `https://oauth2.googleapis.com/tokeninfo?id_token=${reqBody.token}`,
      };
console.log();

      let result = await Axios(config);
      result = result?.data;
      if (!result || !result?.email) {
        throw new UnauthorizedException(errMessage.GOOGLE_LOGIN_FAILED);
      }

      console.log('Google Login result', { result });

      const obj = {
        email: result.email.trim().toLowerCase(),
        firstName: result.given_name,
        lastName: result.family_name,
        avatar: result.picture,
        isEmailVerified: true,
      };

      return await this.GoogleLogin(obj);
    } catch (error) {
     console.log
     ('Login with Google', error);
      throw new UnauthorizedException(error.message)
    }
  }

  async findOne(userId: string): Promise<User | null> {
    try {
      return await this.userModel.findById(userId);
    } catch (error) {
      console.error('Error in findOne method:', error);
      throw new BadRequestException('Database query failed');
    }
  }
  async GoogleLogin(obj: any) {
    try {
      const email = obj.email.trim().toLowerCase();
      
      const existingUser = await this.userService.findOne({ email });
      
      if (existingUser) {
        return await this.userService.update(existingUser._id, {
          ...obj,
          name: obj.firstName,
          isEmailVerified: true,
          lastLogin: new Date(),
        });
      } else {
        const newUser = await this.userService.create({
          ...obj,
          name: obj.firstName,
          isEmailVerified: true,
          lastLogin: new Date(),
        });
        
        return newUser;
      }
    } catch (error) {
      this.logger.error('User Login Error:', error);
      throw new UnauthorizedException(error.message);
    }
  }
  

  async loginWithApple(reqBody: any): Promise<any> {
    try {
      const result = await Verifier.verify(reqBody.token);
      this.logger.log('Apple Login result', { result });
      console.log(result, 'service');
  
      if (!result) {
        throw new UnauthorizedException('Apple Login Failed');
      }
  
      if (!result.email) {
        throw new UnauthorizedException('Enable Apple Login Future..!');
      }
  
      const obj = {
        email: result.email,
        firstName: result.email.split('@')[0],
        avatar: "",
      };
  
      const user = await this.GoogleLogin(obj);
  
      if (user.data.status === 'pending') {
        user.data.status = 'completed';
        await this.userService.update(user.data._id, { status: 'completed' });
      }
  
      return user;
    } catch (error) {
      this.logger.error('Login with Apple', error);
      throw new UnauthorizedException(error.message);
    }
  }
  

  
}
