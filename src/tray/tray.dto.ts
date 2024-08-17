import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
export class UpdateTrayDto {
  @IsNotEmpty()
  @IsString()
  name?: string;

  @IsNotEmpty()
  @IsBoolean()
  showBatteryPercentage?: boolean;

  @IsNotEmpty()
  @IsBoolean()
  showJarCounts?: boolean;

  @IsNotEmpty()
  @IsBoolean()
  showJarDetails?: boolean;

  @IsOptional() 
  mqttUpdate?: boolean;

 
}
  