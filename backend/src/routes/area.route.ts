import express from 'express'
import { createArea, deleteArea, getAllAreas, getAreaById, updateArea } from '../controllers/area.controller'
import { protect } from '../../middleware/protectedRoute'

const router = express.Router()

router.post('/', protect, createArea)
router.get('/', protect, getAllAreas)
router.get('/:id', protect, getAreaById)
router.put('/:id', protect, updateArea)
router.delete('/:id', protect, deleteArea)

export default router