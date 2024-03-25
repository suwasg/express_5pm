
const express= require('express')
const app= express()

// const dotenv= require('dotenv')
// dotenv.config()
require('dotenv').config()

require('./db/connection')

// import routes
const categoryRoute = require('./routes/categoryRoute')

// middle-wares
app.use(express.json())  //to parse incoming request bodies with JSON payloads
app.use(express.urlencoded({extended:true})) // to parse incoming request bodies with URL-encoded payloads

// routes
app.use('/api', categoryRoute)

const port= process.env.PORT ||  8000
app.listen(port, ()=>{
    console.log(`Server started on port: ${port}.`)
})
