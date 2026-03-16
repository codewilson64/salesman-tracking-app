import express from 'express'
import { createSalesmen, deleteSalesmen, getAllSalesmen, getSalesmenById, updateSalesmen } from '../controllers/salesman.controller.js'

const router = express.Router()

router.post("/", createSalesmen)
router.get("/", getAllSalesmen);
router.get("/:id", getSalesmenById);
router.put("/:id", updateSalesmen);
router.delete("/:id", deleteSalesmen);

export default router