import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Application } from '../../applications/entities/application.entity';

export enum Modality {
  REMOTO = 'remoto',
  HIBRIDO = 'hibrido',
  PRESENCIAL = 'presencial',
}

@Entity('vacancies')
export class Vacancy {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  seniority: string;

  @Column()
  softSkills: string;

  @Column()
  location: string;

  @Column({ type: 'enum', enum: Modality })
  modality: Modality;

  @Column()
  salaryRange: string;

  @Column()
  company: string;

  @Column({ type: 'int' })
  maxApplicants: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: true })
  isActive: boolean;


  @OneToMany(() => Application, (app) => app.vacancy)
  applications: Application[];
}