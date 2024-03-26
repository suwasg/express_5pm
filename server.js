
const express= require('express')
const app= express()
const cors = require('cors')
const path =require('path')

// const dotenv= require('dotenv')
// dotenv.config()
require('dotenv').config()

require('./db/connection')

// import routes
const categoryRoute = require('./routes/categoryRoute')
const productRoute = require('./routes/productRoute')

// middle-wares
app.use(express.json())  //to parse incoming request bodies with JSON payloads
app.use(express.urlencoded({extended:true})) // to parse incoming request bodies with URL-encoded payloads
app.use(cors())
app.use('/uploads/images', express.static(path.join(__dirname, 'uploads/images')))
// routes
app.use('/api', categoryRoute)
app.use('/api', productRoute)

const port= process.env.PORT ||  8000
app.listen(port, ()=>{
    console.log(`Server started on port: ${port}.`)
})
