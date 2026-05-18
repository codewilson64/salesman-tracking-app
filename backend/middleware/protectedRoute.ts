import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import { db } from "../src/index.js";
import { eq } from "drizzle-orm";
import { companiesTable } from "../src/db/schemas/companies.js";

type JwtUserPayload = {
  userId: string;
  companyId: string;
  role: string;
};

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Invalid token format" });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  try {
    const decoded = jwt.verify(token, secret) as JwtUserPayload;

    const company = await db.query.companiesTable.findFirst({
      where: eq(
        companiesTable.id,
        decoded.companyId
      )
    });

  if (company?.subscriptionStatus !== "active") {
    return res.status(403).json({
      message: "Your account is currently inactive. Please contact your administrator."
    });
  }

    req.user = decoded; 
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};