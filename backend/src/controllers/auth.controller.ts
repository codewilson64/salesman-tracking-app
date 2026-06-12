import type { Request, Response } from "express";
import { eq } from "drizzle-orm";

import jwt, { type JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import crypto from "crypto";
import { Resend } from "resend";

import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";
import { db } from "../index.js";
import { usersTable } from "../db/schemas/users.js";
import { companiesTable } from "../db/schemas/companies.js";

const resend = new Resend(process.env.RESEND_API_KEY);

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
          subscriptionStatus: "pending",
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

    return res.status(201).json({
      message: "Thanks for signing up! Your company account has been created and is waiting for activation.",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
        profileImage: user.profileImage,       
        profileImageId: user.profileImageId,   
      },
      company: {
        id: company.id,
        name: company.name,
        subscriptionStatus: company.subscriptionStatus,
      },
    });

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in signup controller:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: "All fields must be filled" });
    }

    const result = await db
      .select({
        user: usersTable,
        company: companiesTable
      })
      .from(usersTable)
      .leftJoin(companiesTable, eq(usersTable.companyId, companiesTable.id))
      .where(eq(usersTable.email, email));

    const row = result[0];

    if (!row) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const user = row.user;
    const company = row.company;

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    if (company?.subscriptionStatus !== "active") {
      return res.status(403).json({ error: "Your account is currently inactive. Please contact your administrator." });
    }

    const payload = {
      userId: user.id,
      companyId: user.companyId,
      role: user.role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,           
        companyId: user.companyId, 
        profileImage: user.profileImage,       
        profileImageId: user.profileImageId, 
      },
      accessToken,
      refreshToken
    });

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Login error:", error.message);
      return res.status(500).json({ error: "Server error" });
    }
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = req.user.userId;

    const result = await db
      .select({
        id: usersTable.id,
        email: usersTable.email,
        role: usersTable.role,
        companyId: usersTable.companyId,
        profileImage: usersTable.profileImage,
        profileImageId: usersTable.profileImageId,
        name: usersTable.name,
        address: usersTable.address,
        phone: usersTable.phone,
      
        companyName: companiesTable.name,
      })
      .from(usersTable)
      .leftJoin(companiesTable, eq(usersTable.companyId, companiesTable.id))
      .where(eq(usersTable.id, userId));

    const user = result[0];

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      message: "User data fetched successfully",
      data: user,
    });
    
  } catch (error) {
    console.error("GetMe error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const result = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    const user = result[0];

    if (!user) {
      return res.json({ message: "If email exists, reset link sent" });
    }

    // generate token
    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    // save to DB
    await db
      .update(usersTable)
      .set({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: expires,
      })
      .where(eq(usersTable.id, user.id));

    // create reset link
    const resetLink = `${process.env.APP_URL}/reset-password?token=${resetToken}`;

    // send email
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Reset your password",
      html: `
        <p>You requested a password reset</p>
        <a href="${resetLink}">Reset Password</a>
        <p>This link expires in 15 minutes</p>
      `,
    });

    return res.json({ message: "Reset email sent" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token, password } = req.body;

  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const result = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.resetPasswordToken, hashedToken));

    const user = result[0];

    if (!user || !user.resetPasswordExpires) {
      return res.status(400).json({ error: "Invalid token" });
    }

    if (new Date(user.resetPasswordExpires) < new Date()) {
      return res.status(400).json({ error: "Token expired" });
    }

    // hash new password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    await db
      .update(usersTable)
      .set({
        password: hash,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      })
      .where(eq(usersTable.id, user.id));

    return res.json({ 
      message: "Password reset successful" 
    });
  } 
  catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const refreshAccessToken = async ( req: Request, res: Response ) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ error: "No refresh token" });
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET as string
    ) as JwtPayload;

    const newAccessToken = generateAccessToken({
      userId: decoded.userId,
      companyId: decoded.companyId,
      role: decoded.role,
    });

    return res.status(200).json({
      accessToken: newAccessToken,
    });

  } catch {
    return res.status(401).json({
      error: "Invalid refresh token",
    });
  }
};