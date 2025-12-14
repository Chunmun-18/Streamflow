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

//get own video

Router.get('/own-video',checkAuth,async (req,res)=>{
    try {
        const token= req.headers.authorization.split(" ")[1];
        const user= await jwt.verify(token,process.env.JWT_SECRET); 
        const videos= await Video.find({user_id:user._id})
        res.status(200).json({
            videos:videos
        })
    } 
    catch (error) {
        console.log(error)
        res.status(500).json({
            error:error
        })
    }
})

Router.post('/upload',checkAuth, async (req,res)=>{  //First checkAuth will run then after next the code here will run
    try {
        const token= req.headers.authorization.split(" ")[1];
        const user= await jwt.verify(token,process.env.JWT_SECRET); //in user we will get all the info using which token is made
        // console.log(user)
        // console.log(req.body)
        // console.log(req.files.video)
        // console.log(req.files.thumbnail)

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

//update video detail

Router.put("/:videoId",checkAuth,async (req,res)=>{
    try {
        const verifiedUser= await jwt.verify(req.headers.authorization.split(" ")[1],process.env.JWT_SECRET);
        // console.log(verifiedUser)
        const video= await Video.findById(req.params.videoId)
        // console.log(video)
        if(video.user_id== verifiedUser._id){ //to check if the person who has uploaded the video is updating it
            if(req.files){
                //update thumbnail and text
                await cloudinary.uploader.destroy(video.thumbnailId)
                const updatedThumbnail= await cloudinary.uploader.upload(req.files.thumbnail.tempFilePath);
                const updatedData= {
                    title:req.body.title,
                    description:req.body.description,
                    category:req.body.category,
                    tags:req.body.tags.split(','),
                    thumbnailUrl:updatedThumbnail.secure_url,
                    thumbnailId:updatedThumbnail.public_id
                }
                const updatedVideoDetail = await Video.findByIdAndUpdate(req.params.videoId,updatedData,{new:true});
                res.status(200).json({
                    updatedVideo : updatedVideoDetail
                })
            }else{
                const updatedData= {
                    title:req.body.title,
                    description:req.body.description,
                    category:req.body.category,
                    tags:req.body.tags.split(',')
                }
                const updatedVideoDetail = await Video.findByIdAndUpdate(req.params.videoId,updatedData,{new:true});
                res.status(200).json({
                    updatedVideo : updatedVideoDetail
                })

        } 
    }
        else{
            return res.status(500).json({
                msg:"Permission Denied"
            })
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            error:error
        })
    }
})
//Delete video
Router.delete("/:videoId",checkAuth,async (req,res)=>{
    try {
        const verifiedUser= await jwt.verify(req.headers.authorization.split(" ")[1],process.env.JWT_SECRET);
        // console.log(verifiedUser)
        const video = await Video.findById(req.params.videoId)
        if (video.user_id == verifiedUser._id){
            //delete video,data,thumbnail
            await cloudinary.uploader.destroy(video.videoId,{resource_type:'video'})
            await cloudinary.uploader.destroy(video.thumbnailId);
            const deletedResponse=await Video.findByIdAndDelete(req.params.videoId)
            res.status(200).json({
                msg:"Video deleted successfully",
                deletedResponse : deletedResponse
            })
        }
        else{
            return res.status(500).json({
                Error:"Permission Denied"
            })
        }        

    } catch (error) {
        console.log(error)
        res.status(500).json({
            error:error
        })
    }
})

///like api
Router.put('/like/:videoId',checkAuth,async(req,res)=>{
    try {
        const verifiedUser= await jwt.verify(req.headers.authorization.split(" ")[1],process.env.JWT_SECRET); //Helps to extract user id
        const video= await Video.findById(req.params.videoId);
        if(video.likedby.includes(verifiedUser._id)){
            return res.status(500).json({
                error:"already liked"
            })
        } else{
            if(video.dislikedby.includes(verifiedUser._id)){
                video.likes+=1;
                video.dislike-=1;
                video.dislikedby.pop(verifiedUser._id)
                video.likedby.push(verifiedUser._id)
                await video.save()
                res.status(200).json({
                    msg:"video liked"
                })
            }
            else{
                video.likes+=1;
                video.likedby.push(verifiedUser._id)
                await video.save()
                res.status(200).json({
                    msg:"video liked"
                })
            }
        }
    } 
    catch(err) {
        console.log(err);
        res.status(500).json({
            Error:err
        })
    }
})

Router.put('/dislike/:videoId',checkAuth,async(req,res)=>{
    try {
        const verifiedUser= await jwt.verify(req.headers.authorization.split(" ")[1],process.env.JWT_SECRET); //Helps to extract user id
        const video= await Video.findById(req.params.videoId);
        if(video.dislikedby.includes(verifiedUser._id)){
            return res.status(500).json({
                error:"already disliked"
            })
        } else{
            if(video.likedby.includes(verifiedUser._id)){
                video.dislike+=1;
                video.likes-=1;
                video.dislikedby.push(verifiedUser._id);
                video.likedby.pop(verifiedUser._id)
                await video.save()
                res.status(200).json({
                    msg:"video disliked"
                })
            }
            else{
                video.dislike+=1;
                video.dislikedby.push(verifiedUser._id);
                await video.save()
                res.status(200).json({
                    msg:"video disliked"
                })
            }
        }
    } 
    catch(err) {
        console.log(err);
        res.status(500).json({
            Error:err
        })
    }
})


//view API
Router.put('/views/:videoId',async (req,res)=>{
    try{
        const video= await Video.findById(req.params.videoId);
        // console.log(video);
        video.views+=1;
        await video.save();
        res.status(200).json({
            msg:"Ok"
        })
    }
    catch(err) {
        console.log(err);
        res.status(500).json({
            Error:err
        })
    }
    
})

module.exports = Router