import mongoose, { model, models, Schema } from "mongoose";

const listingSchema = new Schema({

    title:{
        type:String,
        required:true
    },

    description:{
        type:String,
        required:true
    },

    host:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },
    
    image1:{
        type:String,
        required:true
    },

    image2:{
        type:String,
        required:true
    },

    image3:{
        type:String,
        required:true
    },

    publicImage1: {
    type: String,
    },

    publicImage2: {
    type: String,
    },

    publicImage3: {
    type: String,
    },
    
    rent:{
        type:Number,
        required:true
    },

    city:{
        type:String,
        required:true
    },
    
    ratings:{
        type:Number,
        min:0,
        max:5,
        default:0
    },

    category:{
        type:String,
        required:true
    },

    landMark:{
        type:String,
        required:true   
    },

    isBooked:{
        type:Boolean,
        default:false   
    },
    slug: {
    type: String,
    unique: true,
    required: true
    }

},{timestamps:true})

const listingModel = models.Listing || model('Listing', listingSchema)
export default listingModel