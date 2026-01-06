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
    // 1. Cargamos variables de entorno de forma global
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // 2. Configuración asíncrona que lee el .env de verdad
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'), // Aquí leerá el 5435 de tu .env
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true, // Esto crea las tablas automáticamente al conectar
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
