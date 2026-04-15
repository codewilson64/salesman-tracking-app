import { GroupedTransaction, Transaction } from "../../types/transaction";
import { groupBy } from "./group";

export const groupTransactionsByCustomer = (
  transactions: Transaction[]
): GroupedTransaction[] => {
  const grouped = groupBy(transactions, (t) => t.customerId);

  return Object.entries(grouped).map(([customerId, transactions]) => ({
    customerId,
    customerName: transactions[0].customerName,
    shopName: transactions[0].shopName,
    customerImage: transactions[0].customerImage,
    finalAmount: transactions[0].finalAmount,
    totalOutstanding: transactions.reduce(
        (sum, t) => sum + Number(t.remainingAmount),
        0
        ),
    checkInAt: transactions[0].checkInAt,
    transactions,
  }));
};