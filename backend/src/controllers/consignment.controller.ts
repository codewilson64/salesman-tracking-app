import type { Request, Response } from "express";
import { and, desc, eq } from "drizzle-orm";
import { db } from "../index.js";
import { visitsTable } from "../db/schemas/visit.js";
import { consignmentItemsTable } from "../db/schemas/consignment_items.js";
import { productsTable } from "../db/schemas/products.js";

export const getCurrentConsignmentStock = async (req: Request, res: Response) => {
  try {
    const { customerId, productId } = req.body;

    const user = req.user as {
      companyId: string;
    };

    if (!user?.companyId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!customerId || !productId) {
      return res.status(400).json({
        message: "customerId and productId are required",
      });
    }

    const [latestItem] = await db
      .select({
        productId: consignmentItemsTable.productId,
        currentStock: consignmentItemsTable.newStock,
      })
      .from(consignmentItemsTable)
      .innerJoin(visitsTable, eq(consignmentItemsTable.visitId, visitsTable.id))
      .where(
        and(
          eq(visitsTable.companyId, user.companyId),
          eq(visitsTable.customerId, customerId),
          eq(consignmentItemsTable.productId, productId)
        )
      )
      .orderBy(desc(consignmentItemsTable.createdAt))
      .limit(1);

    return res.status(200).json({
      message: "Current consignment stock fetched successfully",
      data: {
        productId,
        currentStock: Number(latestItem?.currentStock ?? 0),
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to get current consignment stock",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const getCustomerConsignmentStocks = async (req: Request, res: Response) => {
  try {
    const customerId = req.params.id as string;

    const user = req.user as {
      companyId: string;
    };

    if (!user?.companyId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const rows = await db
      .select({
        productId: consignmentItemsTable.productId,
        productName: productsTable.name,
        unit: productsTable.unit,
        currentStock: consignmentItemsTable.newStock,
        lastUpdated: consignmentItemsTable.createdAt,
      })
      .from(consignmentItemsTable)
      .innerJoin(visitsTable, eq(consignmentItemsTable.visitId, visitsTable.id))
      .innerJoin(productsTable, eq(consignmentItemsTable.productId, productsTable.id))
      .where(
        and(
          eq(visitsTable.companyId, user.companyId),
          eq(visitsTable.customerId, customerId)
        )
      )
      .orderBy(desc(consignmentItemsTable.createdAt));

    const latestByProduct = new Map();

    for (const row of rows) {
      if (!latestByProduct.has(row.productId)) {
        latestByProduct.set(row.productId, {
          productId: row.productId,
          productName: row.productName,
          unit: row.unit,
          currentStock: Number(row.currentStock ?? 0),
          lastUpdated: row.lastUpdated,
        });
      }
    }

    const data = Array.from(latestByProduct.values()).filter(
      (item) => item.currentStock > 0
    );

    return res.status(200).json({
      message: "Customer consignment stocks fetched successfully",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch customer consignment stocks",
      error: error instanceof Error ? error.message : error,
    });
  }
};