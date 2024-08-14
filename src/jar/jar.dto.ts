import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateJarDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  uniqueId: string;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  @IsString()
  expirtyDate: string;

  @IsNotEmpty()
  @IsBoolean()
  showQuantity: boolean;

  @IsNotEmpty()
  @IsNumber()
  primaryPosition: number;

  @IsNotEmpty()
  @IsNumber()
  assignedPosition: number;

  @IsNotEmpty()
  trayId: string;
}

export class UpdateJarDto {
    @IsNotEmpty()
    @IsString()
    name:string
}