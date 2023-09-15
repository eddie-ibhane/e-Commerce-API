import mongoose from "mongoose";

/*
id, name, price, description, Availability, reviews, rating, Category, 
*/

const reviewSchema = mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    rating: { type: Number, enum: [1, 2, 3, 4, 5] },
    comment: { type: String, required: true },
    name: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const ProductSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    images: [{type: String, required: true}],
    quantity: {type: Number, default: 0, required: true},
    category: {type: String, required: true},
    brand: {type: String},
    salesCount: {type: Number, default: 0, required: true},
    discount: {type: Number, default: 0},
    availability: {
      type: String,
      required: true,
      enum: ["In-Stock", "Out-Stock"],
    },
    reviews: [reviewSchema],  
    rating: {type: Number},
    vendor: {type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true}
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", ProductSchema);

export default Product;
