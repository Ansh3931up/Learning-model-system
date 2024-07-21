import {Gallery} from "../module/gallery.model.js";
import ApiError from '../utilities/ApiError.js';
import ApiResponse from '../utilities/ApiResponse.js';
import {asyncHandler } from '../utilities/asyncHandler.js'
// import { uploadOnCloudinary } from '../utilities/cloudinary.js';

const getgalleries=asyncHandler(async(req,res)=>{
    const galleries=await Gallery.find({});
    return res
        .status(200)
        .json (new ApiResponse(200,galleries,"galleries fetched"));
})



const uploadImage=asyncHandler(async(req,res)=>{
    console.log("hello ji",req.body);
    const {photo}=req.body;
    const newGallery=await Gallery.create({
        photo:photo
    })
    if(!newGallery){
        throw new ApiError(400,"photo not uploaded");
    }       
return res
        .status(200)
        .json(new ApiResponse(200,newGallery,"photo uploaded"))
})

const deleteGallery=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    await Gallery.findByIdAndDelete(id);
    return res
        .status(200)
        .json(new ApiResponse(200,"photo deleted"))
})
export {getgalleries,uploadImage,deleteGallery}