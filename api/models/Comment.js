const mongoose = require('mongoose')

const videoSchema= new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    user_id:{type:String, required:true},
    videoId:{type:String, required:true},
    commentText:{type:String,required:true}
},{timestamps:true}) //writing timestamps:true so that mongoose can itself manage the time at which it was created and last modified

module.exports= mongoose.model("Comment",commentSchema)