import express from 'express'
import { protect } from '../../middleware/protectedRoute.js';
import { updatePassword, updateProfile } from '../controllers/profile.controller.js';

const router = express.Router()

router.put("/update", protect, updateProfile)
router.put("/password", protect, updatePassword);

export default router