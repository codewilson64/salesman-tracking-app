import { Router } from "express";
import { getCompanyRegistration, registerCompany, updateCompanyRegistration } from "../controllers/registration.controller.js";

const router = Router();

router.post("/", registerCompany);
router.get("/:id", getCompanyRegistration);
router.patch("/:id", updateCompanyRegistration);

export default router;