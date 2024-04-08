const express=require('express')
const { postOrder, orderList, orderDetails, deleteOrder, updateStatus, orderCount, userOrdersList } = require('../controllers/orderController')
const { requireSignin, requireUser, requireAdmin } = require('../middlewares/authMiddleware')
const router = express.Router()

router.post('/postorder',requireSignin,requireUser, postOrder)
router.get('/orderlist',requireSignin, requireAdmin, orderList)
router.get('/orderdetails/:id', orderDetails)
router.put('/updatestatus/:id',requireSignin,requireAdmin, updateStatus)
router.get('/totalorders', orderCount)
router.get('/userorderlist/:id',requireSignin,requireUser, userOrdersList)
router.delete('/deleteorder/:id',requireSignin,requireUser, deleteOrder)

module.exports=router