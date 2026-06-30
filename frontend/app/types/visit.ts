type Transaction = {
  transactionId: string;
  transactionType: "Tunai" | "Kredit";
  totalAmount: string;
  totalDiscount: string;
  finalAmount: string;
  items: TransactionItem[]

  paymentStatus: "Lunas" | "Belum Lunas" | "Bayar Sebagian",
  paidAmount: number,
  paymentType: "Tunai" | "Transfer"
};

export type TransactionItem = {
  transactionId: string;
  productId: string;
  productName: string;
  unit: string;
  quantity: number;
  price: string;
  discount: number;
  totalAfterDiscount: string;
};

export type Visit = {
  id: string;
  date: string;
  areaId: string;
  areaName: string;
  customerId: string;
  customerName: string;
  salesmanId: string;
  salesmanName: string;
  salesmanImage?: string;
  salesmanImageId?: string;

  shopName: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;

  status: string;
  visitResult?: string;
  duration: number;
  transactions: Transaction[];
  consignmentItems?: {
    productId: string;
    productName: string;
    quantity: number;
    price: string | number;
    totalAmount: string | number;
  }[];
  transactionItems: TransactionItem[];
  transactionType?: string;
  totalAmount?: number;

  checkInImage?: string;
  checkInImageId?: string;

  checkInAt?: string;
  checkOutAt?: string | null;

  notes?: string;
  orderBy: string;

  checkInDistanceMeters: number;
  checkOutDistanceMeters: number;
  checkInGpsAccuracy: number;
  checkOutGpsAccuracy: number;

  approvalStatus: string;
  approveBy: string;
  rejectionReason: string;
  adminNote: string;
};

export type GroupedVisit = {
  salesmanId: string;
  salesmanName: string;
  salesmanImage?: string;
  visits: Visit[];
};