import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/Users.model.js";

export const verifyJWT=asyncHandler(async(req,_,next)=>{
    try {
        const token=req.cookies?.accessToken||req.header("Authorization")?.replace("Bearer ","");
        if(!token)
        {
            throw new ApiError(401,"Unauthorized Request");
        }
        const decodedToken=jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const id=decodedToken._id;
        const user =await User.findById(id).select("-password -refreshToken");
        if(!user)
        {
            //discuss about frontend
            throw new ApiError(401,"Invalid Access Token");
        }
        // console.log("Debug");
        req.user=user;
        next();
    } catch (error) {
        throw new ApiError(401, "Failed in Verifing JWT");
        
    }

});