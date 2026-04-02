import type { Request, Response } from "express";
import { areasTable, customersTable, salesmenTable, visitsTable } from "../db/schemas";
import { db } from "..";
import { and, eq, isNull } from "drizzle-orm";

export const createVisit = async (req: Request, res: Response) => {
  try {
    const { areaId, customerId, checkInImage, checkInImageId } = req.body;

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
    if (!areaId || !customerId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // validate area belongs to company
    const [area] = await db
      .select()
      .from(areasTable)
      .where(
        and(
          eq(areasTable.id, areaId),
          eq(areasTable.companyId, companyId)
        )
      );

    if (!area) {
      return res.status(400).json({
        message: "Invalid area",
      });
    }

    // validate customer belongs to company + area
    const [customer] = await db
      .select()
      .from(customersTable)
      .where(
        and(
          eq(customersTable.id, customerId),
          eq(customersTable.companyId, companyId),
          eq(customersTable.areaId, areaId)
        )
      );

    if (!customer) {
      return res.status(400).json({
        message: "Invalid customer",
      });
    }

    // OPTIONAL: prevent multiple active visits
    const [activeVisit] = await db
      .select()
      .from(visitsTable)
      .where(
        and(
          eq(visitsTable.salesmanId, user.userId),
          isNull(visitsTable.checkOutAt)
        )
      );

    if (activeVisit) {
      return res.status(400).json({
        message: "You still have an active visit. Please check-out first.",
      });
    }

    // insert visit (check-in)
    const [visit] = await db
      .insert(visitsTable)
      .values({
        companyId,
        salesmanId: user.userId,
        areaId,
        customerId,
        status: "check-in",
        checkInImage,
        checkInImageId,
      })
      .returning();

    return res.status(201).json({
      message: "Check-in successful",
      data: {
        visit,
        customer, // for autofill on frontend
      },
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to create visit",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const checkoutVisit = async (req: Request, res: Response) => {
  try {
    const { result, notes } = req.body;

    const user = req.user as {
      userId: string;
      companyId: string;
      role: string;
    };

    if (!user?.companyId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // validation
    const validResults = ["new order", "follow-up", "shop closed"];

    if (!result || !validResults.includes(result)) {
      return res.status(400).json({
        message: "Invalid visit result",
      });
    }

    if(!notes) {  
      return res.status(400).json({
        message: "Please provide notes",
      })
    }

    // find active visit
    const [activeVisit] = await db
      .select()
      .from(visitsTable)
      .where(
        and(
          eq(visitsTable.salesmanId, user.userId),
          eq(visitsTable.status, "check-in")
        )
      );

    if (!activeVisit) {
      return res.status(400).json({
        message: "No active visit found",
      });
    }

    // update visit (checkout)
    const [updatedVisit] = await db
      .update(visitsTable)
      .set({
        visitResult: result,
        notes: notes,
        checkOutAt: new Date(),
        status: "check-out",
      })
      .where(eq(visitsTable.id, activeVisit.id))
      .returning();

    return res.status(200).json({
      message: "Check-out successful",
      data: updatedVisit,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to check-out visit",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const getAllVisits = async (req: Request, res: Response) => {
  try {
    const user = req.user as {
      userId: string;
      companyId: string;
      role: string;
    };

    if (!user?.companyId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    let condition;

    /* ================= CONDITION ================= */

    if (user.role === "salesman") {
      // 🔥 map userId → salesmanId
      const [salesman] = await db
        .select()
        .from(salesmenTable)
        .where(eq(salesmenTable.userId, user.userId));

      if (!salesman) {
        return res.status(400).json({ message: "Salesman not found" });
      }

      condition = and(
        eq(visitsTable.companyId, user.companyId),
        eq(visitsTable.salesmanId, user.userId) // ✅ direct filter
      );
    } else {
      condition = eq(visitsTable.companyId, user.companyId);
    }

    /* ================= QUERY ================= */

    const visits = await db
      .select({
        // visit info
        id: visitsTable.id,
        checkInAt: visitsTable.checkInAt,
        checkOutAt: visitsTable.checkOutAt,
        visitResult: visitsTable.visitResult,
        notes: visitsTable.notes,
        createdAt: visitsTable.createdAt,

        // customer info
        customerId: customersTable.id,
        customerName: customersTable.customerName,
        shopName: customersTable.shopName,
        address: customersTable.address,

        // area info
        areaId: areasTable.id,
        areaName: areasTable.name,
        city: areasTable.city,

        // salesman info
        salesmanId: salesmenTable.id,
        salesmanName: salesmenTable.name,
        salesmanImage: salesmenTable.profileImage,
        salesmanImageId: salesmenTable.profileImageId,
      })
      .from(visitsTable)
      .leftJoin(customersTable, eq(visitsTable.customerId, customersTable.id))
      .leftJoin(areasTable, eq(visitsTable.areaId, areasTable.id))
      .leftJoin(salesmenTable, eq(visitsTable.salesmanId, salesmenTable.userId))
      .where(condition);

    return res.status(200).json({
      message: "Visits fetched successfully",
      data: visits,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch visits",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const getVisitById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const user = req.user as {
      userId: string;
      companyId: string;
      role: string;
    };

    if (!user?.companyId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const visit = await db
      .select({
        // visit info
        id: visitsTable.id,
        checkInAt: visitsTable.checkInAt,
        checkOutAt: visitsTable.checkOutAt,
        status: visitsTable.status,
        visitResult: visitsTable.visitResult,
        notes: visitsTable.notes,
        checkInImage: visitsTable.checkInImage,
        checkInImageId: visitsTable.checkInImageId,

        // customer info
        customerId: customersTable.id,
        customerName: customersTable.customerName,
        shopName: customersTable.shopName,
        address: customersTable.address,
        latitude: customersTable.latitude,
        longitude: customersTable.longitude,

        // area info
        areaId: areasTable.id,
        areaName: areasTable.name,
        city: areasTable.city,
      })
      .from(visitsTable)
      .leftJoin(customersTable, eq(visitsTable.customerId, customersTable.id))
      .leftJoin(areasTable, eq(visitsTable.areaId, areasTable.id))
      .where(
        and(
          eq(visitsTable.id, id),
          eq(visitsTable.companyId, user.companyId)
        )
      )
      .limit(1);

    if (!visit.length) {
      return res.status(404).json({
        message: "Visit not found",
      });
    }

    const data = visit[0]!;

    // compute duration (in seconds)
    let duration = null;

    if (data.checkInAt && data.checkOutAt) {
      const checkIn = new Date(data.checkInAt).getTime();
      const checkOut = new Date(data.checkOutAt).getTime();

      duration = Math.floor((checkOut - checkIn) / 1000); // seconds
    }

    return res.status(200).json({
      message: "Visit fetched successfully",
      data: {
        ...data,
        duration, // 👈 add this
      },
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch visit",
      error: error instanceof Error ? error.message : error,
    });
  }
};