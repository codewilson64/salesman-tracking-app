import type { Request, Response } from "express";
import { db } from "../index.js";
import { and, count, eq } from "drizzle-orm";
import { visitsTable } from "../db/schemas/visit.js";
import { transactionsTable } from "../db/schemas/transactions.js";

export const getUnreadVisitsCount = async (req: Request, res: Response) => {
  try {
    const user = req.user as {
      userId: string;
      companyId: string;
      role: string;
    };

    if (!user?.companyId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const [result] = await db
      .select({
        count: count(),
      })
      .from(visitsTable)
      .where(
        and(
          eq(visitsTable.companyId, user.companyId),
          user.role === "owner"
            ? eq(visitsTable.isAdminNotificationRead, false)
            : and(
                eq(visitsTable.isSalesmanNotificationRead, false),
                eq(visitsTable.salesmanId, user.userId)
              )
        )
      );

      if(!result) {
        return res.status(404).json({ message: "Result not found" });
      }

      return res.status(200).json({
        count: Number(result.count),
      });
  } 
  catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to get unread visits count",
    });
  }
};

export const getTransactionNotificationCounts = async (req: Request, res: Response) => {
    try {
      const user = req.user as {
        userId: string;
        companyId: string;
        role: string;
      };

      const [paid] = await db
        .select({ count: count() })
        .from(transactionsTable)
        .innerJoin(visitsTable, eq(transactionsTable.visitId, visitsTable.id))
        .where(
          and(
            eq(transactionsTable.companyId, user.companyId),
            user.role === "owner"
              ? eq(transactionsTable.adminPaidNotificationRead, false)
              : and(
                  eq(transactionsTable.salesmanPaidNotificationRead, false),
                  eq(visitsTable.salesmanId, user.userId)
                )
          )
        );

      const [unpaid] = await db
        .select({ count: count() })
        .from(transactionsTable)
        .innerJoin(visitsTable, eq(transactionsTable.visitId, visitsTable.id))
        .where(
          and(
            eq(transactionsTable.companyId, user.companyId),
            user.role === "owner"
            ? eq(transactionsTable.adminUnpaidNotificationRead, false)
            : and(
                eq(transactionsTable.salesmanUnpaidNotificationRead, false),
                eq(visitsTable.salesmanId, user.userId)
              )
          )
        );

      if(!paid || !unpaid) {
        return res.status(404).json({ message: "Result not found" });
      }

      return res.status(200).json({
        paid: Number(paid.count),
        unpaid: Number(unpaid.count),
      });
    } 
    catch (error) {
      return res.status(500).json({ message: "Failed to get transaction notifications" });
    }
};

export const markVisitsReportsAsRead = async (req: Request, res: Response) => {
  try {
    const user = req.user as {
      userId: string;
      role: string;
      companyId: string;
    };

    await db
      .update(visitsTable)
      .set({
        ...(user.role === "owner"
        ? { isAdminNotificationRead: true }
        : { isSalesmanNotificationRead: true }),
      })
      .where(
        and(
          eq(visitsTable.companyId, user.companyId),
          user.role === "owner"
            ? eq(visitsTable.isAdminNotificationRead, false)
            : and(
                eq(visitsTable.isSalesmanNotificationRead, false),
                eq(visitsTable.salesmanId, user.userId)
            )
        )
      );

    return res.status(200).json({
      message: "Visits marked as read",
    });
  } 
  catch (error) {
    return res.status(500).json({
      message: "Failed to mark visits as read",
    });
  }
};

export const markPaidNotificationsAsRead = async (req: Request, res: Response) => {
  try {
    const user = req.user as {
      userId: string;
      role: string;
      companyId: string;
    };

    await db
      .update(transactionsTable)
      .set({
        ...(user.role === "owner"
          ? { adminPaidNotificationRead: true }
          : { salesmanPaidNotificationRead: true }),
      })
      .from(visitsTable)
      .where(
        and(
          eq(transactionsTable.visitId, visitsTable.id),
          eq(transactionsTable.companyId, user.companyId),
          user.role === "owner"
            ? eq(transactionsTable.adminPaidNotificationRead, false)
            : and(
                eq(transactionsTable.salesmanPaidNotificationRead, false),
                eq(visitsTable.salesmanId, user.userId)
            )
        )
      );

    return res.status(200).json({
      message: "Paid notifications marked as read",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to mark paid notifications",
    });
  }
};

export const markUnpaidNotificationsAsRead = async (req: Request, res: Response) => {
  try {
    const user = req.user as {
      userId: string;
      role: string;
      companyId: string;
    };

    await db
      .update(transactionsTable)
      .set({
        ...(user.role === "owner"
          ? { adminUnpaidNotificationRead: true }
          : { salesmanUnpaidNotificationRead: true }),
      })
      .from(visitsTable)
      .where(
        and(
          eq(transactionsTable.visitId, visitsTable.id),
          eq(transactionsTable.companyId, user.companyId),
          user.role === "owner"
            ? eq(transactionsTable.adminUnpaidNotificationRead, false)
            : and(
                eq(transactionsTable.salesmanUnpaidNotificationRead, false),
                eq(visitsTable.salesmanId, user.userId)
            )
        )
      );

    return res.status(200).json({
      message: "Unpaid notifications marked as read",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to mark unpaid notifications",
    });
  }
};
