import { Product } from "../types/product";
import { TCheckoutVisit } from "../libs/checkout.schema";
import { DraftConsignmentItem, DraftProduct } from "../types/visitDraft";

export const mapCheckoutToDraft = (
  data: TCheckoutVisit,
  products: Product[] | undefined
) => {
  let mappedProducts: DraftProduct[] = [];
  let mappedConsignmentItems: DraftConsignmentItem[] = [];
  let transactionType = data.transactionType || null;
  let orderBy = data.orderBy || "";

  let totalAmount = 0;

  if (data.result === "Order Baru" || data.result === "Titip Baru") {
    mappedProducts =
      data.products?.map((p) => {
        const product = products?.find((prod) => prod.id === p.productId);

        const price = product?.price || 0;
        const quantity = Number(p.quantity);
        const discount = Number(p.discount || 0);

        const total = data.result === "Titip Baru" ? price * quantity : price * quantity - discount;

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
  }

  if (data.result === "Update Titipan") {
    mappedConsignmentItems =
      data.consignmentItems?.map((item) => ({
        productId: item.productId,
        currentStock: Number(item.currentStock || 0),
        remainingStock: Number(item.remainingStock || 0),
        addedStock: Number(item.addedStock || 0),
        returnedStock: Number(item.returnedStock || 0),
      })) || [];

    transactionType = null;
    orderBy = "";
  }

  /* ================= PAYMENT LOGIC ================= */

  let paymentStatus: "Lunas" | "Bayar Sebagian" | "Belum Lunas" | null = null;
  let paidAmount = 0;
  let paymentType = data.paymentType || null;

  if (data.result === "Order Baru" && transactionType) {
    if (transactionType === "Tunai") {
      paymentStatus = "Lunas";
      paidAmount = totalAmount;
    } else {
      const paid = Number(data.paidAmount || 0);
      paidAmount = paid;

      if (paid === 0) paymentStatus = "Belum Lunas";
      else if (paid < totalAmount) paymentStatus = "Bayar Sebagian";
      else paymentStatus = "Lunas";

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
    consignmentItems: mappedConsignmentItems,
    
    orderBy,
    notes: data.notes || "",
    dueDate: data.result === "Order Baru" ? data.dueDate ?? null : null,

    paymentStatus,
    totalAmount,
    paymentType: data.result === "Order Baru" ? paymentType : null,
    paidAmount: data.result === "Order Baru" ? paidAmount : 0,
  };
};