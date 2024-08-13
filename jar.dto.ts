import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateJarDto {
  @IsString()
  @IsNotEmpty()
  readonly uniqueId: string;

  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsNumber()
  @IsNotEmpty()
  readonly quantity: number;

  @IsString()
  @IsNotEmpty()
  readonly expiryDate: string;

  readonly showQuantity?: boolean;

  @IsNumber()
  @IsNotEmpty()
  readonly primaryPosition: number;

  @IsNumber()
  @IsNotEmpty()
  readonly assignedPosition: number;
}
