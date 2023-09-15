import express from "express";
import {
  vendorLogin,
  vendorLogout,
  vendorRegister,
} from "../Controllers/vendorController.js";
import { admin, protect } from "../Middleware/authMiddleware.js";
const router = express.Router();

router.post("/register", vendorRegister);
router.post("/login", vendorLogin);
router.get("/logout", protect, vendorLogout);
// router.post("/approve-vendor", protect, admin, approveVendor)

export default router;
