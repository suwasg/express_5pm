const jwt=require('jsonwebtoken')

exports.requireSignin=(req,res, next)=>{
    const token=req.headers.authorization?.split(" ")[1]

    if(!token){
        return res.status(404).json({message:"Authorization required"})
    }

    try{
        const user=jwt.verify(token,process.env.JWT_SECRET)
        req.user=user
        next()
    }
    catch(error){
        console.log("Unauthorized.")
        return res.status(401).json({message:"unauthorized", success:false})
    }
}

exports.requireUser=(req,res,next)=>{
    if(req.user?.role===0){
        console.log('user access granted.')
        next()
    }
    else{
        console.log('unauthorized user.')
    }
}

exports.requireAdmin=(req,res,next)=>{
    if(req.user?.role===1){
        console.log('admin access granted.')
        next()
    }
    else{
        console.log('unauthorized admin.')
    }
}