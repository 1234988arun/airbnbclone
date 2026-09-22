import userModel from "@/app/modal/user.model";
import { NextRequest, NextResponse as res } from "next/server";

import { serverError } from "@/lib/server-error";
import connectDatabase from "@/lib/db.config";

export const POST = async(req:NextRequest)=>{
    try{
      await connectDatabase(); // Ensure the database is connected before proceeding
       const body = await req.json()
       
       const user = await userModel.findOne({email:body.email})
       if(user)
        return res.json({message:"Email is already exist"},{status:409})

       await userModel.create(body)
       return res.json({message:'signup successfully'})
    }

    catch(err){
       return serverError(err)
    }
}