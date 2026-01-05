import { Test, TestingModule } from '@nestjs/testing';
import { VacanciesController } from './vacancies.controller';
import { VacanciesService } from './vacancies.service';

describe('VacanciesController', () => {
  let controller: VacanciesController;
  let service: VacanciesService;

  const mockService = {
    create: jest.fn().mockResolvedValue({ id: '1', title: 'Test Vacancy' }),
    findAll: jest.fn().mockResolvedValue({ data: [], total: 0 }),
    toggleStatus: jest.fn().mockResolvedValue({ id: '1', isActive: false }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VacanciesController],
      providers: [
        {
          provide: VacanciesService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<VacanciesController>(VacanciesController);
    service = module.get<VacanciesService>(VacanciesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create', async () => {
      const dto = { title: 'Test Vacancy' } as any;
      await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll with default values', async () => {
      await controller.findAll(1, 10, undefined);
      expect(service.findAll).toHaveBeenCalledWith(1, 10, undefined);
    });
  });

  describe('updateStatus', () => {
    it('should call service.toggleStatus', async () => {
      const id = 'some-uuid';
      await controller.updateStatus(id);
      expect(service.toggleStatus).toHaveBeenCalledWith(id);
    });
  });
});