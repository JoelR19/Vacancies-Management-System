import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationsService } from './applications.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Application } from './entities/application.entity';
import { Vacancy } from '../vacancies/entities/vacancy.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('ApplicationsService', () => {
  let service: ApplicationsService;
  let appRepo: any;
  let vacancyRepo: any;

  const mockAppRepo = {
    findOne: jest.fn(),
    count: jest.fn(),
    create: jest.fn().mockImplementation(dto => dto),
    save: jest.fn().mockImplementation(app => Promise.resolve({ id: 'app-123', ...app })),
    find: jest.fn(),
  };

  const mockVacancyRepo = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationsService,
        { provide: getRepositoryToken(Application), useValue: mockAppRepo },
        { provide: getRepositoryToken(Vacancy), useValue: mockVacancyRepo },
      ],
    }).compile();

    service = module.get<ApplicationsService>(ApplicationsService);
    appRepo = module.get(getRepositoryToken(Application));
    vacancyRepo = module.get(getRepositoryToken(Vacancy));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('apply', () => {
    it('should throw NotFoundException if vacancy does not exist', async () => {
      vacancyRepo.findOne.mockResolvedValue(null);
      await expect(service.apply('v1', 'u1')).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if vacancy is full (Rule 1)', async () => {
      vacancyRepo.findOne.mockResolvedValue({ id: 'v1', maxApplicants: 2, applications: [{}, {}] });
      await expect(service.apply('v1', 'u1')).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if already applied (Rule 2)', async () => {
      vacancyRepo.findOne.mockResolvedValue({ id: 'v1', maxApplicants: 5, applications: [] });
      appRepo.findOne.mockResolvedValue({ id: 'existing-app' });
      await expect(service.apply('v1', 'u1')).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if user has 3 apps (Rule 3)', async () => {
      vacancyRepo.findOne.mockResolvedValue({ id: 'v1', maxApplicants: 5, applications: [] });
      appRepo.findOne.mockResolvedValue(null);
      appRepo.count.mockResolvedValue(3);
      await expect(service.apply('v1', 'u1')).rejects.toThrow(BadRequestException);
    });

    it('should create application if all rules pass', async () => {
      vacancyRepo.findOne.mockResolvedValue({ id: 'v1', maxApplicants: 5, applications: [] });
      appRepo.findOne.mockResolvedValue(null);
      appRepo.count.mockResolvedValue(0);
      
      const result = await service.apply('v1', 'u1');
      expect(result).toHaveProperty('id', 'app-123');
    });
  });
});