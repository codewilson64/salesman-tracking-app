import jwt from "jsonwebtoken";

export const generateToken = (userId: string, companyId: string, role: string,) => {
  const token = jwt.sign({ userId, companyId, role }, process.env.JWT_SECRET as string, { expiresIn: "7d" });

  return token;
};