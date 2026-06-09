import type { Request, Response } from "express";
import { customersTable } from "../db/schemas/customers.js";
import { transactionsTable } from "../db/schemas/transactions.js";
import { visitsTable } from "../db/schemas/visit.js";
import { db } from "../index.js";
import { and, eq, gte, lte, or } from "drizzle-orm";
import { usersTable } from "../db/schemas/users.js";

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

    conditions.push(eq(transactionsTable.companyId, user.companyId));

    if (user.role === "salesman") {
      conditions.push(eq(visitsTable.salesmanId, user.userId));
    }

    // payment filter
    conditions.push(
      or(
        eq(transactionsTable.paymentStatus, "unpaid"),
        eq(transactionsTable.paymentStatus, "partial")
      )
    );

    if (startDate) {
      conditions.push(gte(transactionsTable.createdAt, new Date(startDate as string)));
    }

    if (endDate) {
      conditions.push(lte(transactionsTable.createdAt, new Date(endDate as string)));
    }

    const transactions = await db
      .select({
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

        visitId: visitsTable.id,
        checkInAt: visitsTable.checkInAt,
        dueDate: visitsTable.dueDate,

        customerId: customersTable.id,
        customerName: customersTable.customerName,
        shopName: customersTable.shopName,
        customerImage: customersTable.customerImage,

        salesmanId: usersTable.id,
        salesmanName: usersTable.name,
      })
      .from(transactionsTable)
      .leftJoin(visitsTable, eq(transactionsTable.visitId, visitsTable.id))
      .leftJoin(customersTable, eq(visitsTable.customerId, customersTable.id))
      .leftJoin(usersTable, eq(visitsTable.salesmanId, usersTable.id))
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

    conditions.push(eq(transactionsTable.companyId, user.companyId));

    if (user.role === "salesman") {
      conditions.push(eq(visitsTable.salesmanId, user.userId));
    }

    conditions.push(eq(transactionsTable.paymentStatus, "paid"));

    if (startDate) {
      conditions.push(gte(transactionsTable.createdAt, new Date(startDate as string)));
    }

    if (endDate) {
      conditions.push(lte(transactionsTable.createdAt, new Date(endDate as string)));
    }

    const transactions = await db
      .select({
        id: transactionsTable.id,
        transactionType: transactionsTable.transactionType,
        finalAmount: transactionsTable.finalAmount,
        paidAmount: transactionsTable.paidAmount,
        remainingAmount: transactionsTable.remainingAmount,
        paymentStatus: transactionsTable.paymentStatus,
        paymentType: transactionsTable.paymentType,
        createdAt: transactionsTable.createdAt,

        visitId: visitsTable.id,
        checkInAt: visitsTable.checkInAt,

        customerId: customersTable.id,
        customerName: customersTable.customerName,
        shopName: customersTable.shopName,
        customerImage: customersTable.customerImage,

        salesmanId: usersTable.id,
        salesmanName: usersTable.name,
      })
      .from(transactionsTable)
      .leftJoin(visitsTable, eq(transactionsTable.visitId, visitsTable.id))
      .leftJoin(customersTable, eq(visitsTable.customerId, customersTable.id))
      .leftJoin(usersTable, eq(visitsTable.salesmanId, usersTable.id))
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
        visitId: transactionsTable.visitId,
        transactionType: transactionsTable.transactionType,
        finalAmount: transactionsTable.finalAmount,
        paidAmount: transactionsTable.paidAmount,
        remainingAmount: transactionsTable.remainingAmount,
        paymentStatus: transactionsTable.paymentStatus,
        paymentType: transactionsTable.paymentType,
        paidAt: transactionsTable.paidAt,
        createdAt: transactionsTable.createdAt,

        customerName: customersTable.customerName,
        shopName: customersTable.shopName,

        salesmanId: usersTable.id,
        salesmanName: usersTable.name,

        checkInAt: visitsTable.checkInAt,
        dueDate: visitsTable.dueDate,
      })
      .from(transactionsTable)
      .leftJoin(visitsTable, eq(transactionsTable.visitId, visitsTable.id))
      .leftJoin(customersTable, eq(visitsTable.customerId, customersTable.id))
      .leftJoin(usersTable, eq(visitsTable.salesmanId, usersTable.id))
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
          paidAt: paymentStatus === "paid" ? transaction.paidAt || new Date() : null,

          adminPaidNotificationRead:
            paymentStatus === "paid" ? false : true,

          salesmanPaidNotificationRead:
            paymentStatus === "paid" ? false : true,

          adminUnpaidNotificationRead:
            paymentStatus !== "paid" ? false : true,

          salesmanUnpaidNotificationRead:
            paymentStatus !== "paid" ? false : true,
        })
        .where(eq(transactionsTable.id, id))
        .returning();

        const previousStatus = transaction.paymentStatus;

        const movedToPaid = previousStatus !== "paid" && paymentStatus === "paid";

        if (movedToPaid) {
          await tx
            .update(visitsTable)
            .set({
              ...(user.role === "owner"
                ? { isSalesmanNotificationRead: false }
                : { isAdminNotificationRead: false }),
            })
            .where(eq(visitsTable.id, transaction.visitId));
        }

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