import { Router } from 'express';
import upload from '../../middleware/multer';
import { deleteSingleImage, uploadSingleImage } from '../controllers/upload.controller';
import { protect } from '../../middleware/protectedRoute';

const router = Router();

// Single image upload
router.post('/', protect, upload.single('image'), uploadSingleImage);
router.delete("/", deleteSingleImage);

export default router