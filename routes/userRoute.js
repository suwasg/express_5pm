const express = require('express')
const { signup, confirmEmail, signin, userList, userDetails, forgetPassword, resetPassword, signout } = require('../controllers/userController')
const { requireSignin, requireAdmin, requireUser } = require('../middlewares/authMiddleware')
const router = express.Router()

router.post('/signup', signup)
router.put('/confirmation/:token', confirmEmail)
router.post('/signin', signin)
router.get('/userlist',requireSignin,requireAdmin, userList)
router.get('/userdetails/:id',requireSignin, requireUser, userDetails)
router.post('/forgetpassword', forgetPassword)
router.put('/resetpassword/:token', resetPassword)
router.post('/signout', signout)
module.exports= router