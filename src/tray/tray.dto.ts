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
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsBoolean()
  showBatteryPercentage?: boolean;

  @IsOptional()
  @IsBoolean()
  showJarCounts?: boolean;

  @IsOptional()
  @IsBoolean()
  showJarDetails?: boolean;

  @IsOptional() 
  mqttUpdate?: boolean;

 
}
  