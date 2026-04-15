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
        transactionId: transactionsTable.id,
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