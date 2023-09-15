import express from 'express'
import { protect, user } from '../Middleware/authMiddleware.js'
import { createOrder, singleOrder, userOrders, verifyOrderPayment } from '../Controllers/orderController.js'

const router = express.Router()

router.post("/", protect, user, createOrder)
router.get("/verify-payment", protect, user, verifyOrderPayment)
router.get("/all-orders", protect, user, verifyOrderPayment)
router.get("/all-users-orders", protect, user, userOrders)
router.post("/single-order", protect, singleOrder)
router.post("/")

export default router
 