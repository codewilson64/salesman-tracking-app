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

    return {
      mappedItems,
      subtotal,
      totalDiscount,
      finalAmount,
      transactionType,
    };
  }, [visit, draft]);
};