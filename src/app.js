import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import ApiError from "../utilities/ApiError.js";
import ApiResponse from "../utilities/ApiResponse.js";
import morgan from "morgan";
import router from "../routes/user.routes.js";
const app=express();
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    Credential:true
}))
app.use(morgan('dev'));

dotenv.config({
    path:"../.env"
});
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"))
app.use("/ping",function (res,req){
    console.log("Pong");
    throw new ApiResponse(200,"Hello pong");
    
})
app.use("/api/v1/user",router);
// app.all("*",function(req,res){
//     throw new ApiError(404,"page not found");
// })






export default app;