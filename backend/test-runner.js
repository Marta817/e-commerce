import { NestFactory } from '@nestjs/core';
import { AppModule } from './dist/app.module.js';
import { ValidationPipe } from '@nestjs/common';
import request from 'supertest';

async function runTests() {
  const app = await NestFactory.create(AppModule, { logger: false });
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  await app.init();
  const server = app.getHttpServer();

  console.log('======================================================================');
  console.log('1. GET /orders (findAll - Ambil seluruh pesanan user)');
  const res1 = await request(server).get('/orders');
  console.log(`Status: ${res1.status} OK`);
  console.log(`Total Pesanan: ${res1.body.length}`);
  console.log('Sample Pesanan:', JSON.stringify(res1.body[0], null, 2));

  console.log('\n======================================================================');
  console.log('2. GET /orders/1 (findOne - Berhasil)');
  const res2 = await request(server).get('/orders/1');
  console.log(`Status: ${res2.status} OK`);
  console.log('Response:', JSON.stringify(res2.body, null, 2));

  console.log('\n======================================================================');
  console.log('3. GET /orders/999 (findOne - NotFoundException)');
  const res3 = await request(server).get('/orders/999');
  console.log(`Status: ${res3.status} Not Found`);
  console.log('Response:', JSON.stringify(res3.body, null, 2));

  console.log('\n======================================================================');
  console.log('4. POST /orders (create - Berhasil membuat pesanan baru)');
  const newOrder = {
    customerName: 'Marta',
    productName: 'Jaket Leather',
    price: 349000,
    quantity: 1,
    address: 'Jl. Sudirman No. 12, Surabaya',
    notes: 'Ukuran M, tolong bungkus kado',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600&auto=format&fit=crop',
  };
  const res4 = await request(server).post('/orders').send(newOrder);
  console.log(`Status: ${res4.status} (201 Created)`);
  console.log('Pesanan Dibuat:', JSON.stringify(res4.body, null, 2));

  console.log('\n======================================================================');
  console.log('5. POST /orders (create - ConflictException Pesanan Duplikat)');
  const res5 = await request(server).post('/orders').send(newOrder);
  console.log(`Status: ${res5.status} (409 Conflict)`);
  console.log('Response:', JSON.stringify(res5.body, null, 2));

  console.log('\n======================================================================');
  console.log('6. POST /orders (create - ValidationPipe Error 400 Bad Request)');
  const invalidOrder = {
    customerName: '',
    productName: 'Kaos',
    price: 100,
    quantity: 0,
    address: 'Jl.',
  };
  const res6 = await request(server).post('/orders').send(invalidOrder);
  console.log(`Status: ${res6.status} (400 Bad Request)`);
  console.log('Validation Errors:', JSON.stringify(res6.body, null, 2));

  console.log('\n======================================================================');
  console.log('7. PATCH /orders/1 (update - Ubah Alamat / Catatan Pesanan)');
  const updateData = {
    address: 'Jl. Gatot Subroto No. 88, Jakarta Selatan (Rumah Baru)',
    notes: 'Ukuran diganti XL, warna hitam',
  };
  const res7 = await request(server).patch('/orders/1').send(updateData);
  console.log(`Status: ${res7.status} (200 OK)`);
  console.log('Updated Order:', JSON.stringify(res7.body, null, 2));

  console.log('\n======================================================================');
  console.log('8. DELETE /orders/2 (remove - Batalkan Pesanan)');
  const res8 = await request(server).delete('/orders/2');
  console.log(`Status: ${res8.status} (200 OK)`);
  console.log('Response:', JSON.stringify(res8.body, null, 2));

  await app.close();
  console.log('\n--- SELURUH ENDPOINT ORDERS BERHASIL DIUJI ---');
  process.exit(0);
}

runTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
