import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/Users.model.js";
import { uploadFile } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";

const registerUser = asyncHandler( async(req,res)=>{
   // get user details form frontend
   // validation - not empty
   // check if user exists :- username already used
   // check if email exist :- email already used
   // check for image , check for avatar
   // upload them on cloudinary
   // create user object with the sent information
   // remove password and refreshtoken from response
   // check if user created or not
   // return res

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
   const existedEmail= await User.findOne({email})
   if(existedEmail)
   {
     throw new ApiError(409,"Email alredy Exist")
   }
   const existedUser=await User.findOne({username})
   if(existedUser)
   {
     throw new ApiError(409,"Username is already Used")
   }
   const avatarPath=req.files?.avatar[0]?.path;
   let coverImageLocalPath = req.files?.coverimage[0]?.path;
      if(!avatarPath)
      {
         throw new ApiError(400, "Avatar is required")
      }
    const avatar = await uploadFile(avatarPath)
    const coverimage=await uploadFile(coverImageLocalPath)
    if(!avatar)
    {
       throw new ApiError(409, "Avatar has not uploaded")
    }
   const user=await User.create
   (
      {
         fullname,
         avatar: avatar.url,
         coverimage: coverimage?.url || "",
         username,
         email,
         password
      }
   )
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