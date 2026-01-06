import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Vacancy } from './entities/vacancy.entity';
import { CreateVacancyDto } from './dto/create-vacancy.dto';

@Injectable()
export class VacanciesService {
  constructor(
    @InjectRepository(Vacancy)
    private readonly vacancyRepository: Repository<Vacancy>,
  ) {}

  async create(createVacancyDto: CreateVacancyDto) {
    const vacancy = this.vacancyRepository.create(createVacancyDto);

    return await this.vacancyRepository.save(vacancy);
  }

  async findAll(
    page: number,
    limit: number,
    title?: string,
    includeInactive = false,
  ) {
    const whereClause: any = {
      ...(title && { title: Like(`%${title}%`) }),
    };

    if (!includeInactive) {
      whereClause.isActive = true;
    }

    const [data, total] = await this.vacancyRepository.findAndCount({
      where: whereClause,
      relations: ['applications', 'applications.user'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }
  async toggleStatus(id: string) {
    const vacancy = await this.vacancyRepository.findOne({ where: { id } });

    if (!vacancy) {
      throw new NotFoundException(`Vacante con ID ${id} no encontrada`);
    }

    vacancy.isActive = !vacancy.isActive;

    await this.vacancyRepository.save(vacancy);

    return {
      message: `Vacante ${vacancy.isActive ? 'activada' : 'inactivada'} con éxito`,
      isActive: vacancy.isActive,
    };
  }

  async findOne(id: string) {
    const vacancy = await this.vacancyRepository.findOne({
      where: { id },
      relations: ['applications', 'applications.user'],
    });

    if (!vacancy) {
      throw new NotFoundException(`La vacante con ID ${id} no existe`);
    }

    return vacancy;
  }
}
