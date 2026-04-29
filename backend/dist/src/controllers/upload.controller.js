import {} from 'express';
import uploadToCloudinary from '../utils/uploadToCloudinary';
import { v2 as cloudinary } from "cloudinary";
export const uploadSingleImage = async (req, res) => {
    try {
        const user = req.user;
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        const baseFolder = req.query.folder || "general";
        const folder = `companies/${user.companyId}/${baseFolder}`;
        const result = await uploadToCloudinary(req.file.buffer, folder);
        res.status(200).json({
            message: 'Image uploaded successfully',
            data: {
                url: result.secure_url,
                public_id: result.public_id,
            },
        });
    }
    catch (error) {
        console.error('Upload error:', error);
        return res.status(500).json({
            message: 'Upload failed',
            error: error instanceof Error ? error.message : error,
        });
    }
};
export const deleteSingleImage = async (req, res) => {
    try {
        const publicId = req.query.publicId;
        if (!publicId) {
            return res.status(400).json({
                message: "No publicId provided",
            });
        }
        const result = await cloudinary.uploader.destroy(publicId);
        return res.status(200).json({
            message: "Image deleted successfully",
            data: result,
        });
    }
    catch (error) {
        console.error("Delete error:", error);
        return res.status(500).json({
            message: "Delete failed",
            error: error instanceof Error ? error.message : error,
        });
    }
};
//# sourceMappingURL=upload.controller.js.map