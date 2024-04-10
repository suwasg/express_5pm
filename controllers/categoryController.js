const  mongoose  = require("mongoose")
const Category = require("../models/categoryModel")
const Product = require("../models/productModel")

exports.postCategory = async(req,res)=>{
    let category = new Category({
        category_name:req.body.category_name
    })
    console.log(req.body.category_name)

    // check for unique
    Category.findOne({
        category_name:category.category_name
    })
    .then(async (existingCategory)=>{
        if(existingCategory){
            return res.status(400).json({
                error:"Category Name must be unique."})
        }
        else{
            category = await category.save()
            if (!category){
                
                return res.status(400).json({
                    error:"Something went wrong."})
            }
            res.send(category)
        }
    })
    .catch(error1 => res.status(400).json(  {error:error1}   ))
}

exports.getCategories=async(req, res)=>{
    try{
        // fetch the category
        const categories = await Category.find({})

        // check if categories present or not
        if(!categories || categories.length==0){
            return res.status(404).json({
                message:"Not Found", 
                success:false})
        }

        //return categories
        return res.status(200).json({
            message:"Categories List", 
            success:true, 
            categories})
        // res.send(categories)

    }
    catch(error){
        console.log(error)
        // console.error(error)
        return res.status(400).json({
            success:false, 
            message:"Error on getting the category list", 
            details:error})
    }
}


exports.categoryDetails=async(req,res)=>{
    try{
      // get id from params
      const id = req.params.id 
      // Validate if id is a valid ObjectId
      if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({ 
            error: "Invalid ObjectId(id)", 
            success:false});
      }
      const category = await Category.findById(id)
      // check if category with the specified id exists:
      if(!category){
        return res.status(404).json({
            error:"Category not found.", 
            success:false})
      }
      res.json({
        message:`${category.category_name} details`,
        success: true, 
        category})
  
    }
    catch(err){
      console.log(err)
      if (err instanceof mongoose.Error.CastError){
        res.status(400).json({
            error:"Invalid ObjectID", 
            success:false, 
            message:err.message})
      }
      res.status(500).json({
        error:"Eroor on getting category details api.", 
        success:false, 
        details:err})
    }
  }
  

exports.updateCategory=async(req,res)=>{
    try{
        // id
        const id=req.params.id 
        const {category_name} = req.body
        const category = await Category.findByIdAndUpdate(id, 
           {category_name}
            ,{new:true}
            )

        if(!category){
            return res.status(400).json({message:"Not updated", success:false})
        }
        return res.status(200).json(
            {success:true,
            message:`Category updated successfully` ,
            category})

    }
    catch(error){
        console.log(error)
        // console.error(error)
        return res.status(400).json({
            success:false, 
            message:"Error on updating the category", 
            details:error})
    }
}

exports.categoryCount=async(req,res)=>{
    const total_categories=(await Category.find()).length
    // const totalOrders2= await Order.find().countDocuments()

    return res.status(200).json({success:true, message:"total category count", total_categories})

}

exports.deletCategory = async(req,res)=>{
    try{
        const id = req.params.id 
        const category = await Category.findByIdAndDelete(id)
        if(!category){
            return res.status(404).json({
                message:"Category Not Found", 
                succes:false})
        }
        // Find and delete all products associated with the deleted category
        const deletedProducts = await Product.deleteMany({ category: id });
        console.log(`${deletedProducts.deletedCount} products deleted`);

        return res.status(200).json({
            message:"Category deleted."})

    }
    catch(error){
        console.log(error)
        // console.error(error)
        if(error instanceof mongoose.Error.CastError){
            return res.status(400).json({
                message:"Cast Error. Invalid ObjectId"})
        }
        return res.status(400).json({
            success:false, message:"Error on deleting the category", 
            details:error})
    }
}