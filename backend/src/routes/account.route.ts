import express from 'express'
import { protect } from '../../middleware/protectedRoute.js'
import { deleteCompanyAccount, deleteMyAccount, deleteSalesmanAccountByAdmin } from '../controllers/account.controller.js'
import { authorize } from '../../middleware/authorize.js'

const router = express.Router()

router.delete('/company', protect, authorize("owner"), deleteCompanyAccount)
router.delete('/account', protect, deleteMyAccount);
router.delete('/account/:id', protect, deleteSalesmanAccountByAdmin);

export default router