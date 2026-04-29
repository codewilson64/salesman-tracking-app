import jwt from "jsonwebtoken";
export const generateToken = (userId, companyId, role) => {
    const token = jwt.sign({ userId, companyId, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
    return token;
};
//# sourceMappingURL=generateToken.js.map