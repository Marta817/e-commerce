import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { Product } from './entities/product.entity.js';

@Injectable()
export class ProductsService {
  private currentId = 11;

  // In-memory array untuk menyimpan data produk sementara
  private products: Product[] = [
    {
      id: 1,
      name: 'Kaos Oversize',
      price: 129000,
      category: 'Pakaian',
      stock: 25,
      description: 'Kaos oversize berbahan katun combed premium 24s yang nyaman dan sejuk.',
      isAvailable: true,
      image:
        'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=600&auto=format&fit=crop',
      createdAt: new Date('2026-01-15T08:00:00Z'),
    },
    {
      id: 2,
      name: 'Jaket Leather',
      price: 349000,
      category: 'Outerwear',
      stock: 12,
      description: 'Jaket kulit sintetis elegan dengan furing satin tebal dan resleting kuat.',
      isAvailable: true,
      image:
        'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600&auto=format&fit=crop',
      createdAt: new Date('2026-01-18T10:30:00Z'),
    },
    {
      id: 3,
      name: 'Sneakers Sporty',
      price: 499000,
      category: 'Sepatu',
      stock: 18,
      description: 'Sneakers sol empuk dengan sirkulasi udara baik untuk aktivitas harian.',
      isAvailable: true,
      image:
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop',
      createdAt: new Date('2026-02-01T14:15:00Z'),
    },
    {
      id: 4,
      name: 'Backpack Casual',
      price: 219000,
      category: 'Tas',
      stock: 30,
      description: 'Tas ransel berkapasitas 20L dengan slot laptop 15 inci dan bahan tahan cipratan air.',
      isAvailable: true,
      image:
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop',
      createdAt: new Date('2026-02-05T09:00:00Z'),
    },
    {
      id: 5,
      name: 'Jam Tangan Analog',
      price: 299000,
      category: 'Aksesori',
      stock: 15,
      description: 'Jam tangan quartz elegan berbahan stainless steel dengan water resistant 3 ATM.',
      isAvailable: true,
      image:
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop',
      createdAt: new Date('2026-02-10T11:45:00Z'),
    },
    {
      id: 6,
      name: 'Kacamata Retro',
      price: 159000,
      category: 'Aksesori',
      stock: 40,
      description: 'Kacamata gaya retro frame ringan dengan perlindungan UV400.',
      isAvailable: true,
      image:
        'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=600&auto=format&fit=crop',
      createdAt: new Date('2026-02-12T16:20:00Z'),
    },
    {
      id: 7,
      name: 'Sandal Casual Slip-on',
      price: 189000,
      category: 'Sepatu',
      stock: 22,
      description: 'Sandal slip-on ringan dan fleksibel dengan sol anti-slip.',
      isAvailable: true,
      image:
        'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=600&auto=format&fit=crop',
      createdAt: new Date('2026-02-15T13:00:00Z'),
    },
    {
      id: 8,
      name: 'Celana Jeans Slim Fit',
      price: 279000,
      category: 'Pakaian',
      stock: 20,
      description: 'Celana denim stretch slim fit warna medium blue yang trendi dan fleksibel.',
      isAvailable: true,
      image:
        'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=600&auto=format&fit=crop',
      createdAt: new Date('2026-02-20T17:10:00Z'),
    },
    {
      id: 9,
      name: 'Sneakers White Urban',
      price: 449000,
      category: 'Sepatu',
      stock: 14,
      description: 'Sepatu sneakers putih minimalis bahan kulit vegan dengan siluet bersih.',
      isAvailable: true,
      image:
        'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=600&auto=format&fit=crop',
      createdAt: new Date('2026-02-25T10:00:00Z'),
    },
    {
      id: 10,
      name: 'Tas Shoulder Modern',
      price: 239000,
      category: 'Tas',
      stock: 16,
      description: 'Tas bahu simpel berdesain modern dengan kompartemen fungsional.',
      isAvailable: true,
      image:
        'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=600&auto=format&fit=crop',
      createdAt: new Date('2026-03-01T12:00:00Z'),
    },
  ];

  // CREATE: Menambah data produk baru
  create(createProductDto: CreateProductDto): Product {
    // Skenario Error 1: ConflictException jika nama produk sudah terdaftar
    const existing = this.products.find(
      (p) =>
        p.name.trim().toLowerCase() === createProductDto.name.trim().toLowerCase(),
    );
    if (existing) {
      throw new ConflictException(
        `Produk dengan nama "${createProductDto.name}" sudah terdaftar`,
      );
    }

    const newProduct: Product = {
      id: this.currentId++,
      name: createProductDto.name,
      price: createProductDto.price,
      category: createProductDto.category,
      stock: createProductDto.stock,
      description:
        createProductDto.description ??
        'Produk pilihan Storeku dengan kualitas terbaik dan cocok untuk kebutuhan sehari-hari.',
      isAvailable: createProductDto.isAvailable ?? createProductDto.stock > 0,
      image:
        createProductDto.image ||
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop',
      createdAt: new Date(),
    };

    this.products.push(newProduct);
    return newProduct;
  }

  // READ ALL: Mengambil seluruh daftar produk
  findAll(): Product[] {
    return this.products;
  }

  // READ ONE: Mengambil satu data produk berdasarkan ID
  findOne(id: number): Product {
    const product = this.products.find((p) => p.id === id);
    // Skenario Error 2: NotFoundException jika data tidak ditemukan
    if (!product) {
      throw new NotFoundException(`Produk dengan ID #${id} tidak ditemukan`);
    }
    return product;
  }

  // UPDATE: Memperbarui data produk berdasarkan ID
  update(id: number, updateProductDto: UpdateProductDto): Product {
    const productIndex = this.products.findIndex((p) => p.id === id);
    if (productIndex === -1) {
      throw new NotFoundException(`Produk dengan ID #${id} tidak ditemukan`);
    }

    // Cek konflik nama jika nama diubah ke nama lain yang sudah ada
    if (
      updateProductDto.name &&
      updateProductDto.name.trim().toLowerCase() !==
        this.products[productIndex].name.trim().toLowerCase()
    ) {
      const conflict = this.products.find(
        (p) =>
          p.id !== id &&
          p.name.trim().toLowerCase() ===
            updateProductDto.name!.trim().toLowerCase(),
      );
      if (conflict) {
        throw new ConflictException(
          `Produk dengan nama "${updateProductDto.name}" sudah digunakan oleh produk lain`,
        );
      }
    }

    const currentProduct = this.products[productIndex];
    const updatedProduct: Product = {
      ...currentProduct,
      ...updateProductDto,
      isAvailable:
        updateProductDto.isAvailable !== undefined
          ? updateProductDto.isAvailable
          : updateProductDto.stock !== undefined
            ? updateProductDto.stock > 0
            : currentProduct.isAvailable,
    };

    this.products[productIndex] = updatedProduct;
    return updatedProduct;
  }

  // DELETE: Menghapus data produk berdasarkan ID
  remove(id: number): { message: string; deletedProduct: Product } {
    const productIndex = this.products.findIndex((p) => p.id === id);
    if (productIndex === -1) {
      throw new NotFoundException(`Produk dengan ID #${id} tidak ditemukan`);
    }

    const [deletedProduct] = this.products.splice(productIndex, 1);
    return {
      message: `Produk "${deletedProduct.name}" berhasil dihapus`,
      deletedProduct,
    };
  }
}
