import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateJarDto {
    @IsNotEmpty()
    @IsString()
    name:string
}