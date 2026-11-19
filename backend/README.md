# Backend Storeku (NestJS)

Backend aplikasi Storeku dibangun menggunakan framework **NestJS** dengan arsitektur MVC (Module, Controller, Service, DTO, Entity).

## Resource Utama
1. **Orders (`/orders`)**: Entitas utama aktivitas pembeli (pesanan belanja).
   - `GET /orders` - Mengambil seluruh daftar pesanan.
   - `GET /orders/:id` - Mengambil detail pesanan berdasarkan ID.
   - `POST /orders` - Membuat pesanan baru (validasi DTO & pengecekan duplikasi).
   - `PATCH /orders/:id` - Memperbarui alamat pengiriman atau catatan pesanan.
   - `DELETE /orders/:id` - Membatalkan pesanan.
2. **Products (`/products`)**: Katalog produk fashion dan lifestyle toko.

## Fitur Teknis
- **CORS Aktif**: Mengizinkan akses request dari frontend Vite.
- **Global ValidationPipe**: Memvalidasi seluruh payload DTO secara otomatis.
- **Built-in Exceptions**: `NotFoundException` (404), `ConflictException` (409), dan `BadRequestException` (400).
- **REST Client Testing**: File pengujian lengkap tersedia di `api.http`.

## Cara Menjalankan
1. Install dependensi:
   ```bash
   npm install
   ```
2. Jalankan server backend:
   ```bash
   npm run dev
   ```
   *(atau `npm run start:dev`)*

Backend berjalan di alamat: `http://localhost:3000`.
