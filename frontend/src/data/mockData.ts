// Mock data for UI development - replace with real API calls

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  createdAt: string;
  totalOrders: number;
  measurements?: Measurements;
}

export interface Measurements {
  neck?: number;
  chest?: number;
  waist?: number;
  hips?: number;
  shoulders?: number;
  sleeveLength?: number;
  armhole?: number;
  bicep?: number;
  wrist?: number;
  shirtLength?: number;
  trouserLength?: number;
  inseam?: number;
  thigh?: number;
  knee?: number;
  calf?: number;
  ankle?: number;
  notes?: string;
}

export interface Order {
  id: string;
  orderId: string;
  customerId: string;
  customerName: string;
  garmentType: 'Shirt' | 'Sherwani' | 'Pant' | 'Vest' | 'Blazer';
  status: 'Pending' | 'In Progress' | 'Ready' | 'Delivered' | 'Cancelled';
  dueDate: string;
  totalAmount: number;
  paidAmount: number;
  balanceDue: number;
  fabricNotes?: string;
  measurements: Measurements;
  createdAt: string;
  uuid: string;
  assignedStitcherId?: string;
  items?: OrderItem[];
}

export interface OrderItem {
  garmentType: string;
  quantity: number;
}

export interface DashboardMetrics {
  activeOrders: number;
  urgentToday: number;
  totalCustomers: number;
  pendingPayments: number;
}

export interface Stitcher {
  id: string;
  name: string;
  phone: string;
  specialization: string;
  status: 'Active' | 'On Leave';
  createdAt: string;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
}

// Mock Customers
export const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Ahmed Khan',
    phone: '+92 300 1234567',
    email: 'ahmed.khan@email.com',
    address: '42, Gulberg III, Lahore',
    createdAt: '2024-01-15',
    totalOrders: 12,
    measurements: {
      neck: 15.5,
      chest: 40,
      waist: 34,
      shoulders: 18,
      sleeveLength: 25,
      shirtLength: 30,
    },
  },
  {
    id: '2',
    name: 'Usman Ali',
    phone: '+92 321 9876543',
    email: 'usman.ali@email.com',
    address: '15, DHA Phase 5, Karachi',
    createdAt: '2024-02-20',
    totalOrders: 8,
    measurements: {
      neck: 16,
      chest: 42,
      waist: 36,
      shoulders: 19,
      sleeveLength: 26,
      shirtLength: 31,
    },
  },
  {
    id: '3',
    name: 'Bilal Hussain',
    phone: '+92 333 5551234',
    email: 'bilal.h@email.com',
    address: '88, F-7, Islamabad',
    createdAt: '2024-03-10',
    totalOrders: 5,
    measurements: {
      neck: 15,
      chest: 38,
      waist: 32,
      shoulders: 17,
      sleeveLength: 24,
      shirtLength: 28,
    },
  },
  {
    id: '4',
    name: 'Faisal Mehmood',
    phone: '+92 345 8887766',
    email: 'faisal.m@email.com',
    address: '23, Cavalry Ground, Lahore',
    createdAt: '2024-04-05',
    totalOrders: 15,
    measurements: {
      neck: 16.5,
      chest: 44,
      waist: 38,
      shoulders: 20,
      sleeveLength: 27,
      shirtLength: 32,
    },
  },
  {
    id: '5',
    name: 'Imran Sheikh',
    phone: '+92 312 4445566',
    email: 'imran.sheikh@email.com',
    address: '67, Clifton Block 5, Karachi',
    createdAt: '2024-05-12',
    totalOrders: 3,
  },
];

// Mock Stitchers
export const mockStitchers: Stitcher[] = [
  {
    id: '1',
    name: 'Mohammad Aslam',
    phone: '+92 301 1112233',
    specialization: 'Sherwani & Suits',
    status: 'Active',
    createdAt: '2023-01-10',
  },
  {
    id: '2',
    name: 'Rashid Hussain',
    phone: '+92 302 4445566',
    specialization: 'Shirts & Pants',
    status: 'Active',
    createdAt: '2023-03-15',
  },
  {
    id: '3',
    name: 'Tariq Mehmood',
    phone: '+92 303 7778899',
    specialization: 'Blazers & Vests',
    status: 'On Leave',
    createdAt: '2023-06-20',
  },
];

// Mock Orders
export const mockOrders: Order[] = [
  {
    id: '1',
    orderId: 'ORD-2024-001',
    customerId: '1',
    customerName: 'Ahmed Khan',
    garmentType: 'Sherwani',
    status: 'In Progress',
    dueDate: '2025-01-04',
    totalAmount: 45000,
    paidAmount: 25000,
    balanceDue: 20000,
    fabricNotes: 'Royal blue silk with gold embroidery',
    measurements: {
      neck: 15.5,
      chest: 40,
      waist: 34,
      shoulders: 18,
      sleeveLength: 25,
    },
    createdAt: '2024-12-20',
    uuid: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    assignedStitcherId: '1',
    items: [{ garmentType: 'Sherwani', quantity: 1 }],
  },
  {
    id: '2',
    orderId: 'ORD-2024-002',
    customerId: '2',
    customerName: 'Usman Ali',
    garmentType: 'Shirt',
    status: 'Ready',
    dueDate: '2024-12-25',
    totalAmount: 4500,
    paidAmount: 4500,
    balanceDue: 0,
    fabricNotes: 'White Egyptian cotton, pearl buttons',
    measurements: {
      neck: 16,
      chest: 42,
      shoulders: 19,
      sleeveLength: 26,
      shirtLength: 31,
    },
    createdAt: '2024-12-18',
    uuid: 'b2c3d4e5-f6a7-8901-bcde-f23456789012',
    assignedStitcherId: '2',
    items: [{ garmentType: 'Shirt', quantity: 2 }],
  },
  {
    id: '3',
    orderId: 'ORD-2024-003',
    customerId: '3',
    customerName: 'Bilal Hussain',
    garmentType: 'Pant',
    status: 'Pending',
    dueDate: '2025-01-05',
    totalAmount: 6500,
    paidAmount: 3000,
    balanceDue: 3500,
    fabricNotes: 'Charcoal grey, slim fit, no pleats',
    measurements: {
      waist: 32,
      trouserLength: 42,
      inseam: 32,
      thigh: 24,
    },
    createdAt: '2024-12-22',
    uuid: 'c3d4e5f6-a7b8-9012-cdef-345678901234',
    assignedStitcherId: '2',
    items: [{ garmentType: 'Pant', quantity: 1 }],
  },
  {
    id: '4',
    orderId: 'ORD-2024-004',
    customerId: '4',
    customerName: 'Faisal Mehmood',
    garmentType: 'Blazer',
    status: 'In Progress',
    dueDate: '2025-01-03',
    totalAmount: 25000,
    paidAmount: 12000,
    balanceDue: 13000,
    fabricNotes: 'Black velvet, satin lapels, wedding wear',
    measurements: {
      chest: 44,
      shoulders: 20,
      sleeveLength: 27,
    },
    createdAt: '2024-12-21',
    uuid: 'd4e5f6a7-b8c9-0123-defa-456789012345',
    assignedStitcherId: '3',
    items: [{ garmentType: 'Blazer', quantity: 1 }],
  },
  {
    id: '5',
    orderId: 'ORD-2024-005',
    customerId: '1',
    customerName: 'Ahmed Khan',
    garmentType: 'Shirt',
    status: 'Pending',
    dueDate: '2025-01-04',
    totalAmount: 8000,
    paidAmount: 0,
    balanceDue: 8000,
    fabricNotes: 'Light blue linen, casual fit',
    measurements: {
      neck: 15.5,
      chest: 40,
      shoulders: 18,
      sleeveLength: 25,
      shirtLength: 30,
    },
    createdAt: '2024-12-23',
    uuid: 'e5f6a7b8-c9d0-1234-efab-567890123456',
    assignedStitcherId: '2',
    items: [{ garmentType: 'Shirt', quantity: 2 }],
  },
];

// Monthly Revenue Data
export const mockMonthlyRevenue: MonthlyRevenue[] = [
  { month: 'Aug', revenue: 185000 },
  { month: 'Sep', revenue: 220000 },
  { month: 'Oct', revenue: 195000 },
  { month: 'Nov', revenue: 280000 },
  { month: 'Dec', revenue: 350000 },
  { month: 'Jan', revenue: 125000 },
];

// Dashboard Metrics
export const mockDashboardMetrics: DashboardMetrics = {
  activeOrders: 4,
  urgentToday: 2,
  totalCustomers: 5,
  pendingPayments: 44500,
};

// Helper functions that mimic API calls
export const getCustomers = (): Promise<Customer[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockCustomers), 300);
  });
};

export const getCustomerById = (id: string): Promise<Customer | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockCustomers.find((c) => c.id === id)), 200);
  });
};

export const searchCustomers = (query: string): Promise<Customer[]> => {
  return new Promise((resolve) => {
    const filtered = mockCustomers.filter(
      (c) =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.phone.includes(query)
    );
    setTimeout(() => resolve(filtered), 150);
  });
};

export const getOrders = (): Promise<Order[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockOrders), 300);
  });
};

export const getOrderByUuid = (uuid: string): Promise<Order | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockOrders.find((o) => o.uuid === uuid)), 200);
  });
};

export const getDashboardMetrics = (): Promise<DashboardMetrics> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockDashboardMetrics), 200);
  });
};

export const getStitchers = (): Promise<Stitcher[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockStitchers), 300);
  });
};

export const getMonthlyRevenue = (): Promise<MonthlyRevenue[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockMonthlyRevenue), 300);
  });
};

export const getUpcomingDeadlines = (): Promise<Order[]> => {
  return new Promise((resolve) => {
    const today = new Date();
    const in48Hours = new Date(today.getTime() + 48 * 60 * 60 * 1000);
    
    const upcoming = mockOrders.filter((o) => {
      const dueDate = new Date(o.dueDate);
      return dueDate <= in48Hours && o.status !== 'Delivered' && o.status !== 'Cancelled';
    }).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    
    setTimeout(() => resolve(upcoming), 200);
  });
};
