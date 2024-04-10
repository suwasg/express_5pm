const express = require('express')
const { postCategory, getCategories, updateCategory, deletCategory, categoryDetails, categoryCount } = require('../controllers/categoryController')
const { categoryValidation, validation } = require('../validation/validator')
const { requireSignin, requireAdmin } = require('../middlewares/authMiddleware')
const router = express.Router()

// http methods:
// post -> create
// get -> read / retrive 
// put -> update 
// delete -> delete

// http status codes.

router.post('/postcategory',validation,categoryValidation,requireSignin,requireAdmin, postCategory)
router.get('/categorylist', getCategories)
router.get('/categorydetails/:id', categoryDetails)
router.put('/updatecategory/:id',requireSignin,requireAdmin, updateCategory)
router.delete('/deletecategory/:id',requireSignin, requireAdmin, deletCategory)
router.get('/totalcategories', categoryCount)

module.exports= router