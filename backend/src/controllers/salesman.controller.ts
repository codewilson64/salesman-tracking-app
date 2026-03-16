import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { salesmenTable, usersTable } from "../db/schema.js";
import { db } from "../index.js";

export const createSalesman = async (req: Request, res: Response) => {
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
      message: "Salesman created successfully",
      data: result,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
    message: "Failed to create salesman",
    error: error instanceof Error ? error.message : error
    });
  }
};