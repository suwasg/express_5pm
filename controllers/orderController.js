const Order=require("../models/orderModel")
const OrderItem=require('../models/orderItemModel')

exports.postOrder=async(req,res)=>{
    try{

        // At first, post to the OrderItemModel and return the stored Ids of OrderItems.
        const orderItemIds=await Promise.all(req.body.order_items.map(async orderItemData=>{
            let newOrderItem=new OrderItem({
                product:orderItemData.product,
                quantity:orderItemData.quantity
            })
            newOrderItem=await newOrderItem.save()

            return newOrderItem._id
            
        }));
        console.log("order item ids: ", orderItemIds)

        // calculate the total amount
        const totalAmount = await Promise.all(orderItemIds.map(async orderId=>{
            const itemOrder= await OrderItem.findById(orderId).populate('product','product_price')
            const total = itemOrder.quantity * itemOrder.product.product_price

            return total
        }))
        console.log('totalAmount: ', totalAmount)
        // [5*40, 3*50] => [200, 150,250]

        const totalPrice = totalAmount.reduce((acc,curr)=>acc+curr,0)

        // post data to orderModel
        let order=new Order({
            order_items:orderItemIds,
            shipping_address1:req.body.shipping_address1,
            shipping_address2:req.body.shipping_address2,
            city:req.body.city,
            zip:req.body.zip,
            country:req.body.country,
            phone:req.body.phone,
            user:req.body.user,
            total_price:totalPrice
        })

        // save to db
        order = await order.save()

        if(!order){
            return res.status(400).json({success:false, message:"Failed to place the order."})
        }

        // success 
        return res.status(201).json({success:true,message:"Order placed/created successfully", order})
    }
    catch(err){
        console.log(err)
        res.status(500).json({
          error:"Error on post order api.", 
          success:false, 
          details:err})
      }
}


exports.orderList=async(req, res)=>{
    try{
        // fetch the order
        const orders = await Order.find({}).populate('user', 'name').sort({createdAt:-1})

        // check if orders present or not
        if(!orders || orders.length==0){
            return res.status(404).json({
                message:"Order Not Found", 
                success:false})
        }

        //return orders
        return res.status(200).json({
            message:"Orders List", 
            success:true, 
            orders, 
        order_count:orders.length})
        // res.send(orders)

    }
    catch(error){
        console.log(error)
        // console.error(error)
        return res.status(400).json({
            success:false, 
            message:"Error on getting the order list", 
            details:error})
    }
}



exports.orderDetails=async(req,res)=>{
    try{
      // get id from params
      const orderId = req.params.id 
      // Validate if id is a valid ObjectId
      if(!mongoose.Types.ObjectId.isValid(orderId)){
        return res.status(400).json({ 
            error: "Invalid ObjectId(id)", 
            success:false});
      }
      const order = await Order.findById(orderId)
                    .populate({
                        path:'user' ,// field name on the Order Model.
                        select:'name email'
                    })
                    .populate({
                        path:'order_items',
                        populate:{
                            path:'product',
                            populate:{
                                path:'category',
                                select:'category_name'
                            }
                        }
                    })
      // check if order with the specified id exists:
      if(!order){
        return res.status(404).json({
            error:"Order not found.", 
            success:false})
      }
      res.json({
        message:`order details`,
        success: true, 
        order})
  
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
        error:"Eroor on getting order details api.", 
        success:false, 
        details:err})
    }
  }

exports.userOrdersList=async(req,res)=>{
    try{
        // get userId
        userId=req.params.id
        // find the orders list associated with the specified userId
        const orderList=await Order.find({user:req.params.id})
        .populate({
            path:'order_items',
            populate:{
                path:'product',
                populate:'category'
            }
        })

        // check if orderList found
        if(!orderList || orderList.length==0){
            return res.status(404).json({succes:false, message:"No orders for this user."})
        }

        // send the order list in the success response
        return res.status(200).json({succes:true, message:"user order list", orderList})

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
          error:"Eroor on getting user order list api.", 
          success:false, 
          details:err})
      }
}


exports.updateStatus=async(req,res)=>{
    try{
        // find the order by id and update status
        const order = await Order.findByIdAndUpdate(req.params.id, {
            status:req.body.status
        },{
            new:true
        })

        // check if the order found and updated successfully
        if(!order){
            return res.status(404).json({succes:false, message:"Order Not found."})
        }
        // return the success response
        return res.status(200).json({succes:true, message:"Order status updated successfully.", order})
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
          error:"Error on updating order status api.", 
          success:false, 
          details:err})
      }
}

exports.orderCount=async(req,res)=>{
    const totalOrders=(await Order.find()).length
    // const totalOrders2= await Order.find().countDocuments()

    return res.status(200).json({success:true, message:"total order count", totalOrders})

}

exports.deleteOrder= async(req,res)=>{
    try{
        const id = req.params.id 
        const order = await Order.findByIdAndDelete(id)
        if(!order){
            return res.status(404).json({
                message:"Order Not Found", 
                succes:false})
        }
        return res.status(200).json({
            message:"Order deleted."})

    }
    catch(error){
        console.log(error)
        // console.error(error)
        if(error instanceof mongoose.Error.CastError){
            return res.status.json({
                message:"Cast Error. Invalid ObjectId"})
        }
        return res.status(400).json({
            success:false, message:"Error on deleting the order", 
            details:error})
    }
}