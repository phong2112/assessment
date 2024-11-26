import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configv1 = new DocumentBuilder()
    .setTitle('Assessment API v1')
    .setDescription('The assessment API using materialized table')
    .setVersion('1.0')
    .addTag('location')
    .build();

  const documentFactoryv1 = () => SwaggerModule.createDocument(app, configv1);

  SwaggerModule.setup('apiv1', app, documentFactoryv1);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
