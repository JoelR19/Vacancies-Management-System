import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser'; // Asegúrate de que la importación sea así
import { TransformInterceptor } from './common/interceptors/ransform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // --- CONFIGURACIÓN DE CORS ACTUALIZADA ---
  // He añadido el puerto 8081 que es el que estás usando ahora
  app.enableCors({
    origin: [
      'http://localhost:8080',
      'http://localhost:5173',
      'http://127.0.0.1:8081',
    ],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  app.use(cookieParser());

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalInterceptors(new TransformInterceptor());

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Plataforma de Vacantes - JoelR')
    .setDescription('API para la gestión de vacantes y postulaciones')
    .setVersion('1.0')
    .addCookieAuth('accessToken', {
      type: 'apiKey',
      in: 'cookie',
      name: 'accessToken',
      description: 'Cookie de autenticación JWT',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(` Servidor corriendo en: http://localhost:${port}/api`);
  console.log(` Swagger documentado en: http://localhost:${port}/api/docs`);
  console.log(` CORS permitido para: http://localhost:8081\n`);
}
bootstrap();
