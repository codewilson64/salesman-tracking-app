import validator from "validator";
import bcrypt from "bcrypt";
import { usersTable } from "../db/schemas";
import { db } from "..";
import { eq } from "drizzle-orm";
export const updateProfile = async (req, res) => {
    const userId = req.user?.userId;
    const { email, profileImage, profileImageId } = req.body;
    try {
        const [updatedUser] = await db
            .update(usersTable)
            .set({
            email,
            profileImage,
            profileImageId,
        })
            .where(eq(usersTable.id, userId))
            .returning();
        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.status(200).json({
            message: "Profile updated successfully",
            data: updatedUser
        });
    }
    catch (error) {
        return res.status(500).json({ error: "Server error" });
    }
};
export const updatePassword = async (req, res) => {
    try {
        const user = req.user;
        const { currentPassword, newPassword } = req.body;
        if (!user?.userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                message: "Current password and new password are required",
            });
        }
        const [existingUser] = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.id, user.userId));
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }
        const isMatch = await bcrypt.compare(currentPassword, existingUser.password);
        if (!isMatch) {
            return res.status(400).json({
                message: "Current password is incorrect",
            });
        }
        if (!validator.isStrongPassword(newPassword)) {
            return res.status(400).json({
                message: "Password is too weak",
            });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        await db
            .update(usersTable)
            .set({ password: hashedPassword })
            .where(eq(usersTable.id, user.userId));
        return res.status(200).json({
            message: "Password changed successfully",
        });
    }
    catch (error) {
        console.error("Change password error:", error);
        return res.status(500).json({
            message: "Failed to change password",
            error: error instanceof Error ? error.message : error,
        });
    }
};
//# sourceMappingURL=profile.controller.js.map