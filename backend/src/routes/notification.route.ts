import express from 'express'
import { protect } from '../../middleware/protectedRoute.js'
import { getPaidNotificationCountsBySalesman, getTransactionNotificationCounts, getUnpaidNotificationCountsBySalesman, getUnreadPaidCustomers, getUnreadPaidTransactions, getUnreadUnpaidCustomers, getUnreadUnpaidTransactions, getUnreadVisitsCount, markPaidNotificationsBySalesmanAsRead, markPaidTransactionAsRead, markUnpaidNotificationsBySalesmanAsRead, markUnpaidTransactionAsRead, markVisitsReportsAsRead } from '../controllers/notification.controller.js'

const router = express.Router()

router.get('/unread-visits', protect, getUnreadVisitsCount)
router.patch('/mark-as-read', protect, markVisitsReportsAsRead)

router.get("/transaction-counts", protect, getTransactionNotificationCounts);

router.get("/paid/salesman-counts", protect, getPaidNotificationCountsBySalesman)
router.get("/unpaid/salesman-counts", protect, getUnpaidNotificationCountsBySalesman)
router.patch("/paid/:id/mark-as-read", protect, markPaidNotificationsBySalesmanAsRead)
router.patch("/unpaid/:id/mark-as-read", protect, markUnpaidNotificationsBySalesmanAsRead)

router.get("/paid/customers-unread/:id", protect, getUnreadPaidCustomers)
router.get("/unpaid/customers-unread/:id", protect, getUnreadUnpaidCustomers)

router.get("/paid/transactions-unread/:id", protect, getUnreadPaidTransactions);
router.get("/unpaid/transactions-unread/:id", protect, getUnreadUnpaidTransactions);
router.patch("/paid/transaction/mark-as-read/:id", protect, markPaidTransactionAsRead)
router.patch("/unpaid/transaction/mark-as-read/:id", protect, markUnpaidTransactionAsRead)

export default router