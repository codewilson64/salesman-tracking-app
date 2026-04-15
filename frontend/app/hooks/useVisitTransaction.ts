import { useMemo } from "react";
import { DraftProduct, VisitDraft } from "../types/visitDraft";
import { TransactionItem, Visit } from "../types/visit";

export type MappedItem = {
  productId: string;
  quantity: number;
  price: number;
  discount: number;
  totalAfterDiscount: number;
};

export const useVisitTransaction = (
  visit?: Visit,
  draft?: VisitDraft
) => {
  return useMemo(() => {
    if (!visit) {
      return {
        mappedItems: [] as MappedItem[],
        subtotal: 0,
        totalDiscount: 0,
        finalAmount: 0,
        transactionType: null as "cash" | "credit" | null,
        paymentStatus: null as "paid" | "partial" | "unpaid" | null,
        paidAmount: 0,
        paymentType: null as "cash" | "transfer" | null,
      };
    }

    const isCheckedOut = !!visit.checkOutAt;

    const dbItems = visit.transactions?.flatMap((t) => t.items) ?? [];

    const displayItems: (TransactionItem | DraftProduct)[] =
      isCheckedOut ? dbItems : draft?.products || [];

    const mappedItems: MappedItem[] = displayItems.map((item) => {
      const quantity = Number(item.quantity);
      const price = Number(item.price);
      const discount = Number(item.discount || 0);

      const subtotal = price * quantity;

      const totalAfterDiscount =
        "totalAfterDiscount" in item && item.totalAfterDiscount != null
        ? Number(item.totalAfterDiscount)
        : subtotal - discount;

      return {
        productId: item.productId,
        quantity,
        price,
        discount,
        totalAfterDiscount
      };
    });

    const subtotal = mappedItems.reduce(
      (sum, item) => sum + item.price * item.quantity, 0
    );

    const totalDiscount = mappedItems.reduce(
      (sum, item) => sum + item.discount, 0
    );

    const finalAmount = subtotal - totalDiscount;

    const transactionType = isCheckedOut
      ? visit.transactions?.[0]?.transactionType ?? null
      : draft?.transactionType ?? null;

    const paymentStatus = isCheckedOut
      ? visit.transactions?.[0]?.paymentStatus ?? null
      : null;

    const paidAmount = isCheckedOut
      ? visit.transactions?.[0]?.paidAmount ?? 0
      : draft?.paidAmount ?? 0;

    const paymentType = isCheckedOut
      ? visit.transactions?.[0]?.paymentType ?? 0
      : draft?.paymentType ?? 0;

    return {
      mappedItems,
      subtotal,
      totalDiscount,
      finalAmount,
      transactionType,
      paymentStatus,
      paidAmount,
      paymentType,
    };
  }, [visit, draft]);
};