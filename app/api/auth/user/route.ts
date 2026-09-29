import userModel from "@/app/modal/user.model"
import connectDatabase from "@/lib/db.config"
import { serverError } from "@/lib/server-error"
import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse as res } from "next/server"
// import "@/app/modal/booking.model";
import "@/app/modal/listing.model";
import "@/app/modal/booking.model";
export const GET = async(req:NextRequest)=>{
    try{
     await connectDatabase()

     const token = await getToken({
        req,
        secret:process.env.AUTH_SECRET
     })
     if(!token?.id){
        return res.json({message:"Unauthorized"},{status:401})
     }

     const userId = token?.id;
   //   const user =   await userModel.findById(userId).select("-password").populate("listing")
     const user = await userModel.findById(userId).select("-password").populate('listing').populate({path: "booking",populate: {path: "listing",}});
     if(!user){
        return res.json({message:""}, {status:404})
     }

     return res.json(user)
    }
    catch(err){
        return serverError(err)
    }
}