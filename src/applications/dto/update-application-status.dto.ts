import { IsEnum } from 'class-validator';
import { ApplicationStatus } from '../entities/application.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateApplicationStatusDto {
  @ApiProperty({ enum: ApplicationStatus, example: 'aceptada' })
  @IsEnum(ApplicationStatus)
  status: ApplicationStatus;
}