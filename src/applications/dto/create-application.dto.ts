import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateApplicationDto {
  @ApiProperty({ 
    description: 'El UUID de la vacante a la que deseas aplicar',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' 
  })
  @IsUUID()
  @IsNotEmpty()
  vacancyId: string;
}