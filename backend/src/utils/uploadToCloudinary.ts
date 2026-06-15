import cloudinary from '../config/cloudinary.js';
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
        resource_type: "image",
        transformation: [
          {
            width: 1200,
            height: 1200,
            crop: "limit",
            quality: "auto:good",
            fetch_format: "auto",
          },
        ],
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