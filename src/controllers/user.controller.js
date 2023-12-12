import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/Users.model.js";
import { uploadFile } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";

const registerUser = asyncHandler( async(req,res)=>{
    res.status(200).json({
        message:"my first backend project"
    })
    const input=req.body
    const {fullname,username,email,password}=input;
    /*
    if(fullname===""||username===""|| email===""||password==="")
    {
        throw new ApiError(400,"All fields are required");
    }
    */
   if([fullname,username,email,password].some((field)=>field?.trim()===""))
   {
        throw new ApiError(400,"All fields are required");
   }
   const existedEmail=User.findOne({email})
   if(existedEmail)
   {
     throw new ApiError(409,"Email alredy Exist")
   }
   const existedUser=User.findOne({username})
   if(existedUser)
   {
     throw new ApiError(409,"Username is already Used")
   }
   const avatarPath=req.files?.avatar[0]?.path;
   const coverimagePath=req.files?.coverimage[0]?.path;
   if(!avatarPath){
    throw new ApiError(400, "Avatar is required")
   }
   const avatar = await uploadFile(avatarPath)
   const coverimage = await uploadFile(coverimagePath)
   if(!avatar){
      throw new ApiError(409, "Avatar has not uploaded")
   }
   if(!coverimage)
   {
      throw new ApiError(409, "Cover Image has not uploaded")
   }
   const user=await User.create({
      fullname,
      avatar:avatar.url,
      coverimage:coverimage?.url || "",
      username,
      email,
      password
   })
   const find= await User.findById(user._id).select(
      "-password -refreshToken"
   )
   if(!find)
   {
      throw new ApiError(500, "User not created")
   }
   console.log(username,input.email,input.fullname,input.password)
   return res.status(201).json(
      new ApiResponse(200,user,"Record added SUccesfully")
   )
})
export {registerUser}