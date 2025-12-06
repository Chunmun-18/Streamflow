const express = require('express')
const Router= express.Router();
const checkAuth=require('../middleware/checkAuth')
//Using checkAuth we will verify the token and then only move further
const jwt= require('jsonwebtoken')
const Comment = require('../models/Comment')
const cloudinary= require('cloudinary').v2
require('dotenv').config();
const mongoose= require('mongoose')

Router.post('/new-comment/:videoId',checkAuth,async (req,res)=>{
    try{
        const verifiedUser= await jwt.verify(req.headers.authorization.split(" ")[1],process.env.JWT_SECRET);
        const newComment = new Comment({
            _id:new mongoose.Types.ObjectId(),
            userId: verifiedUser._id,
            videoId:req.params.videoId,
            commentText:req.body.commentText
        })
        const comment= await newComment.save()
        res.status(200).json({
            newComment:comment
        })
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            error:err
        })
    }
})

//get all comment API
Router.get('/:videoId',async(req,res)=>{
    try {
        const comments= await Comment.find({videoId:req.params.videoId}).populate('userId','channelName logoUrl')
        res.status(200).json({
            commentList:comments
        })
    } 
    catch (err) {
        console.log(err);
        res.status(500).json({
            error:err
        })
    }
})

module.exports = Router;