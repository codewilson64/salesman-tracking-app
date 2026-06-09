export type VisitResult = "new order" | "follow-up" | "shop closed";
export type TransactionType = "cash" | "credit";
export type PaymentType = "cash" | "transfer";

export type DraftProduct = {
  productId: string;
  quantity: number;
  price: number;
  discount: number;
};

export type VisitDraft = {
  result: VisitResult | null;
  transactionType: TransactionType | null;
  products: DraftProduct[];
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