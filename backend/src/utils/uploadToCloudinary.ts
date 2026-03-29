import cloudinary from '../config/cloudinary';
import { Readable } from 'stream';
import type { CloudinaryUploadResult } from '../types/cloudinary';

const uploadToCloudinary = (
  buffer: Buffer,
  folder: string = 'uploads'
): Promise<CloudinaryUploadResult> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: 'auto',
        // transformation: [{ width: 800, height: 800, crop: 'limit' }]
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return reject(error);
        }
        resolve(result as CloudinaryUploadResult);
      }
    );

    const readableStream = new Readable();
        readableStream.push(buffer);
        readableStream.push(null);
        readableStream.pipe(uploadStream);
  });
};

export default uploadToCloudinary;