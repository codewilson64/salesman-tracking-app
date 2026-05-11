import type { Request, Response } from "express";
import { db } from "../index.js";
import { and, count, eq } from "drizzle-orm";
import { visitsTable } from "../db/schemas/visit.js";

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