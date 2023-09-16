import Product from "../Models/productModel.js"
import Vendor from "../Models/vendorModel.js"

// Creatting a product - Vendor only 
const createProduct = async(req, res) => {
    // try {
    //     const {formData} = req.body
    //     const newPoduct = await new Product({
    //         name: formData.name,
    //         price: formData.price,
    //         description: formData.description,
    //         images: formData.images,
    //         vendor: req.vendor,
    //         category: formData.category,
    //         quantity: formData.quantity,
    //         brand: formData.brand,
    //         availabilty: formData.quantity > 0 ? "In-Stock" : "Out-Stock"
    //     })
    //     const saveProduct = await newPoduct.save()
    //     if (saveProduct) {
    //         res.json({status: true, message: "Product created successfully!"})
    //     } else {
    //         res.json({status: false, message: "Unable to create product"})
    //     }
    // } catch (err) {
    //     throw new Error(err)
    // } 
    
    try {
        const {name, price, description,images, quantity, category,  brand} = req.body
        const newProduct = await new Product({
            name,
            price,
            description,
            images,
            vendor: req.vendor,
            quantity,
            category: category.toLowerCase(),
            brand,
            availability: quantity > 0 ? "In-Stock" : "Out-Stock"
        })
        const saveProduct = await newProduct.save()
        if(saveProduct){
        res.json({status: true, message: "Products created Successfully", data: saveProduct})
        }else{
        res.json({status: false, message: "Unable to Create product..."})
        }
    } catch (err) {
        throw new Error(err)
    }
}

// Getting all products
const allProducts = async(req, res) => {
    try {
        const products = await Product.find({})
        if(products && products.length > 0){
            res.json({status: true, message: "Products retrieved", data: products})
        }else{
            res.json({status: false, message: "Product not found"})
        }
    } catch (err) {
        throw new Error(err)
    }
}

// Getting all products by a vendor
const vendorProducts = async(req, res) => {
    try {
        const products = await Product.find({vendor: req.params.vendorID})
        // console.log(req.params.vendorID)
        if (products && products.length > 0) {
            res.json({status: true, message: "Products retrieved", data: products})
        } else {
            res.json({status: false, message: "Product not found!"})
        }
    } catch (err) {
        throw new Error(err)
    }
}

// Getting single product
const getSingleProduct = async(req, res) => {
    try {
        const {id} = req.body
        // console.log(id)
        const product = await Product.findById(id)
        if (product) {
            res.json({status: true, message: "Data retrieved", data: product})
        } else {
            res.json({status: false, message: "Product not found"})
        }
    } catch (err) {
        throw new Error(err)
    }
}
// ALTERNATIVELY
const singleProduct = async(req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        if (product) {
            res.json({status: true, message: "Data retrieved", data: product})
        } else {
            res.json({status: false, message: "Product not found"})
        }
    } catch (err) {
        throw new Error(err)
    }
}

// Fetching products by catergory

const fetchProductByCategory = async(req, res) => {    
    try {
        const {category} = req.body 
        // if (typeof category !== 'string' || category.trim() === '') {
        //     return res.status(400).json({ status: false, message: 'Invalid category' });
        // }
        const lowercaseCategory = category.toLowerCase();
        const products = await Product.find({category: lowercaseCategory})
        if (products.length > 0 && typeof lowercaseCategory === 'string' && lowercaseCategory.trim() !== '') {
            res.json({status: true, message: "Data retrieved", data: products})
        } else {
            res.json({status: false, message: "Product not found or invalid category"})
        }
    } catch (err) {
        throw new Error(err)
    }
}

// const fetchProductByCategory = async(req, res) => {
//     try {
//         const products = await Product.find({category: req.params.category})
//         if (products) {
//             res.json({status: true, message: "Data retrieved", data: products})
//         } else {
//             res.json({status: false, message: "Product not found"})
//         }
//     } catch (err) {
//         throw new Error(err)
//     }
// }

// Fetching top sales products
const fetchTopSalesProducts = async(req, res) => {
    try {
        const products = await Product.find({}).sort({salesCount: -1}).limit(10)
        if (products && products.length > 0) {
            res.json({status: true, message: "Product retrieved", data: products})
        } else {
            res.json({status: false, message: "No products found or empty"})
        }
    } catch (err) {
        throw new Error(err)
    }
}

// Fetching related products
const fetchRelatedProducts = async(req, res) => {
    try {
        const {id} = req.body
        const product = await Product.findById(id)
        if (product) {
            // IF THE PRODUCT WITH THE PROVIDED ID IS FOUND, FIND RELATED PRODUCTS
            // const relatedProducts = await Product.find({category: product.category}).where('_id').not().equals(id).limit(5)
            const relatedProducts = await Product.find({
                category: product.category,
                _id: { $ne: id }, // EXCLUDE THE PROVIDED ID
            }).limit(5);

            // const filterRelated = relatedProducts.filter(product => product._id.toString() !== id).limit(5)
            if (relatedProducts && relatedProducts.length > 0) {
                res.json({status: true, message: "Products retrieved", data: relatedProducts})
            } else {
                res.json({status: false, message: "No related products found"})
            }
        } else {
            res.json({status: false, message: "No such product found"})
        }
    } catch (err) {
        throw new Error(err)
    }
}

// Fetching discounted products
const fetchDiscountedProducts = async(req, res) => {
    try {
        const products = await Product.find({discount: {$gt: 0}})
        if (products && products.length > 0) {
            res.json({status: true, message: "Products found", data: products})
        } else {
            res.json({status: false, message: "No discounted products found"})
        }
    } catch (err) {
        throw new Error(err)
    }
}
    
// Fetching products by price range
// const fetchProductByPriceRange = async(req,  => {
     
//         constmax}=req.bodyconst  = await  {$gte: min, $lte: max}}).sort({price: 1})
//         if (products && > 0) {
//             res.json({status: message: "Products retrieved", data: products})} else {res.json({status:message:  products found 
//           (err) {
//         thrownew Error

// Add discounted product

// Updating a product
const updateProduct = async(req, res) => {
    try {
    const {id, name, price, quantity, description, salesCount, category, brand, images} = req.body
    const product = await Product.findById(id)
    const vendorID = req.vendor._id
    if (product && vendorID.toString() === product.vendor._id.toString()) {
        const updatedfields = {
            name: name ? name : product.name,
            price: price ? price : product.price,
            quantity: quantity ? quantity : product.quantity,
            description: description ? description : product.description,
            salesCount: salesCount ? salesCount : product.salesCount,
            category: category ? category.toLowerCase() : product.category,
            brand: brand ? brand : product.brand,
            images: images ? images : product.images,
        }
        const updatedProduct = await Product.findByIdAndUpdate(id, updatedfields
        , {new: true, useFindAndModify: false})
        if (updatedProduct) {
            res.json({status: true, message: "Product updated successfully", data: updatedProduct})
        } else {
            res.json({status: false, message: "Unable to update product"})
        }
    } else {
        res.json({status: false, message: "Product not found"}) 
    }
    } catch (err) {
        throw new Error(err)
    }
}

// Deleting product
const deleteProduct = async(req, res) => {
    try {
        const {id} = req.body

        // Find the product with the provided id
        const product = await Product.findById(id) 

        // Check if the product exists and if the logged-in vendor owns the product
        if (product && product.vendor._id.toString() === req.vendor._id.toString()) {

            // Delete the product
            const deleteProduct = await Product.findByIdAndDelete(product._id)
            if (deleteProduct) {
                res.json({status: true, message: "Product deleted successfully"})
            } else {
                res.json({status: false, message: "Unable to delete product"})
            }
        } else {
            res.json({status: false, message: "Product not found"})
        }
    } catch (err) {
        throw new Error(err)
    }
}

const createProductReview = async(req, res) => {
    try {
        const {id, rating, comment} = req.body
        const product = await Product.findById(id)
        if(product){
        const alreadyReviewed = product.reviews.find(r => r.customer.toString() === req.user._id.toString())
        if(alreadyReviewed){
            res.json({status: false, message: "Sorry you are only permitted to review once"})
        }else{
            const review = {
            customer: req.user._id,
            rating,
            comment,
            name: req.user.name
            }
            product.reviews.push(review)
            product.rating = product.reviews.reduce((acc, item) => acc + item.rating, 0) / product.reviews.length
            const saveProduct = await product.save()
            if(saveProduct){
            res.json({status: true, message: "Review added", data: saveProduct})
            }else{
            res.json({status: false, message: "unable to save review"})
            }
        }
        }else{
        res.json({status: false, message: "Product not found"})
        }
    } catch (err) {
        throw new Error(err)
    }
}

export {createProduct, allProducts, vendorProducts, getSingleProduct, fetchProductByCategory, fetchTopSalesProducts, fetchDiscountedProducts, fetchRelatedProducts, deleteProduct, singleProduct, updateProduct, createProductReview}