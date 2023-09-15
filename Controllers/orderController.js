import CustomerWallet from "../Models/customerWalletModel.js"
import Order from "../Models/orderModel.js"
import Product from "../Models/productModel.js"
import axios from "axios"


// CREATE AN ORDER
const createOrder = async(req, res) => {
    try {
        const {products, address} = req.body
        const totalPrice = products.reduce((acc, item) => acc + (item.price * item.quantity), 0)
        const paymentResponse = await  axios.post("https://api.paystack.co/transaction/initialize", {
            amount: totalPrice * 100,
            email: req.user.email,
            callback_url: "http://localhost:3000/api/v1/ecommerce/orders/verify-payment"
        },
        {
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SK}`,
                'Content-Type': 'application/json'
            } 
        }
        )
        console.log(paymentResponse) 
        if (paymentResponse.status) {
            const newOrder = await new Order({
                customer: req.user._id,
                products: products, 
                totalAmount: totalPrice,
                shippingAddress: address,
                transactionReference: paymentResponse.data.data.reference
            })
            const saveOrder = await newOrder.save()
            if (saveOrder) {
                res.redirect(paymentResponse.data.data.authorization_url)
            } else {
                res.json({status: false, message: "Unable to save order"})
            }
        } else {
            res.json({statu: false, message: "Unable to initialize your payment"})
        }
    } catch (err) {
        throw new Error(err)
    }
}

// VERIFY ORDER PAYMENT
const verifyOrderPayment = async(req, res) => {
    try {
        const transactionReference = req.query.reference
        const verifyResponse = await axios.get(`https://api.paystack.co/transaction/verify/${transactionReference}`,
        {
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SK}`,
                'Content-Type': 'application/json'
            }
        }
        )
        if (verifyResponse.status) {
            if (verifyResponse?.data.status && verifyResponse.data.data.status === "success") {
                const updateOrder = await Order.findOneAndUpdate({transactionReference: transactionReference}, {
                    paymentStatus: "paid",
                    paymentMethod: verifyResponse?.data.data.channel
                }, {new: true, useFindAndModify: false})
                if (updateOrder) {
                    res.json({status: true, message: "Order successfully verified and updated to paid"})
                } else {
                    res.json({status: false, message: "Unable to update order to paid"})
                }
            } else {
                res.json({status: false, message: "Payment not verified"})
            }
            res.json({status: true, message: "Payment successful", data: verifyResponse})
        } else {
            res.json({status: false, message: "Unable to verify your payment"})
        }
    } catch (err) {
        throw new Error(err)
    }
}

// Get all orders (USER only)

const allOrders = async(req, res) => {
    try {
        const orders = await Order.find({})
        if (orders && orders.length > 0) {
            res.json({status: true, message: "Orders retrieved successfully", data: orders})
        } else {
            res.json({status: false, message: "No order found"})
        }
    } catch (err) {
        throw new Error(err)
    }
}

// Get users order (USER ONLY)

const userOrders = async(req, res) => {
    try {
        const orders = await Order.find({customer: req.user._id})
        if (orders && orders.length > 0) {
            res.json({status: true, message: "Orders retrieved successfully", data: orders})
        } else {
            res.json({status: false, message: "No order found"})
        }
    } catch (err) {
        throw new Error(err)
    }
}

//  GET USERS SINGLE ORDER (vendor, user, admin)
const singleOrder = async(req, res) => {
    try {
        const {id} = req.body 
        const order = await Order.find(id)
        if (order && order.length > 0) {
            res.json({status: true, message: "Single Order retrieved successfully", data: order})
        } else {
            res.json({status: false, message: "No order found"})
        }
    } catch (err) {
        throw new Error(err)
    }
}

// MARK PRODUCT TO SHIPPED (vendor)
const markToShipped = async(req, res) => {
    try {
        const {id} = req.body
        const order = await Order.findById(id)
        if (order && order.paymentStatus === "paid" && order.orderStatus === "processing") {
            const updateToShipped = await Order.findByIdAndUpdate(order._id, {
                orderStatus: "shipped",
            }, {new: true, useFindAndModify: false})
            if (updateToShipped) {
                res.json({status: true, message: "Order updated to shipped"})
            } else {
                res.json({status: false, message: "Unable to ship this order"})
            }
        } else {
            res.json({status: false, message: "Order not found"})
        }
    } catch (err) {
        throw new Error(err)
    }
}

// MARK PRODUCT TO delivered (vendor)
const markToDelivered = async(req, res) => {
    try {
        const {id} = req.body
        const order = await Order.findById(id)
        if (order && order.paymentStatus === "paid" && order.orderStatus === "shipped") {
            const updateToShipped = await Order.findByIdAndUpdate(order._id, {
                orderStatus: "delivered",
                deliveryDate: new Date()
            }, {new: true, useFindAndModify: false})
            if (updateToShipped) {
                res.json({status: true, message: "Order updated to delivered"})
            } else {
                res.json({status: false, message: "Unable to deliver this order"})
            }
        } else {
            res.json({status: false, message: "Order not found"})
        }
    } catch (err) {
        throw new Error(err)
    }
}


//  CANCEL YOUR ORDER
const cancelOrder = async(req, res) => {
    try {
        const {id, cancellationReason} = req.body
        const order = await Order.findOne({_id: id, customer: req.user._id})
        if (order && order.paymentStatus === "paid" && order.orderStatus === "processing") {
            const updateToCancel = await Order.findByIdAndUpdate(order._id, {
                orderStatus: "canceled",
                cancellationReason: cancellationReason,
                isRefunded: false,
            }, {new: true, useFindAndModify: false})
            if (updateToCancel) {
                res.json({status: true, message: ""})
            } else {
                res.json({status: false, message: ""})
            }
        } else {
            res.json({status: false, message: ""})
        }
    } catch (err) {
        throw new Error(err)
    }
}
// REFUND A CANCELLATION AMOUNT (admin)
const refundToWallet = async(req, res) => {
    try {
        const {id} = req.body
        const order = await Order.findById(id)
        if (order && order.paymentStatus === "paid" && order.orderStatus === "canceled" && !order.isRefunded) {
            const userWallet = await CustomerWallet.findOne({customer: order.customer})
            if (userWallet) {
                const newBalance = Number(userWallet.balance) + Number(order.totalAmount)
                const creditWallet = await CustomerWallet.findOneAndUpdate({customer: order.customer}, {
                    balance: newBalance
                }, {new: true, userFindAndModify: false})
                if (creditWallet) {
                    await Order.findByIdAndUpdate(order._id, {
                        isRefunded: true
                    }, {new: true, useFindAndModify: false})
                    res.json({status: true, message: "User refunded"})
                } else {
                    res.json({status: false, message: "Unable to refund amount to user wallet"})
                }
            } else {
                res.json({status: false, message: "Wallet not found"})
            }
        } else {
            res.json({status: false, message: "Order not found or already refunded"})
        }
    } catch (err) {
        throw new Error(err)
    }
}

export {createOrder, verifyOrderPayment, allOrders, userOrders, singleOrder, markToShipped, markToDelivered, cancelOrder, refundToWallet}