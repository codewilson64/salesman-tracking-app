import express from 'express'
import { protect } from '../../middleware/protectedRoute.js'
import { getPaidNotificationCountsBySalesman, getTransactionNotificationCounts, getUnpaidNotificationCountsBySalesman, getUnreadVisitsCount, markPaidNotificationsBySalesmanAsRead, markUnpaidNotificationsBySalesmanAsRead, markVisitsReportsAsRead } from '../controllers/notification.controller.js'

const router = express.Router()

router.get('/unread-visits', protect, getUnreadVisitsCount)
router.patch('/mark-as-read', protect, markVisitsReportsAsRead)

router.get("/transaction-counts", protect, getTransactionNotificationCounts);

router.get("/paid/salesman-counts", protect, getPaidNotificationCountsBySalesman)
router.get("/unpaid/salesman-counts", protect, getUnpaidNotificationCountsBySalesman)
router.patch("/paid/:id/mark-as-read", protect, markPaidNotificationsBySalesmanAsRead)
router.patch("/unpaid/:id/mark-as-read", protect, markUnpaidNotificationsBySalesmanAsRead)

export default router