import { Router } from 'express';
import upload from '../../middleware/multer';
import { uploadSingleImage } from '../controllers/upload.controller';

const router = Router();

// Single image upload
router.post('/', upload.single('image'), uploadSingleImage);

export default router