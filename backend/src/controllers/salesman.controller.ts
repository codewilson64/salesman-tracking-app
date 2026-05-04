import type { Request, Response } from "express";
import bcrypt from "bcrypt";

import { db } from "../index.js";
import { and, eq } from "drizzle-orm";
import { usersTable } from "../db/schemas/users.js";

export const createSalesmen = async (req: Request, res: Response) => {
  try {
    const { email, password, name, address, phone, profileImage, profileImageId } = req.body;

    const user = req.user as {
      userId: string;
      companyId: string;
      role: string;
    };

    if (!user?.companyId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!email || !password || !name) {
      return res.status(400).json({
        message: "Email, password, and name are required",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [newUser] = await db
      .insert(usersTable)
      .values({
        email,
        password: hashedPassword,
        role: "salesman",
        companyId: user.companyId,
        name,
        address,
        phone,
        profileImage,
        profileImageId,
      })
      .returning();

    return res.status(201).json({
      message: "Salesman created successfully",
      data: newUser,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to create salesman",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const getAllSalesmen = async (req: Request, res: Response) => {
  try {
    const user = req.user as {
      companyId: string;
    };

    const salesmen = await db
      .select()
      .from(usersTable)
      .where(
        and(
          eq(usersTable.companyId, user.companyId),
          eq(usersTable.role, "salesman")
        )
      );

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
      companyId: string;
    };

    const [salesman] = await db
      .select()
      .from(usersTable)
      .where(
        and(
          eq(usersTable.id, id),
          eq(usersTable.companyId, user.companyId),
          eq(usersTable.role, "salesman")
        )
      );

    if (!salesman) {
      return res.status(404).json({
        message: "Salesman not found",
      });
    }

    return res.status(200).json({
      message: "Salesman fetched successfully",
      data: salesman,
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
    const { name, address, phone, profileImage, profileImageId } = req.body;

    const user = req.user as {
      companyId: string;
    };

    const [updatedUser] = await db
      .update(usersTable)
      .set({
        name,
        address,
        phone,
        profileImage,
        profileImageId,
      })
      .where(
        and(
          eq(usersTable.id, id),
          eq(usersTable.companyId, user.companyId),
          eq(usersTable.role, "salesman")
        )
      )
      .returning();

    if (!updatedUser) {
      return res.status(404).json({
        message: "Salesman not found",
      });
    }

    return res.status(200).json({
      message: "Salesman updated successfully",
      data: updatedUser,
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
      companyId: string;
    };

    const deleted = await db
      .delete(usersTable)
      .where(
        and(
          eq(usersTable.id, id),
          eq(usersTable.companyId, user.companyId),
          eq(usersTable.role, "salesman")
        )
      )
      .returning();

    if (deleted.length === 0) {
      return res.status(404).json({
        message: "Salesman not found",
      });
    }

    return res.status(200).json({
      message: "Salesman deleted successfully",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to delete salesman",
      error: error instanceof Error ? error.message : error,
    });
  }
};