const express = require('express')
const { signup, confirmEmail, signin, userList, userDetails } = require('../controllers/userController')
const router = express.Router()

router.post('/signup', signup)
router.put('/confirmation/:token', confirmEmail)
router.post('/signin', signin)
router.get('/userlist', userList)
router.get('/userdetails/:id', userDetails)

module.exports= router