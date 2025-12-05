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
        //
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            error:err
        })
    }
})

module.exports = Router;