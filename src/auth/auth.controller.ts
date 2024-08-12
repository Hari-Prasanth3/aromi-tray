import { Controller, Post, Body, Headers, HttpException, HttpStatus, BadRequestException, UnauthorizedException, Put, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SendOtpDto, VerifyOtpDto, RefreshTokensDto, GoogleSignInDto, LoginUserDto, SocialLoginDto } from './auth.dto';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt'; 
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.schema';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
    private readonly configService: ConfigService ,
    private readonly userService: UserService 

  ) {}

  @Post('send-otp')
  async sendOtp(@Body() sendOtpDto: SendOtpDto): Promise<{ status: boolean, data: { tempToken: string } }> {
    try {
      const tempToken = await this.authService.sendOtp(sendOtpDto);
      return {
        status: true,
        data: tempToken 
      };
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('verify-otp')
  async verifyOtp(
    @Body('otp') otp: string,
    @Headers('Authorization') authHeader: string
  ): Promise<{ status: boolean, data: { _id: string, phoneNumber: string, accessToken: string, refreshToken: string } }> {
    const tempToken = authHeader?.replace('Bearer ', '') || '';
    if (!tempToken) {
      throw new BadRequestException('Token must be provided');
    }
    try {
      const result = await this.authService.verifyOtp(otp, tempToken);
      return {
        status: true,
        data: result
      };
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  @Put('refresh')
public async refresh(@Body() reqBody: { refreshToken: string }): Promise<{ status: boolean, data: { accessToken: string, refreshToken: string } }> {
  try {
    const { refreshToken } = reqBody;

    if (!refreshToken) {
      throw new BadRequestException('Refresh token is required');
    }

    const decoded: any = verifyRefreshToken(refreshToken, this.configService);
    console.log('Decoded Token:', decoded);

    const user: User | null = await this.authService.findOne(decoded.userId);
    console.log('User:', user);

    if (!user) {
      throw new UnauthorizedException('Invalid Refresh token');
    }

    const accessToken = generateAccessToken(user._id.toString(), user.phoneNumber || '', user.email || '', this.configService);
    const newRefreshToken = generateRefreshToken(user._id.toString(), user.phoneNumber || '', user.email || '', this.configService);

    return {
      status: true,
      data: { accessToken, refreshToken: newRefreshToken }
    };

  } catch (error) {
    console.log('Refresh Token Error:', error);
    throw new UnauthorizedException(`Invalid Refresh token: ${error.message}`);
  }
}

 
  @Put('/login')
  async create(@Body() reqBody: LoginUserDto): Promise<any> {
    try {
      let user: any;
  
      if (reqBody.idToken === 'test') {
        const data = {
          email: 'test@gmail.com',
          firstName: 'test',
          lastName: 'test',
          avatar: 'https://lh3.googleusercontent.com/a/ACg8ocLkDDVv2dA4ukfqkcaDspPh-KOe4CNl6kf5qNsJSd3W=s96-c',
          isEmailVerified: true,
        };
        user = await this.authService.GoogleLogin(data);
      } else {
        user = await this.authService.loginWithGOOGLE({ token: reqBody.idToken });
      }
  
      const userData = user.data?._doc ? user.data?._doc : user.data;
  
      if (userData?.status === 'inactive') {
        throw new UnauthorizedException('User Login Failed..!');
      }
  
      await this.userService.update(userData._id, { status: 'completed' });
  
      const accessToken = generateAccessToken(
        userData._id,
        userData.phoneNumber || '', 
        userData.email || '',
        this.configService
      );
      const refreshToken = generateRefreshToken(
        userData._id,
        userData.phoneNumber || '', 
        userData.email || '',
        this.configService
      );
  
      return {
        status: true,
        data: {
          message: 'Updated Successfully..!',
          _id: userData._id,
          name: userData.name,
          email: userData.email,
          avatar: userData.avatar,
          isEmailVerified: userData.isEmailVerified,
          lastLogin: userData.lastLogin,
          notification: userData.notification,
          status: userData.status,
          createdAt: userData.createdAt,
          updatedAt: userData.updatedAt,
          accessToken,
          refreshToken,
        },
      };
  
    } catch (error) {
      console.log('Google Login Failed error', error);
      throw new UnauthorizedException('Google Login Failed error');
    }
  }
  
  

  @Put('apple-login')
  public async appleLogin(@Body() body: SocialLoginDto) {
  try {
    const user = await this.authService.loginWithApple({ token: body.idToken });
    console.log(user, 'user');

    const userData = user.data?._doc ? user.data?._doc : user.data;
    console.log(userData, "userData");

    const accessToken = generateAccessToken(
      userData._id,
      userData.phoneNumber || '',
      userData.email || '',
      this.configService
    );
    const refreshToken = generateRefreshToken(
      userData._id,
      userData.phoneNumber || '',
      userData.email || '',
      this.configService
    );

    return {
      status: true,
      message: 'Updated Successfully..!',
      data: {
        _id: userData._id,
        name: userData.name,
        email: userData.email,
        avatar: userData.avatar,
        isEmailVerified: userData.isEmailVerified,
        lastLogin: userData.lastLogin,
        notification: userData.notification,
        status: userData.status,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
        accessToken,
        refreshToken,
      },
    };
  } catch (error) {
    console.log('Apple login', error);
    throw new UnauthorizedException('Apple Login Failed error', error.message);
  }
}

  
  
}
