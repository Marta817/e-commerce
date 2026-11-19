export class Order {
  id: number;
  customerName: string;
  productName: string;
  price: number;
  quantity: number;
  totalPrice: number;
  address: string;
  notes?: string;
  status: string; // 'Diproses' | 'Dikirim' | 'Selesai' | 'Dibatalkan'
  image?: string;
  createdAt: Date;
}

