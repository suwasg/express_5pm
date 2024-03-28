const {validationResult, check}=require('express-validator')

exports.categoryValidation=[
    check('category_name', "category name is required.").notEmpty()
    .isLength({min:3})
    .withMessage("category name must be of at least 3 characters.")
]

exports.productValidation=[
    check('product_name', 'product name is required').notEmpty()
    .isLength({min:3})
    .withMessage("Product name must be of at least 3 characters."),

    check('product_description', 'product description is required').notEmpty()
    .isLength({min:50})
    .withMessage("product description must be of at least 50 characters."),

    check('product_price', 'Product price is required.').notEmpty()
    .isNumeric()
    .withMessage("Product price must be numeric value."),

    check('count_in_stock', 'stock  is required.').notEmpty()
    .isNumeric()
    .withMessage("stock must be numeric value."),

    check('category', 'Category is required.').notEmpty()

]

exports.validation=(req,res,next)=>{
    const errors = validationResult(req)
    if(errors.isEmpty()){
        next()
    }
    else{
        return res.status(400).json({message:errors.array()[0].msg})

    }
}