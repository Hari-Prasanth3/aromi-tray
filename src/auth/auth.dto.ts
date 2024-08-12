import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SendOtpDto {
  @IsString()
  phoneNumber: string;
}


export class RefreshTokensDto {
  @IsString()
  refreshToken: string;
}

export class GoogleSignInDto {
  @IsString()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  profile?: string;
}

export class VerifyOtpDto {
  @IsString()
  otp: string;

  @IsString()
  tempToken: string;
}

export class LoginUserDto {
  @IsOptional()
  test: string
  
  @IsNotEmpty()
  idToken: string;
}


export class SocialLoginDto {
  @IsNotEmpty()
  idToken: string;
}