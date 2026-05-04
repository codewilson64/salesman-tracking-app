import { type Request, type Response } from "express";
import { eq, and } from "drizzle-orm";
import { db } from "../index.js";

import { usersTable } from "../db/schemas/users.js";
import { areasTable } from "../db/schemas/areas.js";
import { customersTable } from "../db/schemas/customers.js";

export const createArea = async (req: Request, res: Response) => {
  try {
    const { name, city, day, weeks, salesmanId } = req.body;

    const user = req.user as {
      companyId: string;
    };

    if (!user?.companyId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!name || !city || !day || !weeks || !salesmanId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const validDays = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];

    if (!validDays.includes(day)) {
      return res.status(400).json({ message: "Invalid day" });
    }

    if (!Array.isArray(weeks) || weeks.some((w: number) => w < 1 || w > 5)) {
      return res.status(400).json({ message: "Invalid weeks" });
    }

    const [salesman] = await db
      .select()
      .from(usersTable)
      .where(
        and(
          eq(usersTable.id, salesmanId),
          eq(usersTable.companyId, user.companyId),
        )
      );

    if (!salesman) {
      return res.status(400).json({ message: "Invalid salesman" });
    }

    const [area] = await db
      .insert(areasTable)
      .values({
        name,
        city,
        day,
        weeks,
        salesmanId,
        companyId: user.companyId,
      })
      .returning();

    return res.status(201).json({
      message: "Area created successfully",
      data: area,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to create area",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const getAllAreas = async (req: Request, res: Response) => {
  try {
    const user = req.user as {
      userId: string;
      companyId: string;
      role: string;
    };

    let condition;

    if (user.role === "salesman") {
      condition = and(
        eq(areasTable.companyId, user.companyId),
        eq(areasTable.salesmanId, user.userId)
      );
    } else {
      condition = eq(areasTable.companyId, user.companyId);
    }

    const areas = await db
      .select({
        id: areasTable.id,
        areaName: areasTable.name,
        day: areasTable.day,

        salesmanId: usersTable.id,
        salesmanName: usersTable.name,
        salesmanImage: usersTable.profileImage,
      })
      .from(areasTable)
      .leftJoin(usersTable, eq(areasTable.salesmanId, usersTable.id))
      .where(condition);

    return res.status(200).json({
      message: "Areas fetched successfully",
      data: areas,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to fetch areas",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const getAreaById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const user = req.user as {
      companyId: string;
    };

    const [area] = await db
      .select({
        id: areasTable.id,
        areaName: areasTable.name,
        city: areasTable.city,
        day: areasTable.day,
        weeks: areasTable.weeks,

        salesmanId: usersTable.id,
        salesmanName: usersTable.name,
      })
      .from(areasTable)
      .leftJoin(usersTable, eq(areasTable.salesmanId, usersTable.id))
      .where(
        and(
          eq(areasTable.id, id),
          eq(areasTable.companyId, user.companyId)
        )
      );

    if (!area) {
      return res.status(404).json({ message: "Area not found" });
    }

    return res.status(200).json({
      message: "Area fetched successfully",
      data: area,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to fetch area",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const updateArea = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { name, city, day, weeks, salesmanId } = req.body;

    const user = req.user as {
      companyId: string;
    };

    const validDays = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];

    if (day && !validDays.includes(day)) {
      return res.status(400).json({ message: "Invalid day" });
    }

    if (weeks && (!Array.isArray(weeks) || weeks.some((w: number) => w < 1 || w > 5))) {
      return res.status(400).json({ message: "Invalid weeks" });
    }

    if (salesmanId) {
      const [salesman] = await db
        .select()
        .from(usersTable)
        .where(
          and(
            eq(usersTable.id, salesmanId),
            eq(usersTable.companyId, user.companyId),
            eq(usersTable.role, "salesman")
          )
        );

      if (!salesman) {
        return res.status(400).json({ message: "Invalid salesman" });
      }
    }

    const [updated] = await db
      .update(areasTable)
      .set({ name, city, day, weeks, salesmanId })
      .where(
        and(
          eq(areasTable.id, id),
          eq(areasTable.companyId, user.companyId)
        )
      )
      .returning();

    if (!updated) {
      return res.status(404).json({ message: "Area not found" });
    }

    return res.status(200).json({
      message: "Area updated successfully",
      data: updated,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to update area",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const deleteArea = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const user = req.user as {
      userId: string;
      companyId: string;
      role: string;
    };

    await db.transaction(async (tx) => {
      // 1. Check area exists & belongs to company
      const [area] = await tx
        .select()
        .from(areasTable)
        .where(
          and(
            eq(areasTable.id, id),
            eq(areasTable.companyId, user.companyId)
          )
        );

      if (!area) {
        throw new Error("NOT_FOUND");
      }

      // 2. Check if area is used by customers
      const [customer] = await tx
        .select()
        .from(customersTable)
        .where(eq(customersTable.areaId, id));

      if (customer) {
        throw new Error("AREA_IN_USE");
      }

      // 3. Safe to delete
      await tx
        .delete(areasTable)
        .where(eq(areasTable.id, id));
    });

    return res.status(200).json({
      message: "Area deleted successfully",
    });

  } catch (error: unknown) {
    console.error(error);

    if (error instanceof Error) {
      if (error.message === "NOT_FOUND") {
        return res.status(404).json({
          message: "Area not found",
        });
      }

      if (error.message === "AREA_IN_USE") {
        return res.status(400).json({
          message: "Cannot delete area because it still has customers",
        });
      }

      return res.status(500).json({
        message: "Failed to delete area",
        error: error.message,
      });
    }

    return res.status(500).json({
      message: "Failed to delete area",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const getCustomersByArea = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const user = req.user as {
      companyId: string;
    };

    const customers = await db
      .select({
        id: customersTable.id,
        customerName: customersTable.customerName,
        shopName: customersTable.shopName,
        address: customersTable.address,
        latitude: customersTable.latitude,
        longitude: customersTable.longitude,
        customerImage: customersTable.customerImage,
        customerImageId: customersTable.customerImageId,

        areaName: areasTable.name,
        city: areasTable.city,

        salesmanId: usersTable.id,
        salesmanName: usersTable.name,
      })
      .from(customersTable)
      .leftJoin(areasTable, eq(customersTable.areaId, areasTable.id))
      .leftJoin(usersTable, eq(areasTable.salesmanId, usersTable.id))
      .where(
        and(
          eq(customersTable.companyId, user.companyId),
          eq(customersTable.areaId, id)
        )
      );

    return res.status(200).json({
      message: "Customers fetched successfully",
      data: customers,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to fetch customers",
      error: error instanceof Error ? error.message : error,
    });
  }
};