import { Router } from 'express';
import upload from '../../middleware/multer.js';
import { deleteSingleImage, uploadSingleImage } from '../controllers/upload.controller.js';
import { protect } from '../../middleware/protectedRoute.js';

const router = Router();

// Single image upload
router.post('/', protect, upload.single('image'), uploadSingleImage);
router.delete("/", deleteSingleImage);

export default router