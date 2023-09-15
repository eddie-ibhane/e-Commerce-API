/*
customer, products, totalAmount, PaymentStatus, OrderStatus, ShippingAddress, 
*/

import mongoose from "mongoose";

const cartSchema = mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    items: [
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
    
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
