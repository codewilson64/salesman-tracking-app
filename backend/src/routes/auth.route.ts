import express from 'express'
import { forgotPassword, getMe, login, resetPassword, signup } from '../controllers/auth.controller.js'
import { protect } from '../../middleware/protectedRoute.js'

const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)
router.get('/me', protect, getMe)
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router