# Dokumentasi Screenshot Tugas

Folder ini berisi screenshot hasil testing REST Client (`api.http`) dan bukti alur CRUD di tampilan frontend:

### 1. REST Client Backend (NestJS)
1. `01-get-all.png` - Request GET seluruh daftar pesanan (`/orders`, 200 OK)
2. `02-get-by-id.png` - Request GET pesanan berdasarkan ID (`/orders/1`, 200 OK)
3. `03-get-not-found.png` - Request GET pesanan ID yang tidak ada (`/orders/999`, 404 NotFoundException)
4. `04-post-success.png` - Request POST buat pesanan baru (`/orders`, 201 Created)
5. `05-post-conflict.png` - Request POST pesanan duplikat barang yang sama (`/orders`, 409 ConflictException)
6. `06-post-validation-error.png` - Request POST gagal validasi DTO (`/orders`, 400 Bad Request)
7. `07-patch-success.png` - Request PATCH update alamat/catatan pesanan (`/orders/1`, 200 OK)
8. `08-delete-success.png` - Request DELETE batalkan pesanan (`/orders/2`, 200 OK)

### 2. Tampilan Frontend
9. `09-frontend-pemesanan.png` - Halaman menu Pemesanan yang terhubung ke backend NestJS
10. `10-frontend-pesan-produk.png` - Modal form pesan produk langsung dari katalog toko
11. `11-frontend-ubah-alamat.png` - Modal form ubah alamat / catatan pesanan
12. `12-frontend-batalkan-pesanan.png` - Konfirmasi pembatalan pesanan pembeli
