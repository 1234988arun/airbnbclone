import mongoose, { model, models, Schema } from "mongoose";

const bookingSchema = new Schema({

    host:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },
    guest:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },

    listing: {
    type: mongoose.Schema.ObjectId,
    ref: "Listing",
    required: true
    },
    
    status:{
        type:String,
        enum:["booked", "cancel"],
        default:"booked"
    },
    checkIn:{
        type:Date,
        required:true
    },
    checkOut:{
        type:Date,
        required:true
    },
    totalRent:{
        type:Number,
        required:true
    }
},{timestamps:true})

const bookingModel = models.Booking || model('Booking',bookingSchema)
export default bookingModel