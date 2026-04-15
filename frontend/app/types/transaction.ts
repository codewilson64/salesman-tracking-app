export type Transaction = {
  id: string,
  customerId: string;
  customerName: string;
  shopName: string;
  finalAmount: number;
  remainingAmount: number;
  paymentStatus: "unpaid" | "partial";
  customerImage?: string;
  customerImageId?: string;
  checkInAt?: string;
}

export type GroupedTransaction = {
  customerId: string;
  customerName: string;
  shopName: string;
  totalOutstanding: number;
  customerImage?: string;
  transactions: Transaction[];
};