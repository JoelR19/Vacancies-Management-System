import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { VacanciesModule } from './vacancies/vacancies.module';
import { ApplicationsModule } from './applications/applications.module';
import { SeedService } from './common/seed/seed.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: 'localhost',
        port: 5433,
        username: 'assessment_user',
        password: 'assessment_password',
        database: 'assessment_platform',
        autoLoadEntities: true,
        synchronize: true, 
      }),
    }),
    
    UsersModule,
    AuthModule,
    VacanciesModule,
    ApplicationsModule,
  ],
  providers: [SeedService],
})
export class AppModule {}