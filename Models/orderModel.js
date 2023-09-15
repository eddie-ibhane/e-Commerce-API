/*
customer, products, totalAmount, PaymentStatus, OrderStatus, ShippingAddress, 
*/

import mongoose from "mongoose";

const orderSchema = mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ["paid", "pending", "refunded"],
      default: "pending",
      required: true
    },
    orderStatus: {
      type: String,
      enum: ["processing", "shipped", "delivered", "canceled"],
      default: "processing",
      required: true
    },
    transactionReference: {type: String, required: true},
    shippingAddress: { type: String, required: true },
    billingAddress: { type: String },
    paymentMethod: { type: String },
    orderDate: { type: Date, default: Date.now, required: true },
    shippingDate: { type: Date },
    deliveryDate: { type: Date },
    trackingInformation: {
      trackingNumber: String,
      carrier: String,
    },
    cancellationReason: { type: String },
    isRefunded: {type: Boolean},
    refundInformation: {
      amountRefunded: Number,
      refundDate: Date,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
