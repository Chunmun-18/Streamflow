const express= require('express');
const app =express();
const mongoose=require('mongoose')
require('dotenv').config()

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
module.exports=app;