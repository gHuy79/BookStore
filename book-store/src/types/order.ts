// src/types/order.ts

export interface CartItem {
  bookId: string;
  title: string;
  price: number;
  quantity: number;
}

export interface ShippingAddress {
  address: string;
  phone: string;
  receiver: string;
}

export interface Order {
  id?: string;
  userId: string;
  items: CartItem[];
  totalPrice: number;
  shippingAddress: ShippingAddress;
  status: 'pending' | 'completed' | 'cancelled';
}

export interface Payment {
  id?: string;
  orderId: string;
  userId: string;
  paymentMethod: 'cod' | 'momo' | 'banking';
  status: 'pending' | 'paid' | 'failed';
  transactionId?: string;
}
