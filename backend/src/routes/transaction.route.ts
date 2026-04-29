import express from 'express'
import { protect } from '../../middleware/protectedRoute.js'
import { getOutstandingTransactions, getPaidTransactions, getTransactionById, updateTransactionPayment } from '../controllers/transaction.controller.js'

const router = express.Router()

router.get('/outstanding', protect, getOutstandingTransactions)
router.get('/paid', protect, getPaidTransactions)
router.get('/:id', protect, getTransactionById)
router.patch("/:id", protect, updateTransactionPayment)

export default router