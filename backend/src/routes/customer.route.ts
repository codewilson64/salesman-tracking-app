import express from 'express'
import { createCustomer, deleteCustomer, getAllCustomers, getCustomerById, updateCustomer } from '../controllers/customer.controller'
import { protect } from '../../middleware/protectedRoute'

const router = express.Router()

router.post('/', protect, createCustomer)
router.get('/', protect, getAllCustomers)
router.get('/:id', protect, getCustomerById)
router.patch('/:id', protect, updateCustomer)
router.delete('/:id', protect, deleteCustomer)

export default router