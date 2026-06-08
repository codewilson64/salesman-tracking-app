import type { Request, Response } from "express";
import { and, eq, ne } from "drizzle-orm";
import { db } from "../index.js";
import { companyRegistrationsTable, usersTable } from "../db/schemas";

export const registerCompany = async (req: Request, res: Response) => {
  const {
    fullName,
    email,
    companyName,
    businessField,
    address,
    country,
    phoneNumber,
    plan,
  } = req.body;

  try {
    if (
      !fullName ||
      !email ||
      !companyName ||
      !businessField ||
      !address ||
      !country ||
      !phoneNumber ||
      !plan
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check existing user
    const existingUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (existingUser.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Check existing registration
    const existingRegistration = await db
      .select()
      .from(companyRegistrationsTable)
      .where(eq(companyRegistrationsTable.email, email));

    if (existingRegistration.length > 0) {
      return res.status(400).json({ error: "Registration already exists" });
    }

    // Create registration
    const [registration] = await db
      .insert(companyRegistrationsTable)
      .values({
        fullName,
        email,
        companyName,
        businessField,
        address,
        country,
        phoneNumber,
        plan,
        status: "pending_payment",
      })
      .returning();

    if(!registration) {
      throw new Error("Registration not found")
    }

    return res.status(201).json({
      message: "Registration submitted successfully",
      registrationId: registration.id,
    });
  } 
  catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in registerCompany:", error.message);

      return res.status(500).json({
        error: error.message,
      });
    }

    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getCompanyRegistration = async (req: Request,res: Response) => {
  const id = req.params.id as string;

  try {
    const [registration] = await db
      .select({
        id: companyRegistrationsTable.id,
        fullName: companyRegistrationsTable.fullName,
        email: companyRegistrationsTable.email,
        companyName: companyRegistrationsTable.companyName,
        businessField: companyRegistrationsTable.businessField,
        phoneNumber: companyRegistrationsTable.phoneNumber,
        plan: companyRegistrationsTable.plan,
        status: companyRegistrationsTable.status,
        createdAt: companyRegistrationsTable.createdAt,
      })
      .from(companyRegistrationsTable)
      .where(eq(companyRegistrationsTable.id, id));

    if (!registration) {
      return res.status(404).json({ error: "Registration not found" });
    }

    return res.status(200).json(registration);
  } 
  catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in getCompanyRegistration:", error.message);

      return res.status(500).json({ error: error.message });
    }

    return res.status(500).json({ error: "Internal server error" });
  }
};

export const updateCompanyRegistration = async (req: Request, res: Response) => {
  const id = req.params.id as string;

  const {
    fullName,
    email,
    companyName,
    businessField,
    address,
    country,
    phoneNumber,
    plan,
  } = req.body;

  try {
    const existingRegistration = await db
      .select()
      .from(companyRegistrationsTable)
      .where(eq(companyRegistrationsTable.id, id));

    if (existingRegistration.length === 0) {
      return res.status(404).json({ error: "Registration not found" });
    }

    const emailConflict = await db
      .select()
      .from(companyRegistrationsTable)
      .where(
        and(
          eq(companyRegistrationsTable.email, email),
          ne(companyRegistrationsTable.id, id)
        )
      );

    if (emailConflict.length > 0) {
      return res.status(400).json({ error: "Email already used" });
    }

    const [updated] = await db
      .update(companyRegistrationsTable)
      .set({
        fullName,
        email,
        companyName,
        businessField,
        address,
        country,
        phoneNumber,
        plan,
      })
      .where(eq(companyRegistrationsTable.id, id))
      .returning();

    if(!updated) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    return res.status(200).json({
      message: "Registration updated successfully",
      registrationId: updated.id,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(500).json({ error: "Internal server error" });
  }
};