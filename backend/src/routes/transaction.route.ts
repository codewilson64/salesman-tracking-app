import express from 'express'
import { protect } from '../../middleware/protectedRoute'
import { getOutstandingTransactions } from '../controllers/transaction.controller'

const router = express.Router()

router.get('/', protect, getOutstandingTransactions)

export default router