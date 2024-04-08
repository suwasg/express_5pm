const User= require('../models/userModel')
const Token=require('../models/tokenModel')
const jwt = require('jsonwebtoken')
const mongoose = require("mongoose")
const {hashPassword, comparePassword} = require('../helper/authHelper')
const sendEmail= require('../utils/set-email')
const crypto= require('crypto')
exports.signup= async(req,res)=>{
    try{
        const{name, email, password,phone}=req.body
        console.log(req.body)
        // req.body.email=email
        // check if email already exists or not.
        const existEmail= await User.findOne({email})
        if(existEmail){
            return res.status(400).json({message:"Email already exists", success:false})
        }

        // hashpassword
        const hashedPassword= await hashPassword(password)

        // create the user data .
        const user = new User({
            name, 
            username:email.split('@')[0], // suwas123  gmail.com
            email,
            password:hashedPassword,
            phone
        })

        // save the user data to db.
        await user.save()
        

        // generate token
        const token= jwt.sign({email}, process.env.JWT_SECRET, {expiresIn:"1d"})
        
        // create and save token to db
        const tokenDoc= new Token({
            token,
            user_id:user._id,
          
        })
        await tokenDoc.save()

        // frontend link
         const url=process.env.FRONTEND_URL + '\/email\/confirmation/'+tokenDoc.token
        //  http://localhost:5173/email/confirmation/qoyajdj297627943kmfdf

        // send the confirmation email
        sendEmail({
            from:`noreply@ecommerce.com`,
            to:user.email,
            subject:'Email Verification Link',
            text:`Greetings!! \n\n Please verify your email by clicking the link below: \n\n http:\/\/${req.headers.host}\/api\/confirmation\/${tokenDoc.token}`,
            // http://localhost:5000/api/confirmation/9abcd29722233
            html:`<h1>
                Verify your email:
                </h1>
            <a href='${url}'> Click to verify</a>
              `
        })

        // return the success response
        return res.status(201).json({success:true, message:"User registered successfully.", user})

    }
    catch(err){
        console.log(err)
        if (err instanceof mongoose.Error.CastError){
          res.status(400).json({
              error:"Cast Error.", 
              success:false, 
              message:err.message})
        }
        res.status(500).json({
          error:"Error on signup api.", 
          success:false, 
          details:err})
      }
}

exports.confirmEmail=async(req,res)=>{
    try{
        // get token from params
        const tokenValue = req.params.token 
        // validate tokenValue
        if(!tokenValue){
            return res.status(400).json({success:false, message:"Token required"})
        }

        // find the token on the db.
        const token = await Token.findOne({token:tokenValue})
        // validate input token
        if(!token){
            return res.status(400).json({success:false, message:"Invalid token Or Token may be expired."})
        }
        // find the user for given token
        const user = await User.findOne({
            _id:token.user_id
        })

        // validate user
        if(!user){
            return res.status(400).json({success:false, message:"Unable to find tthe user for this token."})
        }

        // check if the user is verified or not
        if(user.isverified){
            return res.status(400).json({success:false, message:"User already verified, please sign in to continue."})
        }

        // mark the user verified
        user.isverified=true

        // save the user
        await user.save()

        // return the success response.
        return res.status(200).json({success:true, message:`Email id: ${user.email} is verified succesfully. Please sign in to continue.`})
    }
    catch(err){
        console.log(err)
        if (err instanceof mongoose.Error.CastError){
          res.status(400).json({
              error:"Cast Error.", 
              success:false, 
              message:err.message})
        }
        res.status(500).json({
          error:"Error on confirmation api.", 
          success:false, 
          details:err})
      }
}

exports.signin=async(req,res)=>{
    try{
        const {email, password}= req.body
        console.log(email)
        console.log(password)

        // find by user by email
        const user = await User.findOne({email:email})

        // validate user
        if(!user){
            return res.status(404).json({success:false, message:"Email not found in the system."})
        }

        // compare the password.
        const isPasswordMatch= await comparePassword(password, user.password)

        // validate pw
        if(!isPasswordMatch){
            return res.status(400).json({success:false, message:"Password doesn't match."})
        }

        // check if user is verified or not.
        if(!user.isverified){
            return res.status(400).json({success:false, message:"User is not verified."})
        }

        // generate token
        const token= jwt.sign({_id:user._id, role:user.role}, process.env.JWT_SECRET)

        res.cookie('authToken')

        // respond with success msg
        return res.status(200).json({success:true, message:"Login Successfull", 
   token,user:{
    role:user.role,
    name:user.name,
    email:user.email
   } })
    }
    catch(err){
        console.log(err)
        if (err instanceof mongoose.Error.CastError){
          res.status(400).json({
              error:"Cast Error.", 
              success:false, 
              message:err.message})
        }
        res.status(500).json({
          error:"Error on signin api.", 
          success:false, 
          details:err})
      }
}

exports.userList=async(req, res)=>{
    try{
        // fetch the category
        const users = await User.find({})

        // check if users present or not
        if(!users || users.length==0){
            return res.status(404).json({
                message:"User Not Found", 
                success:false})
        }

        //return users
        return res.status(200).json({
            message:"Users List", 
            success:true, 
            users})
       

    }
    catch(error){
        console.log(error)
        // console.error(error)
        return res.status(400).json({
            success:false, 
            message:"Error on getting the users list", 
            details:error})
    }
}



exports.userDetails=async(req,res)=>{
    try{
      // get id from params
      const id = req.params.id 
      // Validate if id is a valid ObjectId
      if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({ 
            error: "Invalid ObjectId(id)", 
            success:false});
      }
      const user = await User.findById(id)
      // check if user with the specified id exists:
      if(!user){
        return res.status(404).json({
            error:"User not found.", 
            success:false})
      }
     return res.json({
        message:`${user.name} details`,
        success: true, 
        user})
  
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
        error:"Error on getting user details api.", 
        success:false, 
        details:err})
    }
  }


exports.forgetPassword=async(req,res)=>{
    try{
        const {email}=req.body // email:req.body.email
        const user = await User.findOne({email:email})

        // validate user
        if(!user){
            return res.status(404).json({success:false, message:"User not found in the system."})
        }

         // generate token
         const token= jwt.sign({email}, process.env.JWT_SECRET, {expiresIn:"1d"})
        
         // create and save token to db
         const tokenDoc= new Token({
             token,
             user_id:user._id,
         })
         await tokenDoc.save()

        //  frontend link for reset password
         const url=process.env.FRONTEND_URL + '\/reset\/password/'+tokenDoc.token

 
         // send the reset email
         sendEmail({
             from:`noreply@ecommerce.com`,
             to:user.email,
             subject:'Password Reset Link',
             text:`Greetings!! \n\n Please reset the password clicking the link below: \n\n http:\/\/${req.headers.host}\/api\/resetpassword\/${tokenDoc.token}`,
             // http://localhost:5000/api/resetpassword/9abcd29722233
             html:`<h1>
             Reset your password:
             </h1>
         <a href='${url}'> Click to reset passowrd</a>
           `
         })
 
         // return the success response
         return res.status(201).json({success:true, message:"Password reset link sent successfully."})

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
          error:"Error on forget password api.", 
          success:false, 
          details:err})
      }
}

exports.resetPassword=async(req,res)=>{
    try{
          // get token from params
          const tokenValue = req.params.token 
          // validate tokenValue
          if(!tokenValue){
              return res.status(400).json({success:false, message:"Token required"})
          }
  
          // find the token on the db.
          const token = await Token.findOne({token:tokenValue})
          // validate input token
          if(!token){
              return res.status(400).json({success:false, message:"Invalid token Or Token may be expired."})
          }
          // find the user for given token
          const user = await User.findOne({
              _id:token.user_id
          })
  
          // validate user
          if(!user){
              return res.status(400).json({success:false, message:"Unable to find tthe user for this token."})
          }

        //   user.isverified=true
        user.password=await hashPassword(req.body.password)

        await user.save()

        return res.status(200).json({success:true, message:"Password reset successfully."})

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
          error:"Error on reset password api.", 
          success:false, 
          details:err})
      }
}

exports.signout=async(req,res)=>{
    res.clearCookie('authToken')
    res.status(200).json({message:"Signout Successfully"})
}