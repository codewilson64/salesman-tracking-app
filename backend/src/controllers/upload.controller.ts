import { type Request, type Response } from 'express';
import uploadToCloudinary from '../utils/uploadToCloudinary';

export const uploadSingleImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    const result = await uploadToCloudinary(req.file.buffer, 'salesmen/profile');

    res.status(200).json({
      message: 'Image uploaded successfully',
      data: {
        url: result.secure_url,
        public_id: result.public_id, // for update/delete image
      },
    });
  } catch (error) {
    console.error('Upload error:', error);

    return res.status(500).json({
      message: 'Upload failed',
      error: error instanceof Error ? error.message : error,
    });
  }
};