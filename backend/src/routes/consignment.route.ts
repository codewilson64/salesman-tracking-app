import express from 'express'
import { protect } from '../../middleware/protectedRoute.js'
import { getCurrentConsignmentStock, getCustomerConsignmentStocks } from '../controllers/consignment.controller.js'

const router = express.Router()

router.post('/current-stock', protect, getCurrentConsignmentStock)
router.get('/customers/consignment-stocks/:id', protect, getCustomerConsignmentStocks)

export default router