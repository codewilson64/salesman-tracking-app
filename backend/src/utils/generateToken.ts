import jwt from "jsonwebtoken";

type TokenPayload = {
  userId: string;
  companyId: string;
  role: string;
};

export const generateAccessToken = (payload: TokenPayload) => {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" }
  );
};

export const generateRefreshToken = (payload: TokenPayload) => {
  return jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: "30d" }
  );
};