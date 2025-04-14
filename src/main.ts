/* eslint-disable prettier/prettier */
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {

  const config = new DocumentBuilder()
  .setTitle('Panela Team API')
  .setDescription('Documentação da API de eventos e execuções')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

  
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: 'http://localhost:8100', // ou ['http://localhost:8100', 'outros dominios']
    credentials: true,
  });
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;

  await app.listen(port);
  console.log(`🚀 Servidor rodando na porta ${port}`);
}
bootstrap();
