const express= require('express')
const router =express.Router()
const upload = require('../middlewares/file-upload')
const { postProduct, productList, productDetails, updateProduct, deleteProduct } = require('../controllers/productController')

router.post('/postproduct',upload.array('product_images', 4), postProduct )
router.get('/productlist', productList)
router.get('/productdetails/:id', productDetails)
router.put('/updateproduct/:id', upload.array('product_images', 4) ,updateProduct)
router.delete('/deleteproduct/:id', deleteProduct)
module.exports=router