import { Controller, Post, Get, Body, UseGuards, Query, Patch, Param } from '@nestjs/common';
import { VacanciesService } from './vacancies.service';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { ApiTags, ApiOperation, ApiQuery, ApiCookieAuth } from '@nestjs/swagger';

@ApiTags('Vacantes')
@Controller('vacancies')
export class VacanciesController {
  constructor(private readonly vacanciesService: VacanciesService) {}

  @Post()
  @ApiCookieAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.GESTOR, UserRole.ADMIN)
  @ApiOperation({ summary: 'Crear vacante (Gestores y Admins)' })
  create(@Body() createVacancyDto: CreateVacancyDto) {
    return this.vacanciesService.create(createVacancyDto);
  }

  @Patch(':id/status') 
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.GESTOR, UserRole.ADMIN)
  @ApiOperation({ summary: 'Activar o Inactivar una vacante (Gestor/Admin)' })
  updateStatus(@Param('id') id: string) {
    return this.vacanciesService.toggleStatus(id);
  }
  @Get()
  @ApiOperation({ summary: 'Listar todas las vacantes' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Registros por página' })
  @ApiQuery({ name: 'title', required: false, type: String, description: 'Filtrar por título' })
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('title') title?: string,
  ) {
    return this.vacanciesService.findAll(+page, +limit, title);
  }
}