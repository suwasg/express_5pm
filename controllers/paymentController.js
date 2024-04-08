// const stripe=require('stripe')(process.env.STRIPE_SECRET_KEY)

// // process payment.
// exports.processPayment=async(req,res)=>{
//     try{
//         // validate request payload.
//         const {amount}=req.body.amount
//         console.log(amount)
//         console.log(typeof amount)
//         // if(!amount || isNaN(amount)){
//         //     return res.status(400).json({succes:false, message:"Invalid amount."})
//         // }

//         // convert amount to Paisa(lowest currency unit in npr.)
//         const amountInPaisa=Math.round(amount*100) // 1rs-> 100paisa

//         // create paymentIntent(Intention to collect the payment from customer.)
//         const paymentIntent=await stripe.paymentIntents.create({
//             amount:amountInPaisa,
//             currency:'npr',
//             metadata:{
//                 integration_check:'accept_a_payment'
//             }
//         })



//         // send the client secret to frontend
//         res.json({client_secret:paymentIntent.client_secret})
//     }
//     catch(error){
//         console.log(error)
//         return res.status(400).json({message:"Bad request during payment process", succes:false})
//     }
// }

// exports.sendStripeApiKey=async(req,res)=>{
//     res.json({
//         stripeApiKey:process.env.STRIPE_API_KEY
//     })
// }


const stripe=require('stripe') (process.env.STRIPE_SECRET_KEY)

// process payment.
exports.processPayment = async (req, res) => {
    try {
        const amountInPaisa = Math.round(req.body.amount * 100); // Convert NPR to paisa
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInPaisa,
            currency: 'npr',
            metadata: { integration_check: 'accept_a_payment' }
        });
        res.json({ client_secret: paymentIntent.client_secret });
    } catch (error) {
        console.log("Error processing payment:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};


// send stripe api key to frontend.
exports.sendStripeApi=async(req,res)=>{
    res.json({
        stripeApiKey:process.env.STRIPE_API_KEY
    })
}