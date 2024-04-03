const express=require('express')
const { postOrder, orderList, orderDetails, deleteOrder, updateStatus, orderCount, userOrdersList } = require('../controllers/orderController')
const router = express.Router()

router.post('/postorder', postOrder)
router.get('/orderlist', orderList)
router.get('/orderdetails/:id', orderDetails)
router.put('/updatestatus/:id', updateStatus)
router.get('/totalorders', orderCount)
router.get('/userorderlist/:id', userOrdersList)
router.delete('/deleteorder/:id', deleteOrder)

module.exports=router