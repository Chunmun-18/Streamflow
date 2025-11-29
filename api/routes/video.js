const express = require('express');
const Router= express.Router();
const checkAuth=require('../middleware/checkAuth')
//Using checkAuth we will verify the token and then only move further
const jwt= require('jsonwebtoken')
const Video = require('../models/Video')
const cloudinary= require('cloudinary').v2
require('dotenv').config();
const mongoose= require('mongoose')


cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET
  });

Router.post('/upload',checkAuth, async (req,res)=>{  //First checkAuth will run then after next the code here will run
    try {
        const token= req.headers.authorization.split(" ")[1];
        const user= await jwt.verify(token,process.env.JWT_SECRET); //in user we will get all the info using which token is made
        console.log(user)
        console.log(req.body)
        console.log(req.files.video)
        console.log(req.files.thumbnail)

        const uploadedVideo = await cloudinary.uploader.upload(req.files.video.tempFilePath,{
            resource_type:'video'
        })
        const uploadedThumbnail =await cloudinary.uploader.upload(req.files.thumbnail.tempFilePath)
        const newVideo = new Video({
            _id:new mongoose.Types.ObjectId,
            title:req.body.title,
            description:req.body.description,
            user_id:user._id,
            videoUrl:uploadedVideo.secure_url,
            videoId:uploadedVideo.public_id,
            thumbnailUrl:uploadedThumbnail.secure_url,
            thumbnailId:uploadedThumbnail.public_id,
            category:req.body.category,
            tags:req.body.tags.split(',')
        })
        const video= await newVideo.save()
        res.status(200).json({
            msg:"video uploaded successfully"
        })
    } 
    catch (err) {
        console.log(err);
        res.status(500).json({
            error:err
        })
    }
})

module.exports = Router