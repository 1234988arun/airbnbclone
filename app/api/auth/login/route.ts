import connectDatabase from "@/lib/db.config";
import userModel from "@/app/modal/user.model";
import { NextRequest, NextResponse as res } from "next/server";
import bcrypt from 'bcrypt'
// import jwt from "jsonwebtoken"       
// import { cookies } from "next/headers";


import { serverError } from "@/lib/server-error";


export const POST = async(req:NextRequest)=>{
    try{
       await connectDatabase(); // Ensure the database is connected before proceeding
       const body = await req.json()
       const user = await userModel.findOne({email:body.email})
//        if(!user)
//         return res.json({message:"invalid credentials email or password is incorrect"},{status:401})
// // app/api/auth/login/route.ts

      if (!user) {
      return res.json(
      {
        message:body.provider === "google"? "Please sign up first before continuing with Google"
        : "Invalid credentials",},
        { status: body.provider === "google" ? 404 : 401 }
        );
        }
       const payload ={
        id: user._id.toString(),
        name:user.fullname,
        email:user.email
       }
        
       if(body.provider === 'google'){
        return res.json(payload)
       }
       const isPassword = await bcrypt.compare(body.password, user.password)

       if(!isPassword)
        return res.json({message:"invalid credentials email or password  is incorrect"},{status:401})  
        

       return res.json(payload)

    }

    catch(err){
            return serverError(err)
    }
    

// catch (err: unknown) {
//   if (axios.isAxiosError(err) && err.response?.status === 404) {
//     return "/auth/auth-failed?error=SignupRequired";
//   }

//   console.log(err);
//   return false;
// }
}

