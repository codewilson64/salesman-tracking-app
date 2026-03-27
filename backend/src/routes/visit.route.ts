import express from 'express'
import { protect } from '../../middleware/protectedRoute'
import { checkoutVisit, createVisit, getAllVisits, getVisitById } from '../controllers/visit.controller'

const router = express.Router()

router.post('/', protect, createVisit)
router.get('/', protect, getAllVisits)
router.patch('/checkout', protect, checkoutVisit)
router.get("/:id", protect, getVisitById);
// router.put('/:id', protect, updateArea)
// router.delete('/:id', protect, deleteArea)

export default router