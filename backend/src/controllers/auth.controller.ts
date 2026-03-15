import type { Request, Response } from "express";
import db from "../index.js";
import { usersTable } from "../db/schema.js";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import validator from "validator";
import { generateToken } from "../utils/generateToken.js";

export const signup = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  try {
    // Validate fields
    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields must be filled" });
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

    // Check username existence
    const usernameExists = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.username, username));

    if (usernameExists.length > 0) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Insert user
    const newUser = await db
      .insert(usersTable)
      .values({
        username,
        email,
        password: hash,
      })
      .returning();

    const user = newUser[0];

    // Create JWT
    if (user) {
      const accessToken = generateToken(user.id);
      return res.status(201).json({
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        },
        accessToken
      });
    }

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

    if (user) {
      const accessToken = generateToken(user.id);
      return res.status(200).json({
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        },
        accessToken
      });
    }

  } catch (error: any) {
    console.error("Login error:", error.message);
    return res.status(500).json({ error: "Server error" });
  }
};