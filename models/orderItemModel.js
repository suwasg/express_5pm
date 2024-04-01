const mongoose=require('mongoose')
const{ObjectId}=mongoose.Schema
const orderItemSchema=new mongoose.Schema({
    product:{
        type:ObjectId,
        required:true,
        ref:"Product"
    },
    quantity:{
        type:Number,
        required:true
    } 
},{
    timestamps:true
})
module.exports=mongoose.model("OrderItem", orderItemSchema)