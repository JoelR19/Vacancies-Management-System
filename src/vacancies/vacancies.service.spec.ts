import { Test, TestingModule } from '@nestjs/testing';
import { VacanciesService } from './vacancies.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Vacancy } from './entities/vacancy.entity';
import { NotFoundException } from '@nestjs/common';

describe('VacanciesService', () => {
  let service: VacanciesService;
  let repo: any;

  const mockRepository = {
    create: jest.fn().mockImplementation(dto => dto),
    save: jest.fn().mockImplementation(vacancy => Promise.resolve({ id: 'uuid-123', ...vacancy })),
    findAndCount: jest.fn().mockResolvedValue([[], 0]),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VacanciesService,
        {
          provide: getRepositoryToken(Vacancy),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<VacanciesService>(VacanciesService);
    repo = module.get(getRepositoryToken(Vacancy));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new vacancy', async () => {
      const dto = { title: 'NestJS dev', maxApplicants: 5 } as any;
      const result = await service.create(dto);
      expect(result).toHaveProperty('id');
      expect(repo.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('toggleStatus', () => {
    it('should toggle vacancy status', async () => {
      const mockVacancy = { id: '1', isActive: true };
      repo.findOne.mockResolvedValue(mockVacancy);
      repo.save.mockResolvedValue({ ...mockVacancy, isActive: false });

      const result = await service.toggleStatus('1');
      expect(result.isActive).toBe(false);
    });

    it('should throw NotFoundException if vacancy does not exist', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.toggleStatus('999')).rejects.toThrow(NotFoundException);
    });
  });
});