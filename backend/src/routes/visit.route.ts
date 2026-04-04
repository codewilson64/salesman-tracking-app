import express from 'express'
import { protect } from '../../middleware/protectedRoute'
import { checkoutVisit, createVisit, deleteVisit, getAllVisits, getVisitById } from '../controllers/visit.controller'

const router = express.Router()

router.post('/', protect, createVisit)
router.get('/', protect, getAllVisits)
router.patch('/checkout', protect, checkoutVisit)
router.get("/:id", protect, getVisitById);
router.delete('/:id', protect, deleteVisit)
// router.put('/:id', protect, updateArea)

export default router