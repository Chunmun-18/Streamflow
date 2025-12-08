const mongoose = require('mongoose')

const commentSchema= new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    userId:{type:mongoose.Schema.Types.ObjectId, required:true,ref:'User'},
    videoId:{type:String, required:true},
    commentText:{type:String,required:true}
},{timestamps:true}) //writing timestamps:true so that mongoose can itself manage the time at which it was created and last modified

module.exports= mongoose.model("Comment",commentSchema)