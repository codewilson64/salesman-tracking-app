import express from 'express'
import { createSalesmen, deleteSalesmen, getAllSalesmen, getSalesmenById, updateSalesmen } from '../controllers/salesman.controller.js'
import { protect } from '../../middleware/protectedRoute.js';
import { authorize } from '../../middleware/authorize.js';

const router = express.Router()

router.post("/", protect, authorize("owner"), createSalesmen)
router.get("/", protect, getAllSalesmen);
router.get("/:id", protect, getSalesmenById);
router.put("/:id", protect, authorize("owner"), updateSalesmen);
router.delete("/:id", protect, authorize("owner"), deleteSalesmen);

export default router