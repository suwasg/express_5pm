const express = require('express')
const { postCategory, getCategories, updateCategory, deletCategory, categoryDetails } = require('../controllers/categoryController')
const { categoryValidation, validation } = require('../validation/validator')
const router = express.Router()

// http methods:
// post -> create
// get -> read / retrive 
// put -> update 
// delete -> delete

// http status codes.

router.post('/postcategory',validation,categoryValidation, postCategory)
router.get('/categorylist', getCategories)
router.get('/categorydetails/:id', categoryDetails)
router.put('/updatecategory/:id', updateCategory)
router.delete('/deletecategory/:id', deletCategory)


module.exports= router