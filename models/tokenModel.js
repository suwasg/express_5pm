const mongoose = require('mongoose')
const {ObjectId}= mongoose.Schema
const tokenSchema = new mongoose.Schema({

    token:{
        type:String,
        required:true
    },
    user_id:{
        type:ObjectId,
        ref:"User",
        required:true
    },
    created_at:{
        type:Date,
        default:Date.now(),
        expires:86400
    }

})
module.exports=mongoose.model("Token", tokenSchema)