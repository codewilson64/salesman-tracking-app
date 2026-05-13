import express from 'express'
import { protect } from '../../middleware/protectedRoute.js'
import { getTransactionNotificationCounts, getUnreadVisitsCount, markPaidNotificationsAsRead, markUnpaidNotificationsAsRead, markVisitsReportsAsRead } from '../controllers/notification.controller.js'

const router = express.Router()

router.get('/unread-visits', protect, getUnreadVisitsCount)
router.patch('/mark-as-read', protect, markVisitsReportsAsRead)

router.get("/transaction-counts", protect, getTransactionNotificationCounts);
router.patch("/paid/mark-as-read", protect, markPaidNotificationsAsRead);
router.patch("/unpaid/mark-as-read", protect, markUnpaidNotificationsAsRead);

export default router