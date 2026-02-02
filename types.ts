export type OrderType = 'DINE_IN' | 'DELIVERY' | 'PICK_UP';
export type OrderStatus = 'PLACED' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';
export type PaymentMode = 'CASH' | 'CARD' | 'UPI' | 'DUE' | 'PART';

export interface RestaurantInfo {
  name: string;
  phone: string;
  address: string;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  categoryId: string;
  isVeg: boolean;
  image?: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id: string;
  billNo: string;
  customerName?: string;
  date: string;
  time: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMode: PaymentMode;
  orderType: OrderType;
  staffName: string;
  status: OrderStatus;
}

export interface SalesReportEntry {
  date: string;
  totalOrders: number;
  totalSales: number;
  paymentModes: Record<PaymentMode, number>;
}