export type DraftProduct = {
  productId: string;
  quantity: number;
  price: number;
  discount: number;
};

export type VisitDraft = {
  result: "new order" | "follow-up" | "shop closed" | null;
  transactionType: "cash" | "credit" | null;
  products: DraftProduct[];
  orderBy: string;
  notes: string;
};

export type VisitDraftState = {
  drafts: Record<string, VisitDraft>;

  setDraft: (visitId: string, data: Partial<VisitDraft>) => void;
  getDraft: (visitId: string) => VisitDraft | undefined;
  resetDraft: (visitId: string) => void;
};