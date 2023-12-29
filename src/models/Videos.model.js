import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const videoSchema=new mongoose.Schema({
    id:{
        type:String,
        required:true,
        unique:true
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    videoFile:{
        type:String,
        required:true
    },
    thumbnail:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    descriptin:{
        type:String,
        required:true
    },
    duration:{
        type:Number,
        required:true
    },
    views:{
        type:Number,
        required:true,
        default:0
    },
    isPublished:{
        type:Boolean,
        required:true,
        default:false
    }
},{timestamps:true})
videoSchema.plugin(mongooseAggregatePaginate)
export const Video=mongoose.model('Video',videoSchema)