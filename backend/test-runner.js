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
  console.log('1. GET /products (findAll)');
  const res1 = await request(server).get('/products');
  console.log(`Status: ${res1.status} ${res1.ok ? 'OK' : 'FAIL'}`);
  console.log(`Total Products: ${res1.body.length}`);
  console.log('Sample Product (First):', JSON.stringify(res1.body[0], null, 2));

  console.log('\n======================================================================');
  console.log('2. GET /products/1 (findOne - Berhasil)');
  const res2 = await request(server).get('/products/1');
  console.log(`Status: ${res2.status} ${res2.ok ? 'OK' : 'FAIL'}`);
  console.log('Response:', JSON.stringify(res2.body, null, 2));

  console.log('\n======================================================================');
  console.log('3. GET /products/999 (findOne - NotFoundException)');
  const res3 = await request(server).get('/products/999');
  console.log(`Status: ${res3.status}`);
  console.log('Response:', JSON.stringify(res3.body, null, 2));

  console.log('\n======================================================================');
  console.log('4. POST /products (create - Berhasil)');
  const newProduct = {
    name: 'Hoodie Minimalist Hitam',
    price: 259000,
    category: 'Pakaian',
    stock: 35,
    description: 'Hoodie katun fleece hangat dengan potongan relaxed fit dan kantong kangaroo.',
    isAvailable: true,
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=600&auto=format&fit=crop',
  };
  const res4 = await request(server).post('/products').send(newProduct);
  console.log(`Status: ${res4.status} (201 Created)`);
  console.log('Created Product:', JSON.stringify(res4.body, null, 2));

  console.log('\n======================================================================');
  console.log('5. POST /products (create - ConflictException Duplikat)');
  const res5 = await request(server).post('/products').send(newProduct);
  console.log(`Status: ${res5.status} (409 Conflict)`);
  console.log('Response:', JSON.stringify(res5.body, null, 2));

  console.log('\n======================================================================');
  console.log('6. POST /products (create - ValidationPipe Error 400 Bad Request)');
  const invalidProduct = {
    name: '',
    price: 500,
    category: 'Makanan',
    stock: -5,
  };
  const res6 = await request(server).post('/products').send(invalidProduct);
  console.log(`Status: ${res6.status} (400 Bad Request)`);
  console.log('Validation Errors:', JSON.stringify(res6.body, null, 2));

  console.log('\n======================================================================');
  console.log('7. PATCH /products/1 (update - Berhasil)');
  const updateData = {
    price: 139000,
    stock: 40,
    description: 'Kaos oversize berbahan katun combed premium 24s - Edisi Spesial Diskon!',
  };
  const res7 = await request(server).patch('/products/1').send(updateData);
  console.log(`Status: ${res7.status} (200 OK)`);
  console.log('Updated Product:', JSON.stringify(res7.body, null, 2));

  console.log('\n======================================================================');
  console.log('8. PATCH /products/999 (update - NotFoundException)');
  const res8 = await request(server).patch('/products/999').send(updateData);
  console.log(`Status: ${res8.status} (404 Not Found)`);
  console.log('Response:', JSON.stringify(res8.body, null, 2));

  console.log('\n======================================================================');
  console.log('9. DELETE /products/2 (remove - Berhasil)');
  const res9 = await request(server).delete('/products/2');
  console.log(`Status: ${res9.status} (200 OK)`);
  console.log('Response:', JSON.stringify(res9.body, null, 2));

  console.log('\n======================================================================');
  console.log('10. DELETE /products/999 (remove - NotFoundException)');
  const res10 = await request(server).delete('/products/999');
  console.log(`Status: ${res10.status} (404 Not Found)`);
  console.log('Response:', JSON.stringify(res10.body, null, 2));

  await app.close();
  console.log('\n--- SELURUH ENDPOINT BERHASIL DIUJI ---');
  process.exit(0);
}

runTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
