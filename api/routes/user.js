const express = require('express');
const Router = express.Router();
const bcrypt = require('bcrypt'); //to convert password to hashcode
const { default: mongoose } = require('mongoose');
const cloudinary = require('cloudinary').v2; //library to connect app with cloudinary
require('dotenv').config();
const User = require('../models/user')


cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET
  });

Router.post('/signup',async (req,res)=>{
    try{
        const users= await User.find({email:req.body.email})
        if (users.length>0){
            return res.status(500).json({
                error:'Email already registered'
            })
        }
       const hashCode= await bcrypt.hash(req.body.password,10)
       const uploadImage= await cloudinary.uploader.upload(req.files.logo.tempFilePath)
       
       const newUser= new User({
        _id:new mongoose.Types.ObjectId,
        channelName:req.body.channelName,
        email:req.body.email,
        phone:req.body.phone,
        password:hashCode,
        logoUrl:uploadImage.secure_url,
        logoId:uploadImage.public_id
       })

       const user= await newUser.save()
       res.status(200).json({
        newUser:user
       })
    }
    catch(err){
        console.log(err)
        res.status(500).json({
            error:err
        })
    }
})

module.exports = Router