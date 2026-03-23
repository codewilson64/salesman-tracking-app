import { type Request, type Response } from "express";
import { eq, and } from "drizzle-orm";
import { db } from "..";
import { salesmenTable } from "../db/schemas";
import { areasTable } from "../db/schemas/areas";

export const createArea = async (req: Request, res: Response) => {
  try {
    const { name, city, day, weeks, salesmanId } = req.body;

    const user = req.user as {
      userId: string;
      companyId: string;
      role: string;
    };

    if (!user?.companyId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const companyId = user.companyId;

    // basic validation
    if (!name || !city || !day || !weeks || !salesmanId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!Array.isArray(weeks) || weeks.length === 0) {
      return res.status(400).json({ message: "Weeks must be selected" });
    }

    // validate day
    const validDays = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];

    if (!validDays.includes(day)) {
      return res.status(400).json({ message: "Invalid day" });
    }

    // validate weeks range
    if (weeks.some((w: number) => w < 1 || w > 5)) {
      return res.status(400).json({ message: "Invalid weeks" });
    }

    const [salesman] = await db
      .select()
      .from(salesmenTable)
      .where(
        and(
          eq(salesmenTable.id, salesmanId),
          eq(salesmenTable.companyId, companyId)
        )
      );

    if (!salesman) {
      return res.status(400).json({ message: "Invalid salesman" });
    }

    // insert
    const [area] = await db
      .insert(areasTable)
      .values({
        name,
        city,
        day,
        weeks,
        salesmanId,
        companyId,
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

    if (!user?.companyId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const areas = await db
      .select({
        id: areasTable.id,
        areaName: areasTable.name,
        day: areasTable.day,
        salesmanId: salesmenTable.id,
        salesmanName: salesmenTable.name,
      })
      .from(areasTable)
      .innerJoin(salesmenTable, eq(areasTable.salesmanId, salesmenTable.id))
      .where(eq(areasTable.companyId, user.companyId));

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
      userId: string;
      companyId: string;
      role: string;
    };

    if (!user?.companyId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const areas = await db
      .select({
        id: areasTable.id,
        areaName: areasTable.name,
        city: areasTable.city,
        day: areasTable.day,
        weeks: areasTable.weeks,
        salesmanId: salesmenTable.id,
        salesmanName: salesmenTable.name,
      })
      .from(areasTable)
      .innerJoin(salesmenTable, eq(areasTable.salesmanId, salesmenTable.id))
      .where(
        and(
          eq(areasTable.id, id),
          eq(areasTable.companyId, user.companyId)
        )
      );

    if (areas.length === 0) {
      return res.status(404).json({
        message: "Area not found",
      });
    }

    return res.status(200).json({
      message: "Area fetched successfully",
      data: areas[0],
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
      userId: string;
      companyId: string;
      role: string;
    };

    if (!user?.companyId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // optional validations (same logic as create)
    const validDays = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];

    if (day && !validDays.includes(day)) {
      return res.status(400).json({ message: "Invalid day" });
    }

    if (weeks && (!Array.isArray(weeks) || weeks.some((w: number) => w < 1 || w > 5))) {
      return res.status(400).json({ message: "Invalid weeks" });
    }

    // if updating salesmanId → validate it belongs to company
    if (salesmanId) {
      const [salesman] = await db
        .select()
        .from(salesmenTable)
        .where(
          and(
            eq(salesmenTable.id, salesmanId),
            eq(salesmenTable.companyId, user.companyId)
          )
        );

      if (!salesman) {
        return res.status(400).json({ message: "Invalid salesman" });
      }
    }

    const updatedArea = await db
      .update(areasTable)
      .set({
        name,
        city,
        day,
        weeks,
        salesmanId,
      })
      .where(
        and(
          eq(areasTable.id, id),
          eq(areasTable.companyId, user.companyId)
        )
      )
      .returning();

    if (updatedArea.length === 0) {
      return res.status(404).json({
        message: "Area not found",
      });
    }

    return res.status(200).json({
      message: "Area updated successfully",
      data: updatedArea[0],
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

    const result = await db.transaction(async (tx) => {
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

      // delete area
      await tx
        .delete(areasTable)
        .where(eq(areasTable.id, id));

      return true;
    });

    return res.status(200).json({
      message: "Area deleted successfully",
    });

  } catch (error: any) {
    console.error(error);

    if (error.message === "NOT_FOUND") {
      return res.status(404).json({
        message: "Area not found",
      });
    }

    return res.status(500).json({
      message: "Failed to delete area",
      error: error instanceof Error ? error.message : error,
    });
  }
};