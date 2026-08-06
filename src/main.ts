import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation: every DTO's class-validator decorators are now
  // enforced on every request. whitelist strips unknown fields;
  // forbidNonWhitelisted rejects the request instead of silently stripping.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true, // turns plain JSON into actual DTO class instances
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Movie Reservation API')
    .setDescription('Endpoints for browsing movies, showtimes, and reserving seats')
    .setVersion('1.0')
    .addBearerAuth() // shows up once the auth module issues JWTs
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  // -> served at http://localhost:3000/api/docs once you run the app

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();