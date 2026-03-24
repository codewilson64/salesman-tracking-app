import type { Request, Response } from "express";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import validator from "validator";
import { generateToken } from "../utils/generateToken.js";
import { db } from "../index.js";
import { usersTable } from "../db/schemas/users.js";
import { companiesTable } from "../db/schemas/companies.js";

export const signup = async (req: Request, res: Response) => {
  const { email, password, companyName } = req.body;

  try {
    // Validate fields
    if (!email || !password || !companyName) {
      return res.status(400).json({
        error: "Email, password, and companyName are required",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Invalid email" });
    }

    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({ error: "Password is too weak" });
    }

    // Check email existence
    const emailExists = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (emailExists.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Transaction: create company + owner
    const result = await db.transaction(async (tx) => {
      // 1. Create company
      const [company] = await tx
        .insert(companiesTable)
        .values({
          name: companyName,
        })
        .returning();

      if (!company) throw new Error("Company creation failed");

      // 2. Create owner user
      const [user] = await tx
        .insert(usersTable)
        .values({
          email,
          password: hash,
          role: "owner", 
          companyId: company.id, 
        })
        .returning();

      if (!user) throw new Error("User creation failed");

      return { user, company };
    });

    const { user, company } = result;

    // Create JWT
    const accessToken = generateToken(user.id, user.companyId, user.role);

    return res.status(201).json({
      message: "Signup successful",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
      },
      company: {
        id: company.id,
        name: company.name,
      },
      accessToken,
    });

  } catch (error: any) {
    console.error("Error in signup controller:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Validate fields
    if (!email || !password) {
      return res.status(400).json({ error: "All fields must be filled" });
    }

    // Find user
    const result = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    const user = result[0];

    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Generate token
    const accessToken = generateToken(user.id, user.companyId, user.role);
    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,           
        companyId: user.companyId, 
      },
      accessToken,
    });

  } catch (error: any) {
    console.error("Login error:", error.message);
    return res.status(500).json({ error: "Server error" });
  }
};