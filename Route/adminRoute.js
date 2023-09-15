import express from "express";
import {
  adminRegister,
  adminLogin,
  adminLogout,
  approveVendor,
} from "../Controllers/adminController.js";
import { admin, protect } from "../Middleware/authMiddleware.js";

const router = express.Router();

//Register Route
router.post("/register", adminRegister);
router.post("/login", adminLogin);
router.get("/logout", adminLogout);
router.get("/approve/:vendorID", protect, admin, approveVendor)

export default router;
