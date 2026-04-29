import cloudinary from '../config/cloudinary';
import { Readable } from 'stream';
const uploadToCloudinary = (buffer, folder = 'uploads') => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({
            folder: folder,
            resource_type: 'auto',
            // transformation: [{ width: 800, height: 800, crop: 'limit' }]
        }, (error, result) => {
            if (error) {
                console.error('Cloudinary upload error:', error);
                return reject(error);
            }
            resolve(result);
        });
        const readableStream = new Readable();
        readableStream.push(buffer);
        readableStream.push(null);
        readableStream.pipe(uploadStream);
    });
};
export default uploadToCloudinary;
//# sourceMappingURL=uploadToCloudinary.js.map