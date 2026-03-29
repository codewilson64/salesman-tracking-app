import type { Request, Response } from "express";
import bcrypt from "bcrypt";

import { db } from "../index.js";
import { and, eq } from "drizzle-orm";
import { usersTable } from "../db/schemas/users.js";
import { salesmenTable } from "../db/schemas/salesmen.js";

export const createSalesmen = async (req: Request, res: Response) => {
  try {
    const { email, password, name, address, phone, profileImage, profileImageId } = req.body;

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

    const companyId = user.companyId;

    if (!email || !password || !name) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.transaction(async (tx) => {
      // create user WITH companyId
      const [user] = await tx
        .insert(usersTable)
        .values({
          email,
          password: hashedPassword,
          role: "salesman",
          companyId,
        })
        .returning();

      if (!user) throw new Error("User creation failed");

      // create salesman WITH companyId
      const [salesman] = await tx
        .insert(salesmenTable)
        .values({
          userId: user.id,
          name,
          address,
          phone,
          companyId,
          profileImage,
          profileImageId,
        })
        .returning();

      return { user, salesman };
    });

    return res.status(201).json({
      message: "Salesmen created successfully",
      data: result,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to create salesmen",
      error: error instanceof Error ? error.message : error
    });
  }
};

export const getAllSalesmen = async (req: Request, res: Response) => {
  try {
    const user = req.user as {
      userId: string;
      companyId: string;
      role: string;
    };

    const salesmen = await db
      .select({
        id: salesmenTable.id,
        name: salesmenTable.name,
        address: salesmenTable.address,
        phone: salesmenTable.phone,
        userId: usersTable.id,
        email: usersTable.email,
        role: usersTable.role,
      })
      .from(salesmenTable)
      .innerJoin(usersTable, eq(salesmenTable.userId, usersTable.id))
      .where(eq(salesmenTable.companyId, user.companyId)); 

    return res.status(200).json({
      message: "Salesmen fetched successfully",
      data: salesmen,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch salesmen",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const getSalesmenById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const user = req.user as {
      userId: string;
      companyId: string;
      role: string;
    };

    const salesmen = await db
      .select({
        id: salesmenTable.id,
        name: salesmenTable.name,
        address: salesmenTable.address,
        phone: salesmenTable.phone,
        email: usersTable.email,
        role: usersTable.role,
      })
      .from(salesmenTable)
      .innerJoin(usersTable, eq(salesmenTable.userId, usersTable.id)) 
      .where(
        and(
          eq(salesmenTable.id, id),
          eq(salesmenTable.companyId, user.companyId) 
        )
      );

    if (salesmen.length === 0) {
      return res.status(404).json({
        message: "Salesman not found",
      });
    }

    return res.status(200).json({
      message: "Salesman fetched successfully",
      data: salesmen[0],
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch salesman",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const updateSalesmen = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { name, address, phone } = req.body;

    const user = req.user as {
      userId: string;
      companyId: string;
      role: string;
    };

    const updatedSalesman = await db
      .update(salesmenTable)
      .set({
        name,
        address,
        phone,
      })
      .where(
        and(
          eq(salesmenTable.id, id),
          eq(salesmenTable.companyId, user.companyId)
        )
      )
      .returning();

    if (updatedSalesman.length === 0) {
      return res.status(404).json({
        message: "Salesman not found",
      });
    }

    return res.status(200).json({
      message: "Salesman updated successfully",
      data: updatedSalesman[0],
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to update salesman",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const deleteSalesmen = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const user = req.user as {
      userId: string;
      companyId: string;
      role: string;
    };

    const result = await db.transaction(async (tx) => {
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

      // Delete salesman first
      await tx
        .delete(salesmenTable)
        .where(eq(salesmenTable.id, id));

      // Delete related user
      await tx
        .delete(usersTable)
        .where(eq(usersTable.id, salesman.userId));

      return true;
    });

    return res.status(200).json({
      message: "Salesman deleted successfully",
    });

  } catch (error: any) {
    console.error(error);

    if (error.message === "NOT_FOUND") {
      return res.status(404).json({
        message: "Salesman not found",
      });
    }

    return res.status(500).json({
      message: "Failed to delete salesman",
      error: error instanceof Error ? error.message : error,
    });
  }
};