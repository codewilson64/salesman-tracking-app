import { Product } from "../types/product";
import { TCheckoutVisit } from "../libs/checkout.schema";
import { DraftProduct } from "../types/visitDraft";

export const mapCheckoutToDraft = (
  data: TCheckoutVisit,
  products: Product[] | undefined
) => {
  let mappedProducts: DraftProduct[] = [];
  let transactionType = data.transactionType || null;
  let orderBy = data.orderBy || "";

  let totalAmount = 0;

  if (data.result === "new order") {
    mappedProducts =
      data.products?.map((p) => {
        const product = products?.find((prod) => prod.id === p.productId);

        const price = product?.price || 0;
        const quantity = Number(p.quantity);
        const discount = Number(p.discount || 0);

        const total = price * quantity - discount;

        totalAmount += total;

        return {
          productId: p.productId,
          quantity,
          price,
          discount,
        };
      }) || [];
  } else {
    transactionType = null;
    orderBy = "";
  }

  /* ================= PAYMENT LOGIC ================= */

  let paymentStatus: "paid" | "partial" | "unpaid" | null = null;
  let paidAmount = 0;
  let paymentType = data.paymentType || null;

  if (data.result === "new order" && transactionType) {
    if (transactionType === "cash") {
      paymentStatus = "paid";
      paidAmount = totalAmount;
    } else {
      const paid = Number(data.paidAmount || 0);
      paidAmount = paid;

      if (paid === 0) paymentStatus = "unpaid";
      else if (paid < totalAmount) paymentStatus = "partial";
      else paymentStatus = "paid";

      // if unpaid → no payment type
      if (paid === 0) {
        paymentType = null;
      }
    }
  }

  return {
    result: data.result || null,
    transactionType,
    products: mappedProducts,
    orderBy,
    notes: data.notes || "",

    // ✅ ADD THESE
    totalAmount,
    paidAmount,
    paymentStatus,
    paymentType,
  };
};