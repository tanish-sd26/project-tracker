import { CreateProjectDto } from './create-project.dto';
import { IsString, IsOptional } from 'class-validator';

export class UpdateProjectDto extends CreateProjectDto {
  @IsString()
  @IsOptional()
  status?: string;
}