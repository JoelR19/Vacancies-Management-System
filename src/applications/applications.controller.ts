import { Controller, Post, Get, Body, UseGuards, Req, Param, Patch } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { ApiTags, ApiOperation, ApiCookieAuth } from '@nestjs/swagger';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';

@ApiTags('Postulaciones')
@ApiCookieAuth() 
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CODER)
  @ApiOperation({ summary: 'Postularse a una vacante (Solo Coders)' })
  create(@Body() createApplicationDto: CreateApplicationDto, @Req() req: any) {
    return this.applicationsService.apply(createApplicationDto.vacancyId, req.user.id);
  }

  @Get('my-applications')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CODER)
  @ApiOperation({ summary: 'Ver mis postulaciones actuales' })
  findAll(@Req() req: any) {
    return this.applicationsService.findMyApplications(req.user.id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.GESTOR, UserRole.ADMIN)
  updateStatus(
    @Param('id') id: string, 
    @Body() updateDto: UpdateApplicationStatusDto
  ) {
    return this.applicationsService.updateStatus(id, updateDto.status);
  }
}