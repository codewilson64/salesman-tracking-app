import type { Request, Response } from "express";
import { customersTable, salesmenTable, visitsTable, transactionsTable } from "../db/schemas";
import { db } from "..";
import { and, eq, gte, lte, or } from "drizzle-orm";

export const getOutstandingTransactions = async (req: Request, res: Response) => {
  try {
    const user = req.user as {
      userId: string;
      companyId: string;
      role: string;
    };

    const { startDate, endDate } = req.query;

    if (!user?.companyId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let conditions = [];

    /* ================= BASE CONDITION ================= */

    conditions.push(eq(transactionsTable.companyId, user.companyId));

    // salesman restriction (same pattern as visits)
    if (user.role === "salesman") {
      const [salesman] = await db
        .select()
        .from(salesmenTable)
        .where(eq(salesmenTable.userId, user.userId));

      if (!salesman) {
        return res.status(400).json({ message: "Salesman not found" });
      }

      conditions.push(eq(visitsTable.salesmanId, user.userId));
    }

    /* ================= PAYMENT STATUS FILTER ================= */

    conditions.push(
      or(
        eq(transactionsTable.paymentStatus, "unpaid"),
        eq(transactionsTable.paymentStatus, "partial")
      )
    );

    /* ================= DATE FILTER ================= */

    if (startDate) {
      conditions.push(gte(transactionsTable.createdAt, new Date(startDate as string)));
    }

    if (endDate) {
      conditions.push(lte(transactionsTable.createdAt, new Date(endDate as string)));
    }

    /* ================= QUERY ================= */

    const transactions = await db
      .select({
        // transaction info
        id: transactionsTable.id,
        transactionType: transactionsTable.transactionType,
        totalAmount: transactionsTable.totalAmount,
        totalDiscount: transactionsTable.totalDiscount,
        finalAmount: transactionsTable.finalAmount,
        paidAmount: transactionsTable.paidAmount,
        remainingAmount: transactionsTable.remainingAmount,
        paymentStatus: transactionsTable.paymentStatus,
        paymentType: transactionsTable.paymentType,
        createdAt: transactionsTable.createdAt,

        // visit info
        visitId: visitsTable.id,
        checkInAt: visitsTable.checkInAt,
        checkOutAt: visitsTable.checkOutAt,

        // customer info
        customerId: customersTable.id,
        customerName: customersTable.customerName,
        shopName: customersTable.shopName,
        customerImage: customersTable.customerImage,
        customerImageId: customersTable.customerImageId,

        // salesman info
        salesmanId: salesmenTable.id,
        salesmanName: salesmenTable.name,
      })
      .from(transactionsTable)
      .leftJoin(visitsTable, eq(transactionsTable.visitId, visitsTable.id))
      .leftJoin(customersTable, eq(visitsTable.customerId, customersTable.id))
      .leftJoin(salesmenTable, eq(visitsTable.salesmanId, salesmenTable.userId))
      .where(and(...conditions));

    return res.status(200).json({
      message: "Outstanding transactions fetched successfully",
      data: transactions,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch outstanding transactions",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const getPaidTransactions = async (req: Request, res: Response) => {
  try {
    const user = req.user as {
      userId: string;
      companyId: string;
      role: string;
    };

    const { startDate, endDate } = req.query;

    if (!user?.companyId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let conditions = [];

    /* ================= BASE CONDITION ================= */

    conditions.push(eq(transactionsTable.companyId, user.companyId));

    // salesman restriction (same pattern as visits)
    if (user.role === "salesman") {
      const [salesman] = await db
        .select()
        .from(salesmenTable)
        .where(eq(salesmenTable.userId, user.userId));

      if (!salesman) {
        return res.status(400).json({ message: "Salesman not found" });
      }

      conditions.push(eq(visitsTable.salesmanId, user.userId));
    }

    /* ================= PAYMENT STATUS FILTER ================= */

    conditions.push(eq(transactionsTable.paymentStatus, "paid"),);

    /* ================= DATE FILTER ================= */

    if (startDate) {
      conditions.push(gte(transactionsTable.createdAt, new Date(startDate as string)));
    }

    if (endDate) {
      conditions.push(lte(transactionsTable.createdAt, new Date(endDate as string)));
    }

    /* ================= QUERY ================= */

    const transactions = await db
      .select({
        // transaction info
        id: transactionsTable.id,
        transactionType: transactionsTable.transactionType,
        totalAmount: transactionsTable.totalAmount,
        totalDiscount: transactionsTable.totalDiscount,
        finalAmount: transactionsTable.finalAmount,
        paidAmount: transactionsTable.paidAmount,
        remainingAmount: transactionsTable.remainingAmount,
        paymentStatus: transactionsTable.paymentStatus,
        paymentType: transactionsTable.paymentType,
        createdAt: transactionsTable.createdAt,

        // visit info
        visitId: visitsTable.id,
        checkInAt: visitsTable.checkInAt,
        checkOutAt: visitsTable.checkOutAt,

        // customer info
        customerId: customersTable.id,
        customerName: customersTable.customerName,
        shopName: customersTable.shopName,
        customerImage: customersTable.customerImage,
        customerImageId: customersTable.customerImageId,

        // salesman info
        salesmanId: salesmenTable.id,
        salesmanName: salesmenTable.name,
      })
      .from(transactionsTable)
      .leftJoin(visitsTable, eq(transactionsTable.visitId, visitsTable.id))
      .leftJoin(customersTable, eq(visitsTable.customerId, customersTable.id))
      .leftJoin(salesmenTable, eq(visitsTable.salesmanId, salesmenTable.userId))
      .where(and(...conditions));

    return res.status(200).json({
      message: "Paid transactions fetched successfully",
      data: transactions,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch paid transactions",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const getTransactionById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    
    const user = req.user as {
      userId: string;
      companyId: string;
      role: string;
    };

    if (!user?.companyId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const [transaction] = await db
      .select({
        id: transactionsTable.id,
        transactionType: transactionsTable.transactionType,
        finalAmount: transactionsTable.finalAmount,
        paidAmount: transactionsTable.paidAmount,
        remainingAmount: transactionsTable.remainingAmount,
        paymentStatus: transactionsTable.paymentStatus,
        paymentType: transactionsTable.paymentType,
        createdAt: transactionsTable.createdAt,

        customerName: customersTable.customerName,
        shopName: customersTable.shopName,

        checkInAt: visitsTable.checkInAt,
      })
      .from(transactionsTable)
      .leftJoin(visitsTable, eq(transactionsTable.visitId, visitsTable.id))
      .leftJoin(customersTable, eq(visitsTable.customerId, customersTable.id))
      .where(
        and(
          eq(transactionsTable.id, id),
          eq(transactionsTable.companyId, user.companyId)
        )
      );

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    return res.status(200).json({
      message: "Transaction fetched successfully",
      data: transaction,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch transaction",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const updateTransactionPayment = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { paidAmount, paymentType } = req.body;

    const user = req.user as {
      userId: string;
      companyId: string;
      role: string;
    };

    if (!user?.companyId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (paidAmount === undefined || paidAmount === null) {
      return res.status(400).json({
        message: "paidAmount is required",
      });
    }

    const data = await db.transaction(async (tx) => {
      const [transaction] = await tx
        .select()
        .from(transactionsTable)
        .where(
          and(
            eq(transactionsTable.id, id),
            eq(transactionsTable.companyId, user.companyId)
          )
        );

      if (!transaction) {
        throw new Error("Transaction not found");
      }

      const finalAmount = Number(transaction.finalAmount);
      const currentPaid = Number(transaction.paidAmount);

      const paymentInput = Number(paidAmount);

      if (paymentInput < 0) {
        throw new Error("Paid amount cannot be negative");
      }

      const newPaidAmount = currentPaid + paymentInput;

      if (newPaidAmount > finalAmount) {
        throw new Error("Paid amount cannot exceed total amount");
      }

      let paymentStatus: "paid" | "partial" | "unpaid" = "unpaid";

      if (newPaidAmount === 0) {
        paymentStatus = "unpaid";
      } else if (newPaidAmount < finalAmount) {
        paymentStatus = "partial";
      } else {
        paymentStatus = "paid";
      }

      let finalPaymentType = paymentType || transaction.paymentType;

      if (newPaidAmount === 0) {
        finalPaymentType = null;
      }

      const remainingAmount = finalAmount - newPaidAmount;

      const [updatedTransaction] = await tx
        .update(transactionsTable)
        .set({
          paidAmount: newPaidAmount.toString(),
          remainingAmount: remainingAmount.toString(),
          paymentStatus,
          paymentType: finalPaymentType,
        })
        .where(eq(transactionsTable.id, id))
        .returning();

      return updatedTransaction;
    });

    return res.status(200).json({
      message: "Transaction payment updated successfully",
      data,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to update transaction payment",
      error: error instanceof Error ? error.message : error,
    });
  }
};