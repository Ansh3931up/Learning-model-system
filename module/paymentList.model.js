import mongoose, { Schema } from "mongoose";

const paycardSchema=new Schema({
    title:{
        type:String,
        required:true,
        // minLength:[2,'title should be more than 8 letters '],
        // maxLength:[100,'title should be less than 59 letters'],
        trim:true,
    },
    description:{
        type:String,
        required:true,
        // minLength:[8,'description should be more than 8 letters '],
        // maxLength:[500,'description should be less than 59 letters'],
        trim:true,
    },
    
    thumbnail:{
        type:String,
        required:true
    },
    price:{
        type:String,
        required:true
    },
    preview:{
        type:String,
        required:true
    }
},{timestamps:true})


export const Paycard=mongoose.model("Paycard",paycardSchema);