const Product = require('../models/productModel')
const mongoose = require('mongoose')
const path=require('path')
// to add the product
exports.postProduct=async(req,res)=>{
    const {product_name, product_price} =req.body
    let product= new Product({
        product_name:product_name,
        product_price:product_price,
        product_description:req.body.product_description,
        product_rating:req.body.product_rating,
        category:req.body.category,
        // product_images:req.files.map(file=>file.path),
        product_images:req.files.map(file => {
                const baseUrl = 'http://localhost:5000'; // Replace this with your server's base URL
                return baseUrl + '/' + file.path.replace(/\\/g, '/'); // Convert Windows-style paths to URL paths
            }),
        count_in_stock:req.body.count_in_stock
    })
    product = await product.save()
    if(!product){
        return res.status(400).json("Failed to add product.")
    }
    return res.status(201).json({message:"Product Added", success:true, product})
    // res.send(product)
}

// to get the list of products
exports.productList=async(req,res)=>{
    const products = await Product.find().populate('category', 'category_name')

    if(!products){
        return res.status(404).json({
            succes:false, 
            message:"product not found"})
    }
    return res.status(200).json({
        success:true,
        message:"Product List",
        products,
        count:products.length
    })

}

// to get product details of each product
exports.productDetails=async(req,res)=>{
    const productId = req.params.id 
    const product = await Product.findById(productId).populate('category', 'category_name')
    if(!product){
        return res.status(404).json({success:false, message:"Product Not found"})
    }
    return res.status(200).json({succes:true, messag:"Product details:",product})
}

// to update product 
exports.updateProduct=async(req,res)=>{
    try{
        const productId=req.params.id 
        // check if the productId is valid
        if(!mongoose.Types.ObjectId.isValid(productId)){
            return res.status(400).json({success:false, message:"Invalid id"})
        }

        // define the update object based on valid req data
    const update = {
        product_name:req.body.product_name,
        product_price:req.body.product_price,
        product_description:req.body.product_description,
        product_rating:req.body.product_rating,
        category:req.body.category,
        count_in_stock:req.body.count_in_stock
    }
    // if files are uploaded
    if(req.files){
        update.product_images= req.files.map(file=> {
            const baseUrl = 'http://localhost:5000'; // Replace this with your server's base URL
            return baseUrl + '/' + file.path.replace(/\\/g, '/'); // Convert Windows-style paths to URL paths
        })
    }
    // update product by id
    const updatedProduct = await Product.findByIdAndUpdate(productId, update, {
        new:true
    })

    // check if the product was found and updated.
    if(!updatedProduct){
        return res.status(404).json({success:false, message:"Product not fount"})
    }
    return res.status(200).json({success:true, message:"updated successfully", updatedProduct})

    }
    catch(error){
        console.log(error)
        if(error instanceof mongoose.Error.CastError){
            return res.status.json({
                message:"Cast Error. Invalid ObjectId"})
        }
        return res.status(400).json({
            success:false, message:"Error on updating the product", 
            details:error})
    }
}

// delete product
exports.deleteProduct=async(req,res)=>{
    try{
      const productId = req.params.id
      if(!mongoose.Types.ObjectId.isValid(productId)){
        return res.status(400).json({error:"Ivalid ObjectID(id)"})
      }
      const product = await Product.findByIdAndDelete(productId)
      if(!product){
        return res.status(404).json({ error: "Product not found." });
      }
      // Send a success response when the product is successfully deleted
      return res.status(200).json({ message: "Product deleted successfully." });
  
    }
    catch(err){
      console.log(err)
      if (err instanceof mongoose.Error.CastError){
       return res.status(400).json({error:"Invalid ObjectID", success:false, message:err.message})
      }
      res.status(500).json({error:"Eroor on deleting product api.", success:false, details:err})
    }
  }
    