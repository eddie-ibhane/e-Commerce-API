import express from 'express'
import { admin, protect, user } from '../Middleware/authMiddleware.js'
import { allOrders, cancelOrder, createOrder, markToDelivered, markToShipped, refundToWallet, singleOrder, userOrders, verifyOrderPayment } from '../Controllers/orderController.js'

const router = express.Router()

router.post("/", protect, user, createOrder)
router.get("/verify-payment", protect, user, verifyOrderPayment)
router.get("/all-orders", protect, admin, allOrders)
router.get("/all-users-orders", protect, user, userOrders)
router.post("/single-order", protect, singleOrder)
router.post("/mark-to-shipped", protect, admin, markToShipped)
router.post("/mark-to-delivered", protect, admin, markToDelivered)
router.post("/cancel-order", protect, user, cancelOrder)
router.post("/refund-payment", protect, admin, refundToWallet)

export default router
 