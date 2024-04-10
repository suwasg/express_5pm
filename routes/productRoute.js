const express= require('express')
const router =express.Router()
const upload = require('../middlewares/file-upload')
const { postProduct, productList, productDetails, updateProduct, deleteProduct, productCount } = require('../controllers/productController')
const { requireSignin, requireAdmin } = require('../middlewares/authMiddleware')

router.post('/postproduct',upload.array('product_images', 4),requireSignin, requireAdmin, postProduct )
router.get('/productlist', productList)
router.get('/productdetails/:id', productDetails)
router.put('/updateproduct/:id', upload.array('product_images', 4),requireSignin, requireAdmin ,updateProduct)
router.delete('/deleteproduct/:id',requireSignin, requireAdmin, deleteProduct)
router.get('/totalproducts', productCount)
module.exports=router