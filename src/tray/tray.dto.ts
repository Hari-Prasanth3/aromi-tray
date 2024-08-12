import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTrayDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  showBatteryPercentage: boolean;

  @IsBoolean()
  showJarCounts: boolean;

  @IsBoolean()
  showJarDetails: boolean;

  @IsString()
  @IsNotEmpty()
  user: string; 
}

export class UpdateTrayDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsBoolean()
  @IsOptional()
  showBatteryPercentage?: boolean;

  @IsBoolean()
  @IsOptional()
  showJarCounts?: boolean;

  @IsBoolean()
  @IsOptional()
  showJarDetails?: boolean;

  @IsString()
  @IsOptional()
  user?: string;
}