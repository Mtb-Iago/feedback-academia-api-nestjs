import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove campos que não estão no DTO
      forbidNonWhitelisted: true, // Retorna erro se houver campos extras
      transform: true, // Converte tipos automaticamente
    }),
  );

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('Sistema de Feedback - Arquitetura Hexagonal')
    .setDescription('API para gestão de feedbacks, filiais e clientes')
    .setVersion('1.0')
    .addTag('feedbacks')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
