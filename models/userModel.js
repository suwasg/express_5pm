const mongoose=require('mongoose')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true, 
        trim:true
    },
    username:{
        type:String,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        min:8,
        max:50
    },
    phone:{
        type:String, 
        required:true
    },
    role:{
        type:Number,
        enum:[0, 1],
        default:0
    },
    isverified:{
        type:Boolean,
        default:false
    }

},{
    timestamps:true
})

module.exports=mongoose.model("User", userSchema)