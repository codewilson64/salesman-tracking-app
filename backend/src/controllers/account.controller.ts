import type { Request, Response } from "express";
import { db } from "..";
import { areasTable, companiesTable, customersTable, productsTable, salesmenTable, transactionsTable, usersTable, visitsTable } from "../db/schemas";
import { and, eq, inArray } from "drizzle-orm";
import { v2 as cloudinary } from "cloudinary";

export const deleteCompanyAccount = async (req: Request, res: Response) => {
  try {
    const user = req.user as {
      userId: string;
      companyId: string;
      role: string;
    };

    let imageIds: string[] = [];

    await db.transaction(async (tx) => {
      /* ================= COLLECT IMAGE IDS FIRST ================= */

      // 1. Users (profile images)
      const users = await tx
        .select({ profileImageId: usersTable.profileImageId })
        .from(usersTable)
        .where(eq(usersTable.companyId, user.companyId));

      // 2. Products (product images)
      const products = await tx
        .select({ productImageId: productsTable.productImageId })
        .from(productsTable)
        .where(eq(productsTable.companyId, user.companyId));

      // 3. Get all salesmen
      const salesmen = await tx
        .select({ id: salesmenTable.id })
        .from(salesmenTable)
        .where(eq(salesmenTable.companyId, user.companyId));

      const salesmanIds = salesmen.map((s) => s.id);

      // 4. Areas
      const areas = salesmanIds.length
        ? await tx
            .select({ id: areasTable.id })
            .from(areasTable)
            .where(inArray(areasTable.salesmanId, salesmanIds))
        : [];

      const areaIds = areas.map((a) => a.id);

      // 5. Customers (images)
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

      // 6. Visits (images)
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

      /* ================= MERGE IMAGE IDS ================= */

      imageIds = [
        ...users.map((u) => u.profileImageId),
        ...products.map((p) => p.productImageId),
        ...customers.map((c) => c.customerImageId),
        ...visits.map((v) => v.checkInImageId),
      ]
        .filter(Boolean) as string[];

      // optional dedupe
      imageIds = [...new Set(imageIds)];

      /* ================= DELETE DATA ================= */

      // Transactions (items auto cascade)
      if (visitIds.length) {
        await tx
          .delete(transactionsTable)
          .where(inArray(transactionsTable.visitId, visitIds));
      }

      // Visits
      if (visitIds.length) {
        await tx
          .delete(visitsTable)
          .where(inArray(visitsTable.id, visitIds));
      }

      // Customers
      if (customerIds.length) {
        await tx
          .delete(customersTable)
          .where(inArray(customersTable.id, customerIds));
      }

      // Areas
      if (areaIds.length) {
        await tx
          .delete(areasTable)
          .where(inArray(areasTable.id, areaIds));
      }

      // Salesmen
      if (salesmanIds.length) {
        await tx
          .delete(salesmenTable)
          .where(inArray(salesmenTable.id, salesmanIds));
      }

      // Users
      await tx
        .delete(usersTable)
        .where(eq(usersTable.companyId, user.companyId));

      // Products
      await tx
        .delete(productsTable)
        .where(eq(productsTable.companyId, user.companyId));

      // Company (last)
      await tx
        .delete(companiesTable)
        .where(eq(companiesTable.id, user.companyId));
    });

    /* ================= DELETE IMAGES AFTER TX ================= */

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
      companyId: string;
      role: string;
    };

    let imageIds: string[] = [];

    await db.transaction(async (tx) => {
      // 1. Get salesman
      const [salesman] = await tx
        .select()
        .from(salesmenTable)
        .where(eq(salesmenTable.userId, user.userId));

      if (!salesman) {
        throw new Error("NOT_FOUND");
      }

      // 2. Get user (for profile image)
      const [userData] = await tx
        .select({ profileImageId: usersTable.profileImageId })
        .from(usersTable)
        .where(eq(usersTable.id, user.userId));

      // 3. Areas
      const areas = await tx
        .select({ id: areasTable.id })
        .from(areasTable)
        .where(eq(areasTable.salesmanId, salesman.id));

      const areaIds = areas.map((a) => a.id);

      // 4. Customers (collect images)
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

      // 5. Visits (collect images)
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

      /* ================= COLLECT IMAGE IDS ================= */

      imageIds = [
        userData?.profileImageId,
        ...customers.map((c) => c.customerImageId),
        ...visits.map((v) => v.checkInImageId),
      ].filter(Boolean) as string[];

      /* ================= DELETE DATA ================= */

      // 6. Transactions (items auto cascade)
      if (visitIds.length) {
        await tx
          .delete(transactionsTable)
          .where(inArray(transactionsTable.visitId, visitIds));
      }

      // 7. Visits
      if (visitIds.length) {
        await tx
          .delete(visitsTable)
          .where(inArray(visitsTable.id, visitIds));
      }

      // 8. Customers
      if (customerIds.length) {
        await tx
          .delete(customersTable)
          .where(inArray(customersTable.id, customerIds));
      }

      // 9. Areas
      if (areaIds.length) {
        await tx
          .delete(areasTable)
          .where(inArray(areasTable.id, areaIds));
      }

      // 10. Salesman
      await tx
        .delete(salesmenTable)
        .where(eq(salesmenTable.id, salesman.id));

      // 11. User
      await tx
        .delete(usersTable)
        .where(eq(usersTable.id, user.userId));
    });

    /* ================= DELETE IMAGES (AFTER TX) ================= */

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
      userId: string;
      companyId: string;
      role: string;
    };

    let imageIds: string[] = [];

    await db.transaction(async (tx) => {
      /* ================= GET SALESMAN ================= */

      const [salesman] = await tx
        .select()
        .from(salesmenTable)
        .where(
          and(
            eq(salesmenTable.id, id),
            eq(salesmenTable.companyId, user.companyId)
          )
        );

      if (!salesman) {
        throw new Error("NOT_FOUND");
      }

      /* ================= GET USER ================= */

      const [userData] = await tx
        .select({
          id: usersTable.id,
          profileImageId: usersTable.profileImageId,
        })
        .from(usersTable)
        .where(eq(usersTable.id, salesman.userId));

      /* ================= AREAS ================= */

      const areas = await tx
        .select({ id: areasTable.id })
        .from(areasTable)
        .where(eq(areasTable.salesmanId, salesman.id));

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

      /* ================= COLLECT IMAGE IDS ================= */

      imageIds = [
        userData?.profileImageId,
        ...customers.map((c) => c.customerImageId),
        ...visits.map((v) => v.checkInImageId),
      ].filter(Boolean) as string[];

      imageIds = [...new Set(imageIds)];

      /* ================= DELETE DATA ================= */

      // Transactions (items auto cascade)
      if (visitIds.length) {
        await tx
          .delete(transactionsTable)
          .where(inArray(transactionsTable.visitId, visitIds));
      }

      // Visits
      if (visitIds.length) {
        await tx
          .delete(visitsTable)
          .where(inArray(visitsTable.id, visitIds));
      }

      // Customers
      if (customerIds.length) {
        await tx
          .delete(customersTable)
          .where(inArray(customersTable.id, customerIds));
      }

      // Areas
      if (areaIds.length) {
        await tx
          .delete(areasTable)
          .where(inArray(areasTable.id, areaIds));
      }

      // Salesman
      await tx
        .delete(salesmenTable)
        .where(eq(salesmenTable.id, salesman.id));

      // User
      await tx
        .delete(usersTable)
        .where(eq(usersTable.id, salesman.userId));
    });

    /* ================= DELETE IMAGES ================= */

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