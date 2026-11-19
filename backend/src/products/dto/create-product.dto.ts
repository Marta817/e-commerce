import {
  IsBoolean,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty({ message: 'Nama produk tidak boleh kosong' })
  @IsString({ message: 'Nama produk harus bertipe string' })
  @MinLength(3, { message: 'Nama produk minimal 3 karakter' })
  name: string;

  @IsNotEmpty({ message: 'Harga produk tidak boleh kosong' })
  @IsNumber({}, { message: 'Harga produk harus berupa angka' })
  @Min(1000, { message: 'Harga produk minimal Rp 1.000' })
  price: number;

  @IsNotEmpty({ message: 'Kategori produk tidak boleh kosong' })
  @IsIn(['Pakaian', 'Outerwear', 'Sepatu', 'Tas', 'Aksesori'], {
    message: 'Kategori harus salah satu dari: Pakaian, Outerwear, Sepatu, Tas, Aksesori',
  })
  category: string;

  @IsNotEmpty({ message: 'Stok tidak boleh kosong' })
  @IsInt({ message: 'Stok harus berupa bilangan bulat' })
  @Min(0, { message: 'Stok tidak boleh bernilai negatif' })
  stock: number;

  @IsOptional()
  @IsString({ message: 'Deskripsi harus bertipe string' })
  description?: string;

  @IsOptional()
  @IsBoolean({ message: 'isAvailable harus berupa nilai boolean (true/false)' })
  isAvailable?: boolean;

  @IsOptional()
  @IsString({ message: 'URL gambar harus bertipe string' })
  image?: string;
}
