export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
  preparationTime: number; // in minutes
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export type OrderStatus = 'queued' | 'preparing' | 'ready' | 'picked' | 'out_for_delivery';

export interface DeliveryPartner {
  _id: string;
  name: string;
  phone: string;
  status: 'available' | 'busy';
}

export interface Order {
  id: string;
  _id?: string;
  items: Array<{
    menuItem: MenuItem;
    quantity: number;
  }>;
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  totalAmount: number;
  status: OrderStatus;
  estimatedTime: number;
  createdAt: Date;
  updatedAt: Date;
  timeRequired?: number;
  assignedPartner?: DeliveryPartner | null;
}

export interface OrderAnalytics {
  totalOrders: number;
  todayOrders: number;
  totalRevenue: number;
  mostOrderedItem: string;
  averageOrderValue: number;
  ordersByDay: Array<{
    date: string;
    orders: number;
    revenue: number;
  }>;
  ordersByStatus: Array<{
    status: string;
    count: number;
  }>;
}