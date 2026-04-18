import express from 'express'
import { protect } from '../../middleware/protectedRoute'
import { getOutstandingTransactions, getPaidTransactions, getTransactionById, updateTransactionPayment } from '../controllers/transaction.controller'

const router = express.Router()

router.get('/outstanding', protect, getOutstandingTransactions)
router.get('/paid', protect, getPaidTransactions)
router.get('/:id', protect, getTransactionById)
router.patch("/:id", protect, updateTransactionPayment)

export default router