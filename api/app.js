const express= require('express');
const app =express();
const mongoose=require('mongoose')
require('dotenv').config()
const userRoute = require('../api/routes/user')
const videoRoute= require('../api/routes/video')
const commentRoute= require("../api/routes/comment")
const bodyParser = require('body-parser') //First import body parser always
const fileUpload = require('express-fileupload')
const connectwithDB = async() =>{
    try{
        const res= await mongoose.connect(process.env.MONGODB_URI)
        console.log('CONNECTED WITH DB')
    }
    catch(err){
         console.log(err)
    }
}

connectwithDB()
app.use(bodyParser.json())
//file uploaded on cloudinary because file cannot be uploaded in database, from that we can get url and image id and then it can be put in database (with password being in hash code)
app.use(fileUpload({       
    useTempFiles:true,
    tempFileDir:'/tmp/'
}))
app.use('/user',userRoute)
app.use('/video',videoRoute)
app.use('/comment',commentRoute)
module.exports=app;