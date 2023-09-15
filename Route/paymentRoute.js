import express from 'express'
import { initiatePayment, verifyPayment } from '../Controllers/paymentController.js'
import { protect, user } from '../Middleware/authMiddleware.js'


const router = express.Router()

// initialize payment
router.post("/initialize-payment", protect, user, initiatePayment)
router.get('/payment-callback', protect, user, verifyPayment) 

export default router  