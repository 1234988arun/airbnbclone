import mongoose, { model, models, Schema } from "mongoose";
import bcrypt from 'bcrypt';

const userSchema = new Schema({
    fullname:{
        type:String,
        required:true,
        trim:true,
        lowercase:true
    },
 email: {
  type: String,
  required: true,
  lowercase: true,
  trim: true,
  match: [
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    "Please enter a valid email address"
  ]
},
 password: {
  type: String,
  required: true,
  trim: true,
 match: [
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,64}$/,
  "Password must contain uppercase, lowercase, number, special character and be 8-64 characters long"
]
},
listing:[{
        type:mongoose.Schema.ObjectId,
        ref:"Listing"
}],
booking:[{
        type:mongoose.Schema.ObjectId,
        ref:"Booking"
}],

},{timestamps:true})

userSchema.pre('save',async function(){
    this.password  =  await bcrypt.hash(this.password.toString(),12) 
})

const userModel = models.User || model('User', userSchema)
// “Agar User model already bana hua hai, usko use karo; warna banao.”


export default userModel
