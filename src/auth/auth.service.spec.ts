import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: any;

  const mockUsersService = {
    findOneByEmail: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mockToken'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should throw BadRequestException if email exists', async () => {
      usersService.findOneByEmail.mockResolvedValue({ id: '1' });
      await expect(service.register({ email: 'test@test.com' } as any))
        .rejects.toThrow(BadRequestException);
    });

    it('should create a user successfully', async () => {
      usersService.findOneByEmail.mockResolvedValue(null);
      usersService.create.mockResolvedValue({ id: '1', email: 'test@test.com' });
      
      const result = await service.register({ email: 'test@test.com' } as any);
      expect(result).toHaveProperty('id');
    });
  });

  describe('login', () => {
    it('should throw UnauthorizedException for invalid credentials', async () => {
      usersService.findOneByEmail.mockResolvedValue(null);
      await expect(service.login({ email: 'wrong@test.com', password: '123' } as any))
        .rejects.toThrow(UnauthorizedException);
    });
  });
});