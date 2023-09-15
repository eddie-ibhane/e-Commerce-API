import axios from "axios"
import Product from "../Models/productModel.js"
// import Order from "../Models/orderModel.js"

const initiatePayment = async(req, res) => {
    try {
        const {id} = req.body
        const product = await Product.findById(id)
        const paymentResponse = await  axios.post("https://api.paystack.co/transaction/initialize", {
            amount: product.price * 100,
            email: req.user.email,
            callback_url: "http://localhost:3000/api/v1/ecommerce/payment/payment-callback"
        },
        {
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SK}`,
                'Content-Type': 'application/json'
            }
        }
        )
        console.log(paymentResponse.data) 
        if (paymentResponse.status) {
            res.redirect(paymentResponse.data.data.authorization_url) 
        } else {
            res.json({status: false, message: "Unable to initialize a payment"})
        }
    } catch (err) {
        throw new Error(err)
    }
}

const verifyPayment = async(req, res) => {
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
        // console.log(transactionReference)
        console.log(verifyResponse.data)
        if (verifyResponse.data.data.status === "success"){
            if (verifyResponse?.data.status && verifyResponse.data.data.status === "success") {
                // if (verifyResponse.data.status) { 
                //     // CREATE A NEW ORDER
                //     // const newOrder = await new Order({
    
                //     // })
                // } else {
                //     res.json({status: false, message: "Payment not verified"})
                // }
                res.json({status: true, message: "Payment successful", data: verifyResponse.data})
            } else {
                res.json({status: false, message: "Payment unsuccessful"}) 
            }
        }else{
            res.json({status: false, message: "Unable to verify payment"}) 
        }
    } catch (err) {
        throw new Error(err) 
    }
}

export {initiatePayment, verifyPayment}