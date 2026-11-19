# Frontend Storeku (React + Vite)

Frontend aplikasi e-commerce Storeku dibangun menggunakan **React** dan **Vite** dengan tampilan murni untuk kenyamanan pembeli.

## Halaman & Fitur Utama
1. **Beranda**: Hero banner penawaran, filter kategori cepat, produk unggulan, dan benefit belanja.
2. **Katalog Produk**: Daftar lengkap produk fashion & lifestyle, filter kategori, pengurutan harga/terbaru, dan modal pesan produk.
3. **Pemesanan (CRUD Backend)**: Riwayat pesanan yang terhubung ke backend NestJS di `http://localhost:3000/orders`. User bisa membuat pesanan baru, melihat daftar pesanan, mengedit alamat/catatan, atau membatalkan pesanan.
4. **Akun & Informasi Akun**: Profil pembeli yang berisi 3 data utama: **Nama**, **No. HP**, dan **Alamat**. Data tersimpan di memori browser dan otomatis terisi ke form saat checkout.
5. **Pengaturan**: Fitur **ganti bahasa instan (Indonesia & English)** yang langsung mengubah seluruh teks aplikasi.
6. **Pusat Bantuan**: Daftar kendala dan FAQ interaktif (accordion) yang terhubung langsung ke fitur **Live Chat CS di dalam web**.

## Cara Menjalankan
1. Install dependensi:
   ```bash
   npm install
   ```
2. Jalankan aplikasi frontend:
   ```bash
   npm run dev
   ```

Aplikasi berjalan di browser pada alamat: `http://localhost:5173`.
