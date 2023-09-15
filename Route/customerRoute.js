import express from "express";
import {
  customerRegister,
  customerLogin,
  customerLogout,
  getProfile,
  updateProfile,
  changePassword,
} from "../Controllers/customerController.js";
import { protect, user } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", customerRegister);
router.post("/login", customerLogin);
router.get("/logout", protect, customerLogout);
router.get("/profile", protect, user, getProfile)
router.post("/update", protect, user, updateProfile)
router.post("/change-password", protect, user, changePassword)

export default router;
