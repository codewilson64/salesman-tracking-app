import express from 'express'
import { protect } from '../../middleware/protectedRoute.js'
import { getUnreadVisitsCount, markVisitsReportsAsRead } from '../controllers/notification.controller.js'

const router = express.Router()

router.get('/unread-visits', protect, getUnreadVisitsCount)
router.patch('/mark-as-read', protect, markVisitsReportsAsRead)

export default router