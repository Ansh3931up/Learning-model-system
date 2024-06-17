import { User } from '../module/user.model.js';
import ApiError from '../utilities/ApiError.js';
import ApiResponse from '../utilities/ApiResponse.js';
import {asyncHandler } from '../utilities/asyncHandler.js'
import { uploadOnCloudinary } from '../utilities/cloudinary.js';


const generateAccessandrefershToken=async(userid)=>{
    try {
        const user=await User.findById(userid)
        const accessToken=user.generateAccessToken()
        const refreshToken=user.generateRefreshToken()
        user.refreshToken=refreshToken;
        user.save({ validateBeforeSave:false})

        return {accessToken,refreshToken}


        
    } catch (error) {
        throw new ApiError(500,"unable to generate access and refresh token")
    }
}
const options={
    maxAge:7*24*60*60*1000,
    httpOnly:true,
    secure:true
}
const register=asyncHandler(async(req,res)=>{
    const {name,email,password}=req.body;

    if([name,email,password].some((item)=>item?.trim()==='')){
        throw new ApiError(404,"data is incomplete");
    }
    const existing=await User.findOne({
        $or:[{email},{name}]
    })
    console.log(existing);
    if(existing){
        throw new ApiError(404,"this user already exists")
    }

    console.log(req.file);
    console.log(req.file.path);
    const avatarLocalPath=req.file?.path;//ye req ka extra path files vala multer provide krata ha
    // // const coverImageLocalPath=req.files?.coverImage[0]?.path; 

   
    if(!avatarLocalPath){
    throw new ApiError(400,"avatar path is not found")
    }


    const avatar=await uploadOnCloudinary(avatarLocalPath);
    // // const coverImage= await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar){
    throw new ApiError(400,"avatar is enable to be storaed")
    }

    const user=await User.create({
        name,
        avatar:avatar.url,
        email,
        password
        
    })

    const createUser=await User.findById(user._id).select(
    "-password -refreshToken"//id seelect krka password and refreshToken isma sa delete kr diya
    )
    //isa pta chalaga ki user create bi hua ha ki nhi

    if(!createUser){
        throw new ApiError(400,"Something went wrong while registering the user")
    }
    // await user.save();
    // const {accessToken,refreshToken}=await generateAccessandrefershToken(user._id);

    return res
        .status(201)
        .json(new ApiResponse(200,createUser,"User created successfully" )
        .cookie("refreshToken",refreshToken,options)
        .cookie("accessToken",accessToken,options)
    )

    }) 
const login=asyncHandler(async(req,res)=>{
    const {name,email,password}=req.body;
   
    const user=await User.findOne({
        $or:[{email},{name}]
    })
    if(!user){
        throw new ApiError(404,"user not found");
    }

    const isPasswordCorrect=await user.verifyPassword(password);
    if(!isPasswordCorrect){
        throw new ApiError(404,"passwored incorrect");
    }
    const {accessToken,refreshToken}=await generateAccessandrefershToken(user._id);
    return res
        .status(200)
        .json( new ApiResponse(200,'you are logged in'))
        .cookie("refreshToken",refreshToken,options)
        .cookie("accessToken",accessToken,options)


    
})

const logout=asyncHandler(async(req,res)=>{

    const user=req.user;
    if(!user){
        throw new ApiError(404,"noo user logged in");
    }
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:
            {refreshToken:undefined}
        },{
            new:true
        }

    )
    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"user logout "))
})

const getProfile=asyncHandler(async(req,res)=>{
    const user=req.user;
    res
    .status(200)
    .json(new ApiResponse(200,user,"User data"));
})



export {register,login,logout,getProfile};