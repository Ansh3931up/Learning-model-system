import mongoose,{Schema} from "mongoose";
// import { asyncHandler } from "../utilities/asyncHandler.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const userSchema=new Schema({
    name:{
        type:String,
        lowercase:true,
        required:true,
        unique:true,
        trim:true,
        index:true,
        minLength:[5,"min length is 5"],
        maxLength:[50,"max length is 50"],

    },
    email:{
        type:String,
        lowercase:true,
        required:true,
        unique:true,
        trim:true,
        // index:true,
        match:[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']

    },
    password:{
        type:String,
        required:true,
        minLength:[8,'Password must be more than 8 character']

    },
    number:{
        type:String,
        required:true,
        unique:true
        

    },
    avatar:{
        type:String,//cloudinary url
        required:true
        }

    ,
    refreshToken:{
        type:String,
        unique:true
    },
    role:{
        type:String,
        enum:['USER','ADMIN'],
        default:'USER'
    },
    forgotPasswordToken:String,
    forgotPasswordExpiry:Date


},{timestamps:true});

userSchema.pre("save",async function(next){
    if(!this.isModified("password"))return next();
    this.password= await bcrypt.hash(this.password,10);
})

userSchema.methods.verifyPassword=async function(password){
    return await bcrypt.compare(password,this.password);
}
userSchema.methods.generateAccessToken=function(){
    return jwt.sign(
        {
        _id:this._id,
        email:this.email,
        username:this.username,
        fullname:this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {       expiresIn:process.env.ACCESS_TOKEN_EXPIRY   }
    )
}
userSchema.methods.generateRefreshToken=function(){
    return jwt.sign(
        {
            _id:this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const User=mongoose.model("User",userSchema);