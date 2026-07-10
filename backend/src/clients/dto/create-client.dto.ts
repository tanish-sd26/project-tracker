import { IsString, IsEmail, IsOptional, MinLength } from 'class-validator';

export class CreateClientDto {
  @IsString()
  @MinLength(3)
  name!: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;
}