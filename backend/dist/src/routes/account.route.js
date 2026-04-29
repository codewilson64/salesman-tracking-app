import express from 'express';
import { protect } from '../../middleware/protectedRoute';
import { deleteCompanyAccount, deleteMyAccount, deleteSalesmanAccountByAdmin } from '../controllers/account.controller';
import { authorize } from '../../middleware/authorize';
const router = express.Router();
router.delete('/company', protect, authorize("owner"), deleteCompanyAccount);
router.delete('/account', protect, deleteMyAccount);
router.delete('/account/:id', protect, deleteSalesmanAccountByAdmin);
export default router;
//# sourceMappingURL=account.route.js.map