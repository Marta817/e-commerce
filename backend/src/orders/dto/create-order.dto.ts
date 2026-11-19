import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty({ message: 'Nama pemesan tidak boleh kosong' })
  @IsString({ message: 'Nama pemesan harus berupa teks' })
  @MinLength(3, { message: 'Nama pemesan minimal 3 karakter' })
  customerName: string;

  @IsNotEmpty({ message: 'Nama produk tidak boleh kosong' })
  @IsString({ message: 'Nama produk harus berupa teks' })
  productName: string;

  @IsNotEmpty({ message: 'Harga produk tidak boleh kosong' })
  @IsNumber({}, { message: 'Harga harus berupa angka' })
  @Min(1000, { message: 'Harga minimal Rp 1.000' })
  price: number;

  @IsNotEmpty({ message: 'Jumlah beli tidak boleh kosong' })
  @IsInt({ message: 'Jumlah beli harus bilangan bulat' })
  @Min(1, { message: 'Jumlah beli minimal 1' })
  quantity: number;

  @IsNotEmpty({ message: 'Alamat pengiriman wajib diisi' })
  @IsString({ message: 'Alamat pengiriman harus berupa teks' })
  @MinLength(5, { message: 'Alamat pengiriman minimal 5 karakter' })
  address: string;

  @IsOptional()
  @IsString({ message: 'Catatan harus berupa teks' })
  notes?: string;

  @IsOptional()
  @IsIn(['Diproses', 'Dikirim', 'Selesai', 'Dibatalkan'], {
    message: 'Status harus salah satu dari: Diproses, Dikirim, Selesai, Dibatalkan',
  })
  status?: string;

  @IsOptional()
  @IsString({ message: 'URL gambar harus berupa teks' })
  image?: string;
}
