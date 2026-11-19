# Folder Screenshot Pengujian

Folder ini digunakan untuk menyimpan file screenshot (SS) pengujian REST API dan Frontend sebagai bukti penyelesaian tugas pekan ini.

## Checklist File Screenshot

Silakan simpan file gambar screenshot dengan nama file berikut ke dalam folder ini:

### 1. REST Client (Backend)
- `01-get-all.png` : Request `GET /products` dengan response `200 OK`.
- `02-get-by-id.png` : Request `GET /products/1` dengan response `200 OK`.
- `03-get-not-found.png` : Request `GET /products/999` dengan response `404 NotFoundException`.
- `04-post-success.png` : Request `POST /products` dengan response `201 Created`.
- `05-post-conflict.png` : Request `POST /products` nama kembar dengan response `409 ConflictException`.
- `06-post-validation-error.png` : Request `POST /products` data tidak valid dengan response `400 Bad Request`.
- `07-patch-success.png` : Request `PATCH /products/1` dengan response `200 OK`.
- `08-delete-success.png` : Request `DELETE /products/2` dengan response `200 OK`.

### 2. Tampilan Frontend
- `09-frontend-kelola-produk.png` : Halaman "Kelola Produk" dengan indikator status backend terhubung (titik hijau).
- `10-frontend-tambah-produk.png` : Modal form saat menambah produk baru.
- `11-frontend-edit-produk.png` : Modal form saat mengedit produk.
- `12-frontend-hapus-produk.png` : Tampilan pesan/feedback saat produk berhasil dihapus.
