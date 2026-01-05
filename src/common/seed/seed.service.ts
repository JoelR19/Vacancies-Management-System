import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    await this.runSeed();
  }

  async runSeed() {
    // no duplicar roles
    const adminExists = await this.userRepository.findOne({ where: { role: UserRole.ADMIN } });
    
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('Admin123!', 10);
      
      const admin = this.userRepository.create({
        name: 'Administrador joel',
        email: 'admin@joel.com',
        password: hashedPassword,
        role: UserRole.ADMIN,
      });

      const gestor = this.userRepository.create({
        name: 'Gestor Empleabilidad',
        email: 'gestor@joel.com',
        password: hashedPassword,
        role: UserRole.GESTOR,
      });

      await this.userRepository.save([admin, gestor]);
      console.log(' Seed finalizado: Usuarios Admin y Gestor creados.');
    }
  }
}