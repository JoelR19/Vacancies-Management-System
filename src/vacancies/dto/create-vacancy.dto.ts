import { IsNotEmpty, IsString, IsInt, Min, IsArray, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Modality } from '../entities/vacancy.entity';

export class CreateVacancyDto {
  @ApiProperty({ example: 'Desarrollador Fullstack NestJS' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Buscamos un experto en Node.js y React para proyectos escalables.' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'Senior' })
  @IsString()
  @IsNotEmpty()
  seniority: string;

  @ApiProperty({ example: 'Liderazgo, Autogestión' })
  @IsString()
  @IsNotEmpty()
  softSkills: string;

  @ApiProperty({ example: 'Remoto / Bogotá' })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({ enum: Modality, example: Modality.REMOTO })
  @IsEnum(Modality)
  @IsNotEmpty()
  modality: Modality;

  @ApiProperty({ example: '$5.000.000 - $8.000.000' })
  @IsString()
  @IsNotEmpty()
  salaryRange: string;

  @ApiProperty({ example: 'Joel S.A.S' })
  @IsString()
  @IsNotEmpty()
  company: string;

  @ApiProperty({ example: 10, description: 'Cupo máximo de postulantes' })
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  maxApplicants: number;

}