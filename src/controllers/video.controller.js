import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadFile } from "../utils/cloudinary.js";
import { ApiError } from "../utils/apiError.js";
import { Video } from "../models/Videos.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/Users.model.js";

const uploadVideo=asyncHandler(async(req,res)=>{
    const{thumbnail,title,description,duration}=req.body;
    
    const videofile=req.files?.videoFile[0]?.path;
    if([videofile,thumbnail,title,description,duration].some((field)=>field?.trim()===""))
    {
        throw new ApiError(400,"All fields are required to upload video");
    }
    const videoURL=await uploadFile(videofile);
    const uploadedVideo=await Video.create(
        {
            owner:req.user._id,
            videoFile:videoURL.url,
            thumbnail:thumbnail,
            title:title,
            description:description,
            duration:duration

        }
    )
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            uploadedVideo,
            "Video Uploaded Successfully"
            
        )
    )
})

const addVideotoWatchHistory=asyncHandler(async(req,res)=>{
    const{id}=req.params;
    const user=await User.findByIdAndUpdate(
       req.user._id,
       {
          $push:{
             watchHistory:id
          }
       },
       {
          new: true
       }
    )
    if(!user)
    {
       throw new ApiError(404,"Unable to fetch User");
    }
 
    return res
    .status(201)
    .json(new ApiResponse(201,{id},"Video Added To Watch History"))
 })
export {uploadVideo,addVideotoWatchHistory}