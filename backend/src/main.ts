import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Mengaktifkan CORS agar frontend (React / Vite) dapat mengakses API backend
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Mengaktifkan ValidationPipe secara global untuk validasi DTO
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Hapus properti yang tidak ada di DTO
      forbidNonWhitelisted: true, // Tolak request jika ada properti tak dikenal
      transform: true, // Otomatis transform payload ke instance DTO
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Backend NestJS berjalan di: http://localhost:${port}`);
}

await bootstrap();
