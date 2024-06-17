import jwt from "jsonwebtoken";
import { asyncHandler } from "../utilities/asyncHandler.js";
import ApiError from "../utilities/ApiError.js";
// import userModel from "../module/user.model";
import { User } from "../module/user.model.js";




export const verifyjwt=asyncHandler(async(req,res,next)=>{
    try {
        const token=req.cookie?.accessToken||req.header("Authorization")?.replace("Bearer ","");
        if(!token){
            throw ApiError(404,"no token");
        }
        const decodedtoken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);

        const user=User.findById(decodedtoken?._id).select("-password -refreshToken");
        if(!user){
            throw ApiError(404,"no user found")
        }
        req.user=user;
        next();

    } catch (error) {
        console.log("Some internal error");
        
    }
})