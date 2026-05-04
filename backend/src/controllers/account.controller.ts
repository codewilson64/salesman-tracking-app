import type { Request, Response } from "express";
import { db } from "../index.js";
import { and, eq, inArray } from "drizzle-orm";
import { v2 as cloudinary } from "cloudinary";

import { areasTable } from "../db/schemas/areas.js";
import { companiesTable } from "../db/schemas/companies.js";
import { customersTable } from "../db/schemas/customers.js";
import { productsTable } from "../db/schemas/products.js";
import { transactionsTable } from "../db/schemas/transactions.js";
import { usersTable } from "../db/schemas/users.js";
import { visitsTable } from "../db/schemas/visit.js";

export const deleteCompanyAccount = async (req: Request, res: Response) => {
  try {
    const user = req.user as {
      companyId: string;
    };

    let imageIds: string[] = [];

    await db.transaction(async (tx) => {
      /* ================= USERS ================= */
      const users = await tx
        .select({ id: usersTable.id, profileImageId: usersTable.profileImageId })
        .from(usersTable)
        .where(eq(usersTable.companyId, user.companyId));

      const salesmanIds = users
        .filter((u) => u.id) // all users (salesmen included)
        .map((u) => u.id);

      /* ================= PRODUCTS ================= */
      const products = await tx
        .select({ productImageId: productsTable.productImageId })
        .from(productsTable)
        .where(eq(productsTable.companyId, user.companyId));

      /* ================= AREAS ================= */
      const areas = salesmanIds.length
        ? await tx
            .select({ id: areasTable.id })
            .from(areasTable)
            .where(inArray(areasTable.salesmanId, salesmanIds))
        : [];

      const areaIds = areas.map((a) => a.id);

      /* ================= CUSTOMERS ================= */
      const customers = areaIds.length
        ? await tx
            .select({
              id: customersTable.id,
              customerImageId: customersTable.customerImageId,
            })
            .from(customersTable)
            .where(inArray(customersTable.areaId, areaIds))
        : [];

      const customerIds = customers.map((c) => c.id);

      /* ================= VISITS ================= */
      const visits = customerIds.length
        ? await tx
            .select({
              id: visitsTable.id,
              checkInImageId: visitsTable.checkInImageId,
            })
            .from(visitsTable)
            .where(inArray(visitsTable.customerId, customerIds))
        : [];

      const visitIds = visits.map((v) => v.id);

      /* ================= IMAGES ================= */
      imageIds = [
        ...users.map((u) => u.profileImageId),
        ...products.map((p) => p.productImageId),
        ...customers.map((c) => c.customerImageId),
        ...visits.map((v) => v.checkInImageId),
      ].filter(Boolean) as string[];

      imageIds = [...new Set(imageIds)];

      /* ================= DELETE ================= */

      if (visitIds.length) {
        await tx.delete(transactionsTable).where(inArray(transactionsTable.visitId, visitIds));
        await tx.delete(visitsTable).where(inArray(visitsTable.id, visitIds));
      }

      if (customerIds.length) {
        await tx.delete(customersTable).where(inArray(customersTable.id, customerIds));
      }

      if (areaIds.length) {
        await tx.delete(areasTable).where(inArray(areasTable.id, areaIds));
      }

      await tx.delete(usersTable).where(eq(usersTable.companyId, user.companyId));
      await tx.delete(productsTable).where(eq(productsTable.companyId, user.companyId));
      await tx.delete(companiesTable).where(eq(companiesTable.id, user.companyId));
    });

    if (imageIds.length) {
      await Promise.allSettled(
        imageIds.map((id) => cloudinary.uploader.destroy(id))
      );
    }

    return res.status(200).json({
      message: "Company account deleted successfully",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to delete company account",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const deleteMyAccount = async (req: Request, res: Response) => {
  try {
    const user = req.user as {
      userId: string;
    };

    let imageIds: string[] = [];

    await db.transaction(async (tx) => {
      /* USER */
      const [userData] = await tx
        .select({ profileImageId: usersTable.profileImageId })
        .from(usersTable)
        .where(eq(usersTable.id, user.userId));

      /* AREAS */
      const areas = await tx
        .select({ id: areasTable.id })
        .from(areasTable)
        .where(eq(areasTable.salesmanId, user.userId));

      const areaIds = areas.map((a) => a.id);

      /* CUSTOMERS */
      const customers = areaIds.length
        ? await tx
            .select({
              id: customersTable.id,
              customerImageId: customersTable.customerImageId,
            })
            .from(customersTable)
            .where(inArray(customersTable.areaId, areaIds))
        : [];

      const customerIds = customers.map((c) => c.id);

      /* VISITS */
      const visits = customerIds.length
        ? await tx
            .select({
              id: visitsTable.id,
              checkInImageId: visitsTable.checkInImageId,
            })
            .from(visitsTable)
            .where(inArray(visitsTable.customerId, customerIds))
        : [];

      const visitIds = visits.map((v) => v.id);

      /* IMAGES */
      imageIds = [
        userData?.profileImageId,
        ...customers.map((c) => c.customerImageId),
        ...visits.map((v) => v.checkInImageId),
      ].filter(Boolean) as string[];

      /* DELETE */
      if (visitIds.length) {
        await tx.delete(transactionsTable).where(inArray(transactionsTable.visitId, visitIds));
        await tx.delete(visitsTable).where(inArray(visitsTable.id, visitIds));
      }

      if (customerIds.length) {
        await tx.delete(customersTable).where(inArray(customersTable.id, customerIds));
      }

      if (areaIds.length) {
        await tx.delete(areasTable).where(inArray(areasTable.id, areaIds));
      }

      await tx.delete(usersTable).where(eq(usersTable.id, user.userId));
    });

    if (imageIds.length) {
      await Promise.allSettled(
        imageIds.map((id) => cloudinary.uploader.destroy(id))
      );
    }

    return res.status(200).json({
      message: "Account deleted successfully",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to delete account",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const deleteSalesmanAccountByAdmin = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const user = req.user as {
      companyId: string;
    };

    let imageIds: string[] = [];

    await db.transaction(async (tx) => {
      /* USER */
      const [userData] = await tx
        .select({
          id: usersTable.id,
          profileImageId: usersTable.profileImageId,
        })
        .from(usersTable)
        .where(
          and(
            eq(usersTable.id, id),
            eq(usersTable.companyId, user.companyId),
            eq(usersTable.role, "salesman")
          )
        );

      if (!userData) throw new Error("NOT_FOUND");

      /* AREAS */
      const areas = await tx
        .select({ id: areasTable.id })
        .from(areasTable)
        .where(eq(areasTable.salesmanId, id));

      const areaIds = areas.map((a) => a.id);

      /* CUSTOMERS */
      const customers = areaIds.length
        ? await tx
            .select({
              id: customersTable.id,
              customerImageId: customersTable.customerImageId,
            })
            .from(customersTable)
            .where(inArray(customersTable.areaId, areaIds))
        : [];

      const customerIds = customers.map((c) => c.id);

      /* VISITS */
      const visits = customerIds.length
        ? await tx
            .select({
              id: visitsTable.id,
              checkInImageId: visitsTable.checkInImageId,
            })
            .from(visitsTable)
            .where(inArray(visitsTable.customerId, customerIds))
        : [];

      const visitIds = visits.map((v) => v.id);

      /* IMAGES */
      imageIds = [
        userData.profileImageId,
        ...customers.map((c) => c.customerImageId),
        ...visits.map((v) => v.checkInImageId),
      ].filter(Boolean) as string[];

      imageIds = [...new Set(imageIds)];

      /* DELETE */
      if (visitIds.length) {
        await tx.delete(transactionsTable).where(inArray(transactionsTable.visitId, visitIds));
        await tx.delete(visitsTable).where(inArray(visitsTable.id, visitIds));
      }

      if (customerIds.length) {
        await tx.delete(customersTable).where(inArray(customersTable.id, customerIds));
      }

      if (areaIds.length) {
        await tx.delete(areasTable).where(inArray(areasTable.id, areaIds));
      }

      await tx.delete(usersTable).where(eq(usersTable.id, id));
    });

    if (imageIds.length) {
      await Promise.allSettled(
        imageIds.map((id) => cloudinary.uploader.destroy(id))
      );
    }

    return res.status(200).json({
      message: "Salesman account deleted successfully",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to delete salesman account",
      error: error instanceof Error ? error.message : error,
    });
  }
};