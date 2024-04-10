const Product = require('../models/productModel')
const Category = require('../models/categoryModel')
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
        product_images:req.files.map(file=>file.path),// most preferrable
        // product_images:req.files.map(file => {
        //         const baseUrl = 'http://localhost:5000'; // Replace this with your server's base URL
        //         return baseUrl + '/' + file.path.replace(/\\/g, '/'); // Convert Windows-style paths to URL paths
        //     }),
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

    const page=parseInt(req.query.page || 1)
    const itemsPerPage=parseInt(req.query.limit || 4) // items/page

    if(page<=0 || itemsPerPage<=0){
        return res.status(400).json({message:"Invalid page or limit parameters.", success:false})
    }

    const searchQuery=req.query.search || '';

    try{

        const totalProductsCount=await Product.countDocuments({
            $or:[
                {product_name: {
                    $regex:searchQuery, $options:'i' // case-insensitive
                }
                },
                {product_description: {
                    $regex:searchQuery, $options:'i' // case-insensitive
                }
                },

            ]
        })

        const totalPages= Math.ceil( totalProductsCount/itemsPerPage)
        const skip=(page-1)*itemsPerPage 
        // 5-1=4 * 4 =16 
        
        const products = await Product.find(
            {
                $or:[
                    {product_name: {
                        $regex:searchQuery, $options:'i' // case-insensitive
                    }
                    },
                    {product_description: {
                        $regex:searchQuery, $options:'i' // case-insensitive
                    }
                    },
    
                ]
            }
        )
        .populate('category', 'category_name')
        .skip(skip)
        .limit(itemsPerPage)
        .exec()

        if(!products){
            return res.status(404).json({
                succes:false, 
                message:"product not found"})
        }
        return res.status(200).json({
            success:true,
            message:"Product List",
            products,
            count:products.length,
            currentPage:page,
            totalPages, 
            totalItems:totalProductsCount
        })

    }
    catch(error){
        console.log(error)
        if(error instanceof mongoose.Error.CastError){
            return res.status(400).json({
                message:"Cast Error. Invalid ObjectId"})
        }
        return res.status(400).json({
            success:false, message:"Error on getting the product list api", 
            details:error})
    }


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

        console.log(req.body.category)
       
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
    if (req.files && req.files.length > 0) {
        // New images are uploaded, so update the product_images
        update.product_images = req.files.map(file => file.path);
    } 
    else {
        // No new images uploaded, retain the existing product_images
        const existingProduct = await Product.findById(productId);
        if (!existingProduct) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        update.product_images = existingProduct.product_images;
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
            return res.status(400).json({
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
      res.status(500).json({error:"Error on deleting product api.", success:false, details:err})
    }
  }
   
  
exports.productCount=async(req,res)=>{
    const total_products=(await Product.find()).length
    // const totalOrders2= await Order.find().countDocuments()

    return res.status(200).json({success:true, message:"total order count", total_products})

}



// exports.productList = async (req, res) => {
//     const page = parseInt(req.query.page) || 1;
//     const itemsPerPage = parseInt(req.query.limit) || 4;

//     if (page <= 0 || itemsPerPage <= 0) {
//         return res.status(400).json({ message: "Invalid page or limit parameters" });
//     }

//     const searchQuery = req.query.search || '';

//     try {
        // const totalProductsCount = await Product.countDocuments({
        //    $or: [
        //        { product_name: { $regex: searchQuery, $options: 'i' } },
        //        { product_description: { $regex: searchQuery, $options: 'i' } },
        //     ],
        // });

//         const totalPages = Math.ceil(totalProductsCount / itemsPerPage);
//         const skip = (page - 1) * itemsPerPage;

//         const products = await Product.find({
//             $or: [
//                 { product_name: { $regex: searchQuery, $options: 'i' } },
//                 { product_description: { $regex: searchQuery, $options: 'i' } },
//             ]
//         })
//         .populate('category', 'category_name')
//         .skip(skip)
//         .limit(itemsPerPage)
//         .exec();

//         if (!products || products.length === 0) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Products not found"
//             });
//         }

//         return res.status(200).json({
//             success: true,
//             message: "Product List",
//             products,
//             count: products.length,
//             currentPage: page,
//             totalItems: totalProductsCount,
//             totalPages
//         });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ message: "Internal Server Error" });
//     }
// };
