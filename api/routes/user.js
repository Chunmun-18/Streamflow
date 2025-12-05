const express = require('express');
const Router = express.Router();
const bcrypt = require('bcrypt'); //to convert password to hashcode
const { default: mongoose } = require('mongoose');
const cloudinary = require('cloudinary').v2; //library to connect app with cloudinary
require('dotenv').config();
const User = require('../models/user')
const jwt= require('jsonwebtoken');  //to que token using id, password to track usercreate a uni
const checkAuth = require('../middleware/checkAuth');


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

Router.post('/login',async (req,res)=>{
    try{
        const users= await User.find({email:req.body.email})
        if(users.length==0){
            return res.status(500).json({
                error:"User does not exist"
            })
        }
        else{
            //bcrypt compare function is used to compare the hash code password with normal password
            //sequence important for compare function hashed password comes at second place
            const isValid= await bcrypt.compare( req.body.password,users[0].password) //uses[0] used because only 1 account can be created with 1 email
            if(isValid){
                const token = jwt.sign({
                    _id:users[0]._id,
                    channelName:users[0].channelName,
                    email:users[0].email,
                    phone:users[0].phone,
                    logoId:users[0].loginId,

                },
               'abc123', //secret key which is necessary to verify if the token is made by us 
            {
                expiresIn:'365d'
            }
        ) 
        res.status(200).json({
            _id:users[0]._id,
            channelName:users[0].channelName,
            email:users[0].email,
            phone:users[0].phone,
            logoId:users[0].loginId,
            logoUrl:users[0].logoUrl,
            token:token,
            subscribers:users[0].subscribers        
        })
                
    }
            else{
                return res.status(500).json({
                    error:"Invalid password"
                })
            }
        }
    }
    catch(err){
        console.log(err)
        res.status(500).json({
            error:'Some issue'
        })
    }
})
//subscribe api , user A- subscriber user B- channel
Router.put('/subscribe/:userBId',checkAuth, async (req,res)=>{
    try{
        const userA= await jwt.verify(req.headers.authorization.split(" ")[1],process.env.JWT_SECRET);
        const userB = await User.findById(req.params.userBId);
        if(userB.subscribedBy.includes(userA._id)){
            return res.status(500).json({
                Error:"Already subscribed"
            })
        }
        else{
            userB.subscribers+=1
            userB.subscribedBy.push(userA._id)
            await userB.save();
            const userAFullInfo = await User.findById(userA._id)
            userAFullInfo.subscribedChannels.push(userB._id);
            await userAFullInfo.save();
            res.status(200).json({
                msg:"Channel subscribed"
            })
        }
    }
    catch(err) {
        console.log(err);
        res.status(500).json({
            Error:err
        })
    }
})
Router.put('/unsubscribe/:userBId',checkAuth,async (req,res)=>{
    try {
        const userA= await jwt.verify(req.headers.authorization.split(" ")[1],process.env.JWT_SECRET);
        const userB = await User.findById(req.params.userBId);
        const userAFullInfo = await User.findById(userA._id)
        if(userB.subscribedBy.includes(userA._id)){
            userB.subscribedBy.pop(userA._id);
            userB.subscribers-=1;
            userAFullInfo.subscribedChannels.pop(userB._id);
            await userAFullInfo.save();
            await userB.save();
            res.status(200).json({
                msg:"Unsubscribed"
            })
        }
        else{
            return res.status(500).json({
                msg:"Channel not subscribed"
            })
        }
    } 
    catch(err) {
        console.log(err);
        res.status(500).json({
            Error:err
        })
    }
})

module.exports = Router