import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application, ApplicationStatus } from './entities/application.entity';
import { Vacancy } from '../vacancies/entities/vacancy.entity';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private readonly appRepository: Repository<Application>,
    @InjectRepository(Vacancy)
    private readonly vacancyRepository: Repository<Vacancy>,
  ) {}

  async apply(vacancyId: string, userId: string) {
    const vacancy = await this.vacancyRepository.findOne({
      where: { id: vacancyId },
      relations: ['applications'],
    });

    if (!vacancy) throw new NotFoundException('Vacante no encontrada');

    if (vacancy.applications.length >= vacancy.maxApplicants) {
      throw new BadRequestException('Esta vacante ya alcanzó el límite máximo de postulantes');
    }

    const alreadyApplied = await this.appRepository.findOne({
      where: { vacancyId, userId },
    });
    if (alreadyApplied) throw new BadRequestException('Ya te has postulado a esta vacante');

    const totalUserApps = await this.appRepository.count({ where: { userId } });
    if (totalUserApps >= 3) throw new BadRequestException('Límite de 3 postulaciones alcanzado');

    const newApp = this.appRepository.create({ vacancyId, userId });
    return await this.appRepository.save(newApp);
  }

  async findMyApplications(userId: string) {
    return await this.appRepository.find({
      where: { userId },
      relations: ['vacancy'],
    });
  }

  async updateStatus(id: string, status: ApplicationStatus) {
  const application = await this.appRepository.findOne({ 
    where: { id } 
  });

  if (!application) throw new NotFoundException('Postulación no encontrada');

  application.status = status; 
  return await this.appRepository.save(application); 
}
}