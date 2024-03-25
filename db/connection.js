const mongoose = require('mongoose')
// mongoose -> object data modeling library 

mongoose.connect(process.env.DATABASE)
.then(()=>console.log("Database connected successfully."))
.catch(err=>console.log(err))