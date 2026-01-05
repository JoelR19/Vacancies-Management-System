import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Application } from '../../applications/entities/application.entity';

export enum UserRole {
  ADMIN = 'ADMIN',
  GESTOR = 'GESTOR',
  CODER = 'CODER',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.CODER })
  role: UserRole;

  @OneToMany(() => Application, (application) => application.user)
  applications: Application[];
}