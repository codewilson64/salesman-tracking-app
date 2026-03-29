import { Router } from 'express';
import upload from '../../middleware/multer';
import { deleteSingleImage, uploadSingleImage } from '../controllers/upload.controller';

const router = Router();

// Single image upload
router.post('/', upload.single('image'), uploadSingleImage);
router.delete("/", deleteSingleImage);

export default router