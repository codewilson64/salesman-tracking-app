import express from 'express'
import { createSalesman } from '../controllers/salesman.controller.js'

const router = express.Router()

router.post('/', createSalesman)

export default router