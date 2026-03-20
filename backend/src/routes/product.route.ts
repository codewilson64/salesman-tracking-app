import express from 'express'
import { createProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from '../controllers/product.controller'
import { authorize } from '../../middleware/authorize'
import { protect } from '../../middleware/protectedRoute'

const router = express.Router()

router.post('/', protect, authorize("owner"), createProduct)
router.get('/', protect, getAllProducts)
router.get('/:id', protect, getProductById)
router.put('/:id', protect, authorize("owner"), updateProduct)
router.delete('/:id', protect, authorize("owner"), deleteProduct)

export default router