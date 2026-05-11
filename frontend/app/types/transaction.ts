export type Transaction = {
  id: string,
  visitId: string;
  
  salesmanId: string;
  salesmanName: string;
  salesmanImage: string;

  customerId: string;
  customerName: string;
  shopName: string;
  customerImage?: string;
  customerImageId?: string;
  
  finalAmount: number;
  remainingAmount: number;
  transactionType: "cash" | "credit";
  paymentStatus: "unpaid" | "partial";
  checkInAt?: string;
  paidAt: string;
}

export type GroupedTransaction = {
  customerId: string;
  customerName: string;
  shopName: string;
  totalOutstanding: number;
  customerImage?: string;
  transactions: Transaction[];
};