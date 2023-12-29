import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/Users.model.js";
import { deleteFile, uploadFile } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken=async(user_id)=>{
   try {
      const user =await User.findById(user_id);
      const accessToken=await user.generateAccessToken();
      const refreshToken=await user.generateRefreshToken();
      user.refreshToken=refreshToken;
      await user.save({validateBeforeSave: false});
      return { accessToken, refreshToken };
   } catch (error) {
      throw new ApiError(500,"Error while generating Access and Refresh Token");
   }
}

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
   const registeredUser=await User.create
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
   const find= await User.findById(registeredUser._id).select(
      "-password -refreshToken"
   )
   if(!find)
   {
      throw new ApiError(500, "User not created")
   }
   // console.log(username,input.email,input.fullname,input.password)
   return res.status(201).json(
      new ApiResponse(200,registeredUser,"Record added SUccesfully")
   )
});

const loginUser=asyncHandler( async(req,res)=>{
   // get user details from frontend
   // validation (check username, email, password)
   // check username and password is exist
   // check password matched with the existing password
   // generate refresh token and access token
   // send cookie
   // return response

   const input=req.body;
   const{username,email,password}=input;
   if([username,email,password].some((field)=>field?.trim()===""))
   {
        throw new ApiError(400,"All fields are required");
   }
   /*
   const existedUsername=await User.findOne({username});
   const existedEmail=await User.findOne({email});
   if(!existedUsername && !existedEmail)
   {
      throw new ApiError(409 , "Username and Email not Exists");
   }
   */
  const user=await User.findOne({
   $and: [{username},{email}]
  })
  if(!user)
  {
      throw new ApiError(409, "User with given data do not exist");
  }
  const flag=await user.isPasswordCorrect(password);
  if(!flag)
  {
      throw new ApiError(401, "Password is not correct");
  }
  const {accessToken,refreshToken}=await generateAccessAndRefreshToken(user._id);

  const optn={
      httpOnly:true,
      secure:true
  };

  const loggedInUser=await User.findOne(user._id).select("-password -refreshToken");

  return res
  .status(200)
  .cookie("accessToken", accessToken,optn)
  .cookie("refreshToken", refreshToken,optn)
  .json(
      new ApiResponse(
      200,
      {
         user:loggedInUser, accessToken,refreshToken
      },
      "user logged in Successfully"
  ))

});

const logoutUser=asyncHandler( async(req,res)=>{
   // clear the cookie
   // take refreshtoken from user
   // return res
   // console.log(req.user._id);
   User.findByIdAndUpdate(
      req.user._id,
      {
         $set:{
            refreshToken:undefined
         }
      },
      {
         new:true
      }
   )
   const optn={
      httpOnly:true,
      secure:true
   }
   return res
   .status(200)
   .clearCookie("accessToken",optn)
   .clearCookie("refreshToken",optn)
   .json(new ApiResponse(
      200,
      {},
      "logged out successfully"
   ))
});

const refreshAccessToken=asyncHandler(async(req,res)=>{
   try {
      const incomingRefreshToken=req.cookies?.refreshToken||req.body.refreshToken;
      if(!incomingRefreshToken)
      {
         throw new ApiError(401, "Login again");
      }
      const decodedToken=jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
      if(!decodedToken)
      {
         throw new ApiError(401, "Invalid Access");
      }
      const user=await User.findById(decodedToken._id).select("-password -refreshToken");
      if(!user)
      {
         throw new ApiError(401, "Unable to fetch user detail from database");
      }
      if(incomingRefreshToken!=user?.refreshToken)
      {
         throw new ApiError(401, "Refresh Token is Expired or Invalid Access");
      }
   
      const optn={
         httpOnly:true,
         secure:true
      };
      const{accessToken,newrefreshToken}=await generateAccessAndRefreshToken(user._id);
      return res
      .status(200)
      .cookie("accessToken",accessToken,optn)
      .cookie("refreshToken",newrefreshToken,optn)
      .json(
         new ApiResponse(
            201,
            {user: user,accessToken,newrefreshToken},
            "Logged in Successfully"
         )
      )
   } catch (error) {
      throw new ApiError(401, "Access Token can't be generated or Unautorized Access");
   }
})

const changePassword=asyncHandler(async(req,res,next)=>{
   const{oldPassword, newPassword,confirmPassword}=req.body;
   if(newPassword != confirmPassword)
   {
      throw new ApiError(500,"confirm Password not matched with new Password");
   }
   const user=await User.findById(req.user?._id);
   const flag=await user.isPasswordCorrect(oldPassword);
   console.log("flag: ",flag);
   if(!flag)
   {
      throw new ApiError(501, "Unauthorized Access or Invalid Old Password");
   }
   user.password=newPassword;
   await user.save({validateBeforeSave: false});
   next();
   return res
   .status(200)
   .json(
      new ApiResponse(
         200,
         {},
         "Password updated Successfully"
      )
   )
})

const getCurrentUser=asyncHandler(async(req,res)=>{
   return res
   .status(200)
   .json(new ApiResponse(
      200,
      req.user,
      "Current User"
   ))
})

const updateProfile=asyncHandler(async (req,res)=>{
   const {fullname,email}=req.body;
   // console.log(fullname,email);
   if(!fullname && !email) 
   {
      throw new ApiError(501,"All fields are required");
   }
   const user=await User.findByIdAndUpdate(
      req.user?._id,
      {
         $set:{
            fullname:fullname,
            email:email
         }
      },
      {
         new:true
      }
   ).select("-password")
   return res
   .status(201)
   .json(
      new ApiResponse(
         201,
         user,
         "Profile updated Successfully"
      )
   )
});

const updateAvatar=asyncHandler(async(req,res)=>{
   const avatarPath=req.file?.path;
   if(!avatarPath)
   {
      throw new ApiError(501, "Avatar file is required");
   }
   const avatar=await uploadFile(avatarPath);
   if(!avatar)
   {
      throw new ApiError(401, "Unable to upload Avatar on Cloudinary")
   }
   const user=await User.findById(req.user?._id).select("-password -refreshToken");
   if(!user)
   {
      throw new ApiError(401,"unauthorized access");
   }
   const avatarURL=user.avatar;
   // console.log(avatarURL);
   await deleteFile(avatarURL);
   user.avatar=avatar.url;
   await user.save({validateBeforeSave: false});

   return res
   .status(200)
   .json(
      new ApiResponse(
         200,
         user,
         "Avatar updated Successfully"
      )
   )
})

const updateCoverImage=asyncHandler(async(req,res)=>{
   const coverImagefile=req.file?.path;

   if(!coverImagefile)
   {
      throw new ApiError(501, "Cover Image file is required");
   }
   const coverImage=await uploadFile(coverImagefile);
   if(!coverImage)
   {
      throw new ApiError(401, "Unable to upload Cover Image on Cloudinary")
   }
   const user=await User.findById(req.user?._id).select("-password -refreshToken");
   if(!user)
   {
      throw new ApiError(401,"unauthorized access");
   }
   await deleteFile(user.coverimage);
   user.coverimage=coverImage.url;
   await user.save({validateBeforeSave: false});

   return res
   .status(200)
   .json(
      new ApiResponse(
         200,
         user,
         "Cover Image updated Successfully"
      )
   )
})

export {
   loginUser,
   logoutUser,
   registerUser,
   changePassword,
   getCurrentUser,
   updateProfile,
   updateAvatar,
   updateCoverImage,
   refreshAccessToken
}