import express from 'express'
import { createArea, deleteArea, getAllAreas, getAreaById, getCustomersByArea, updateArea } from '../controllers/area.controller'
import { protect } from '../../middleware/protectedRoute'

const router = express.Router()

router.post('/', protect, createArea)
router.get('/', protect, getAllAreas)
router.get('/:id', protect, getAreaById)
router.patch('/:id', protect, updateArea)
router.delete('/:id', protect, deleteArea)

router.get('/:id/customers', protect, getCustomersByArea)

export default router