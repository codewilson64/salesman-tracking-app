import { useMemo } from "react";
import { DraftProduct, VisitDraft } from "../types/visitDraft";
import { TransactionItem, Visit } from "../types/visit";
import { Product } from "../types/product";

export type MappedItem = {
  productId: string;
  quantity: number;
  price: number;
  discount: number;
  totalAfterDiscount: number;
};

export const useVisitTransaction = (
  visit?: Visit,
  draft?: VisitDraft,
  products?: Product[]
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

    const isTitip = visit.visitResult === "Titip Baru" || draft?.result === "Titip Baru";

    const transactionItems = visit.transactions?.flatMap((t) => t.items) ?? [];

    const consignmentItems = visit.consignmentItems?.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: Number(item.price),
        discount: 0,
        totalAfterDiscount: Number(item.totalAmount),
      })) ?? [];

    const dbItems = isTitip ? consignmentItems : transactionItems;

    const displayItems: (TransactionItem | DraftProduct)[] =
      isCheckedOut ? dbItems : draft?.products || [];

    const mappedItems: MappedItem[] = displayItems.map((item: any) => {
      const productFromList = products?.find((p) => p.id === item.productId);
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
        productName: item.productName || productFromList?.name,
        unit: item.unit || productFromList?.unit,
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