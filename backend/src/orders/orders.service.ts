import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { UpdateOrderDto } from './dto/update-order.dto.js';
import { Order } from './entities/order.entity.js';

@Injectable()
export class OrdersService {
  private currentId = 3;

  // In-memory array untuk menyimpan data pesanan sementara
  private orders: Order[] = [
    {
      id: 1,
      customerName: 'Marta',
      productName: 'Kaos Oversize',
      price: 129000,
      quantity: 1,
      totalPrice: 129000,
      address: 'Jl. Merdeka No. 45, Jakarta Selatan',
      notes: 'Ukuran L, warna hitam',
      status: 'Diproses',
      image:
        'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=600&auto=format&fit=crop',
      createdAt: new Date('2026-11-18T09:30:00Z'),
    },
    {
      id: 2,
      customerName: 'Marta',
      productName: 'Sneakers Sporty',
      price: 499000,
      quantity: 1,
      totalPrice: 499000,
      address: 'Jl. Merdeka No. 45, Jakarta Selatan',
      notes: 'Ukuran 42, packaging rapi',
      status: 'Dikirim',
      image:
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop',
      createdAt: new Date('2026-11-18T14:15:00Z'),
    },
  ];

  // CREATE: Menambah pesanan baru
  create(createOrderDto: CreateOrderDto): Order {
    // Skenario Error 1: ConflictException jika pesanan duplikat (produk & pembeli sama persis dengan status masih diproses)
    const duplicate = this.orders.find(
      (o) =>
        o.customerName.toLowerCase() === createOrderDto.customerName.toLowerCase() &&
        o.productName.toLowerCase() === createOrderDto.productName.toLowerCase() &&
        o.status === 'Diproses',
    );
    if (duplicate) {
      throw new ConflictException(
        `Pesanan "${createOrderDto.productName}" untuk ${createOrderDto.customerName} sedang diproses. Mohon tunggu sebelum membuat pesanan baru.`,
      );
    }

    const qty = createOrderDto.quantity;
    const total = createOrderDto.price * qty;

    const newOrder: Order = {
      id: this.currentId++,
      customerName: createOrderDto.customerName,
      productName: createOrderDto.productName,
      price: createOrderDto.price,
      quantity: qty,
      totalPrice: total,
      address: createOrderDto.address,
      notes: createOrderDto.notes || 'Tidak ada catatan tambahan',
      status: createOrderDto.status || 'Diproses',
      image:
        createOrderDto.image ||
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop',
      createdAt: new Date(),
    };

    this.orders.unshift(newOrder); // taruh di urutan paling atas
    return newOrder;
  }

  // READ ALL: Mengambil semua pesanan
  findAll(): Order[] {
    return this.orders;
  }

  // READ ONE: Mengambil satu pesanan berdasarkan ID
  findOne(id: number): Order {
    const order = this.orders.find((o) => o.id === id);
    // Skenario Error 2: NotFoundException jika pesanan tidak ditemukan
    if (!order) {
      throw new NotFoundException(`Pesanan dengan ID #${id} tidak ditemukan`);
    }
    return order;
  }

  // UPDATE: Memperbarui alamat / catatan pesanan
  update(id: number, updateOrderDto: UpdateOrderDto): Order {
    const orderIndex = this.orders.findIndex((o) => o.id === id);
    if (orderIndex === -1) {
      throw new NotFoundException(`Pesanan dengan ID #${id} tidak ditemukan`);
    }

    const currentOrder = this.orders[orderIndex];
    const newQty = updateOrderDto.quantity ?? currentOrder.quantity;
    const newPrice = updateOrderDto.price ?? currentOrder.price;

    const updatedOrder: Order = {
      ...currentOrder,
      ...updateOrderDto,
      quantity: newQty,
      price: newPrice,
      totalPrice: newPrice * newQty,
    };

    this.orders[orderIndex] = updatedOrder;
    return updatedOrder;
  }

  // DELETE: Membatalkan / menghapus pesanan
  remove(id: number): { message: string; deletedOrder: Order } {
    const orderIndex = this.orders.findIndex((o) => o.id === id);
    if (orderIndex === -1) {
      throw new NotFoundException(`Pesanan dengan ID #${id} tidak ditemukan`);
    }

    const [deletedOrder] = this.orders.splice(orderIndex, 1);
    return {
      message: `Pesanan #${id} (${deletedOrder.productName}) berhasil dibatalkan`,
      deletedOrder,
    };
  }
}
