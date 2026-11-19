# Tugas Praktikum Pengembangan Aplikasi Web - Pekan 3

Repository ini berisi tugas pekan 3 kelanjutan dari aplikasi **Storeku** (aplikasi e-commerce pribadi dari tugas pekan 2). Di pekan ini, fokus pengerjaannya adalah membangun backend menggunakan **NestJS** dengan struktur MVC dan menghubungkannya ke frontend React.

### Identitas
- **Nama**: Marta
- **NIM**: [Isi NIM]
- **Kelas**: [Isi Kelas]

---

## Penjelasan Singkat Aplikasi
Storeku adalah web e-commerce sederhana untuk toko fashion/lifestyle. Pada tugas kali ini, backend dibuat untuk mengelola data utama berupa **Produk (`Product`)**. Seluruh data disimpan sementara di memori backend (in-memory array pada service) dan sudah terhubung langsung ke tampilan frontend sehingga produk bisa ditambah, diedit, dan dihapus secara realtime.

---

## Poin-Poin Pengerjaan Tugas

1. **Data Utama (`Product`)**  
   Data utama yang dikelola adalah Produk. Entitas dibuat di `backend/src/products/entities/product.entity.ts` dengan total 9 atribut:
   - `id` (number)
   - `name` (string)
   - `price` (number)
   - `category` (string: Pakaian, Outerwear, Sepatu, Tas, Aksesori)
   - `stock` (number)
   - `description` (string)
   - `isAvailable` (boolean)
   - `image` (string, opsional)
   - `createdAt` (Date)

2. **Resource NestJS**  
   Dibuat menggunakan Nest CLI:
   ```bash
   nest g resource products
   ```
   File otomatis terbuat di folder `backend/src/products/`.

3. **Service CRUD (In-Memory)**  
   Implementasi ada di `backend/src/products/products.service.ts`. Data disimpan dalam array `private products: Product[]` dengan fungsi CRUD lengkap:
   - `create`: Menambahkan produk baru (ID dan createdAt otomatis dibuat).
   - `findAll`: Mengambil semua list produk.
   - `findOne`: Mengambil 1 produk berdasarkan ID.
   - `update`: Mengupdate data produk tertentu.
   - `remove`: Menghapus produk dari array.

4. **Controller & Dependency Injection**  
   Implementasi ada di `backend/src/products/products.controller.ts`. Service di-inject langsung melalui constructor (`constructor(private readonly productsService: ProductsService) {}`) tanpa membuat instance manual. Menggunakan method:
   - `GET /products`
   - `GET /products/:id` (dengan `ParseIntPipe`)
   - `POST /products`
   - `PATCH /products/:id`
   - `DELETE /products/:id`

5. **DTO & Validasi (class-validator)**  
   DTO dibuat di `backend/src/products/dto/create-product.dto.ts` dan `update-product.dto.ts`. Validasi yang digunakan:
   - `@IsNotEmpty()` dan `@IsString()`
   - `@MinLength(3)` untuk nama produk minimal 3 karakter
   - `@IsNumber()` dan `@Min(1000)` untuk harga minimal Rp 1.000
   - `@IsIn()` untuk membatasi kategori yang dibolehkan
   - `@IsInt()` dan `@Min(0)` untuk stok tidak boleh negatif
   - `@IsOptional()` dan `@IsBoolean()` untuk ketersediaan
   
   ValidationPipe diaktifkan secara global di `backend/src/main.ts`:
   ```typescript
   app.useGlobalPipes(
     new ValidationPipe({
       whitelist: true,
       forbidNonWhitelisted: true,
       transform: true,
     }),
   );
   ```

6. **Error Handling (Exception Bawaan NestJS)**  
   Menangani error menggunakan:
   - `NotFoundException` (404): Muncul saat mencari, mengedit, atau menghapus produk dengan ID yang tidak ada.
   - `ConflictException` (409): Muncul saat menambahkan produk dengan nama yang sudah pernah dibuat sebelumnya.
   - `BadRequestException` (400): Muncul otomatis dari ValidationPipe jika isi body request tidak sesuai aturan DTO.

7. **Testing REST Client**  
   Seluruh endpoint sudah dites menggunakan file `api.http` di root proyek. Ada 10 skenario request (sukses dan error) yang sudah diuji.

8. **Integrasi Frontend & Backend**  
   - Backend sudah mengaktifkan CORS (`app.enableCors()`).
   - Di frontend React (`e-commerce/`), dibuat halaman baru **Kelola Produk** (`ProductManagement.jsx`) yang langsung nembak ke `http://localhost:3000/products`.
   - Alur CRUD berjalan penuh: user bisa tambah produk lewat modal, edit harga/stok, dan hapus produk.
   - Katalog produk di halaman Beranda dan Produk juga otomatis menampilkan data live dari backend.

---

## Cara Menjalankan Proyek

### 1. Jalankan Backend
Buka terminal:
```bash
cd backend
npm install
npm run start:dev
```
Backend jalan di port 3000 (`http://localhost:3000`).

### 2. Jalankan Frontend
Buka terminal baru:
```bash
cd e-commerce
npm install
npm run dev
```
Buka browser di `http://localhost:5173`. Masuk ke menu **Kelola Produk** di sidebar kiri.

---

## Screenshot Pengujian

Screenshot pengujian disimpan di folder `docs/screenshots/`:

### 1. REST Client (Backend)

- **GET All Products (200 OK)**  
  ![GET All Products](docs/screenshots/01-get-all.png)

- **GET Product by ID (200 OK)**  
  ![GET Product by ID](docs/screenshots/02-get-by-id.png)

- **GET Product by ID - Not Found (404)**  
  ![GET Not Found](docs/screenshots/03-get-not-found.png)

- **POST Create Product (201 Created)**  
  ![POST Create Product](docs/screenshots/04-post-success.png)

- **POST Create - Conflict Nama Duplikat (409)**  
  ![POST Conflict](docs/screenshots/05-post-conflict.png)

- **POST Create - Validasi DTO Gagal (400 Bad Request)**  
  ![POST Validation Error](docs/screenshots/06-post-validation-error.png)

- **PATCH Update Product (200 OK)**  
  ![PATCH Update Product](docs/screenshots/07-patch-success.png)

- **DELETE Product (200 OK)**  
  ![DELETE Product](docs/screenshots/08-delete-success.png)

### 2. Tampilan Frontend

- **Halaman Kelola Produk (Status Backend Terhubung)**  
  ![Frontend Kelola Produk](docs/screenshots/09-frontend-kelola-produk.png)

- **Modal Form Tambah Produk Baru**  
  ![Frontend Tambah Produk](docs/screenshots/10-frontend-tambah-produk.png)

- **Modal Form Edit Produk**  
  ![Frontend Edit Produk](docs/screenshots/11-frontend-edit-produk.png)

- **Hapus Data Produk & Alert Berhasil**  
  ![Frontend Hapus Produk](docs/screenshots/12-frontend-hapus-produk.png)
