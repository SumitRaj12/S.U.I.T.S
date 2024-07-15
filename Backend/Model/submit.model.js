import mongoose from "mongoose";

const Schema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    usn:{
        type:String,
        required:true
    },
    score:{
        type:Number,
        required:true
    },
    story:{
        type:String,
        required:true
    },
    accuracy:{
        type:Number,
        required:true
    }
},{timestamps:true});

export  const Submit = mongoose.model('Submit',Schema);