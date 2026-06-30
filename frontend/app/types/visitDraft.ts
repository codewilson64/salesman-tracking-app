export type VisitResult = "Order Baru" | "Titip Baru" | "Update Titipan" | "Follow Up" | "Tutup Toko";
export type TransactionType = "Tunai" | "Kredit";
export type PaymentType = "Tunai" | "Transfer";

export type DraftProduct = {
  productId: string;
  quantity: number;
  price: number;
  discount: number;
};

export type DraftConsignmentItem = {
  productId: string;
  currentStock: number;
  remainingStock: number;
  addedStock: number;
  returnedStock: number;
};

export type VisitDraft = {
  result: VisitResult | null;
  transactionType: TransactionType | null;

  products: DraftProduct[];
  consignmentItems: DraftConsignmentItem[];

  paidAmount: number;
  paymentType: PaymentType | null;
  orderBy: string;
  dueDate: string | null;
  notes: string;
};

export type VisitDraftState = {
  drafts: Record<string, VisitDraft>;
  setDraft: (visitId: string, data: Partial<VisitDraft>) => void;
  getDraft: (visitId: string) => VisitDraft | undefined;
  resetDraft: (visitId: string) => void;
};