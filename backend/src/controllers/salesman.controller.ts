import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { salesmenTable, usersTable } from "../db/schema.js";
import { db } from "../index.js";
import { eq } from "drizzle-orm";


export const createSalesmen = async (req: Request, res: Response) => {
  try {
    const { username, email, password, name, address, phone } = req.body;

    if (!username || !email || !password || !name) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.transaction(async (tx) => {
      // create user
      const [user] = await tx
        .insert(usersTable)
        .values({
          username,
          email,
          password: hashedPassword,
          role: "salesman",
        })
        .returning();

      if (!user) throw new Error("User creation failed");

      // create salesman profile
      const [salesman] = await tx
        .insert(salesmenTable)
        .values({
          userId: user.id,
          name,
          address,
          phone,
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
    const salesmen = await db
      .select({
        id: salesmenTable.id,
        name: salesmenTable.name,
        address: salesmenTable.address,
        phone: salesmenTable.phone,
        userId: usersTable.id,
        username: usersTable.username,
        email: usersTable.email,
        role: usersTable.role,
      })
      .from(salesmenTable)
      .leftJoin(usersTable, eq(salesmenTable.userId, usersTable.id));

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

    const salesman = await db
      .select({
        id: salesmenTable.id,
        name: salesmenTable.name,
        address: salesmenTable.address,
        phone: salesmenTable.phone,
        username: usersTable.username,
        email: usersTable.email,
        role: usersTable.role,
      })
      .from(salesmenTable)
      .leftJoin(usersTable, eq(salesmenTable.userId, usersTable.id))
      .where(eq(salesmenTable.id, id));

    if (salesman.length === 0) {
      return res.status(404).json({
        message: "Salesman not found",
      });
    }

    return res.status(200).json({
      message: "Salesman fetched successfully",
      data: salesman[0],
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch salesman",
      error: error instanceof Error ? error.message : error
    });
  }
};

export const updateSalesmen = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { name, address, phone } = req.body;

    const updatedSalesman = await db
      .update(salesmenTable)
      .set({
        name,
        address,
        phone,
      })
      .where(eq(salesmenTable.id, id))
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
      error: error instanceof Error ? error.message : error
    });
  }
};

export const deleteSalesmen = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const [salesman] = await db
      .select()
      .from(salesmenTable)
      .where(eq(salesmenTable.id, id));

   
    if (!salesman) {
      return res.status(404).json({
        message: "Salesman not found",
    });
    }

    await db.delete(salesmenTable).where(eq(salesmenTable.id, id));
    await db.delete(usersTable).where(eq(usersTable.id, salesman.userId));

    return res.status(200).json({
      message: "Salesman deleted successfully",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to delete salesman",
      error: error instanceof Error ? error.message : error
    });
  }
};