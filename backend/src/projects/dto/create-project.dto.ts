import { IsString, IsInt, IsOptional, MinLength } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @MinLength(3)
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  clientId!: number;
}