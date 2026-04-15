type Transaction = {
  transactionId: string;
  transactionType: "cash" | "credit";
  totalAmount: string;
  totalDiscount: string;
  finalAmount: string;
  items: TransactionItem[]

  paymentStatus: "paid" | "partial" | "unpaid"
  paidAmount: number,
  paymentType: "cash" | "transfer"
};

export type TransactionItem = {
  transactionId: string;
  productId: string;
  productName: string;
  quantity: number;
  price: string;
  discount: number;
  totalAfterDiscount: string;
};

export type Visit = {
  id: string;
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
  transactionItems: TransactionItem[];
  transactionType?: string;
  totalAmount?: number;

  checkInImage?: string;
  checkInImageId?: string;

  checkInAt?: string;
  checkOutAt?: string | null;

  notes?: string;
  orderBy: string;

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