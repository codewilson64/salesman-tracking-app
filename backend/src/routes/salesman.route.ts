import express from 'express'
import { createSalesmen, deleteSalesmen, getAllSalesmen, getSalesmenById, updateSalesmen } from '../controllers/salesman.controller.js'
import { protect } from '../../middleware/protectedRoute.js';
import { authorize } from '../../middleware/authorize.js';

const router = express.Router()

router.post("/", protect, authorize("owner"), createSalesmen)
router.get("/", protect, getAllSalesmen);
router.get("/:id", getSalesmenById);
router.put("/:id", updateSalesmen);
router.delete("/:id", deleteSalesmen);

export default router