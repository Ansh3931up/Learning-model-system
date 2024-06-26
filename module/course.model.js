import mongoose, { Schema } from "mongoose";

const courseSchema=new Schema({
    title:{
        type:String,
        required:true,
        minLength:[8,'title should be more than 8 letters '],
        maxLength:[59,'title should be less than 59 letters'],
        trim:true,
    },
    description:{
        type:String,
        required:true,
        minLength:[8,'title should be more than 8 letters '],
        maxLength:[200,'title should be less than 59 letters'],
        trim:true,
    },
    category:{
        type:String,
        required:true,
        
    },
    thumbnail:{
        type:String,
        required:true
    },
    lectures:{
        title:String,
        description:String,
        thumbnail:String
    },
    numberoflectures:{
        type:Number,
        default:0
    },createdby:{
        type:String
    }
},{timestamps:true})


export const Course=mongoose.model("Course",courseSchema);