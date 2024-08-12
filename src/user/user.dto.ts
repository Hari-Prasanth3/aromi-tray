import { IsString, IsEmail, IsBoolean, IsEnum, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  phoneNumber: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  profileUrl?: string;

  @IsString()
  @IsOptional()
  accessToken?: string;

  @IsString()
  @IsOptional()
  refreshToken?: string;

  @IsBoolean()
  @IsOptional()
  notification?: boolean;

  @IsEnum(['pending', 'completed', 'deleted'])
  @IsOptional()
  status?: string;
}

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  profileUrl?: string;

  @IsString()
  @IsOptional()
  accessToken?: string;

  @IsString()
  @IsOptional()
  refreshToken?: string;

  @IsBoolean()
  @IsOptional()
  notification?: boolean;

  @IsEnum(['pending', 'completed', 'deleted'])
  @IsOptional()
  status?: string;
}
