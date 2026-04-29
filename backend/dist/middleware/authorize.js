import {} from "express";
export const authorize = (...roles) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user || !roles.includes(user.role)) {
            return res.status(403).json({
                message: "Forbidden",
            });
        }
        next();
    };
};
//# sourceMappingURL=authorize.js.map