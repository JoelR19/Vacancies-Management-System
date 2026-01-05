import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

describe('UsersService', () => {
  let service: UsersService;
  let repo: Repository<User>;

  const mockRepo = {
    create: jest.fn().mockImplementation(dto => dto),
    save: jest.fn().mockImplementation(user => 
      Promise.resolve({ id: 'u-123', ...user })
    ),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a user', async () => {
      const dto = { email: 'test@test.com', password: '123' };
      const result = await service.create(dto as any);
      
      expect(result).toHaveProperty('id', 'u-123');
      expect(mockRepo.save).toHaveBeenCalled();
    });
  });

  describe('findOneByEmail', () => {
    it('should return a user if found', async () => {
      const email = 'test@test.com';
      const mockUser = { id: '1', email };
      jest.spyOn(repo, 'findOne').mockResolvedValue(mockUser as User);

      const result = await service.findOneByEmail(email);
      
      expect(result!.email).toEqual(email);
    });

    it('should return null if user is not found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);
      const result = await service.findOneByEmail('notfound@test.com');
      expect(result).toBeNull();
    });
  });
});