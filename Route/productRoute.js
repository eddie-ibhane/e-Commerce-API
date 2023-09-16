import express from 'express'
import { admin, protect, user, vendor } from '../Middleware/authMiddleware.js';
import { allProducts, createProduct, createProductReview, deleteProduct, fetchDiscountedProducts, fetchProductByCategory, fetchRelatedProducts, fetchTopSalesProducts, getSingleProduct, singleProduct, updateProduct, vendorProducts } from '../Controllers/productController.js';

const router = express.Router();

router.post("/", protect, vendor, createProduct)
router.get("/", allProducts)
router.get("/vendor/:vendorID", protect, vendorProducts)
router.post("/single", getSingleProduct)
router.post("/single/:id", singleProduct) //alternative
router.post("/category", fetchProductByCategory)
router.get("/top-sale-products", fetchTopSalesProducts)
router.post("/related-products", fetchRelatedProducts)
router.get("/discounted-products", fetchDiscountedProducts)
router.put("/update-product", protect, vendor, updateProduct)
router.delete("/", protect, vendor, deleteProduct)
router.post("/create-review", protect, user, createProductReview)



export default router
 