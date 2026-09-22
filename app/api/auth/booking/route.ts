import bookingModel from "@/app/modal/booking.model"
import listingModel from "@/app/modal/listing.model"
import userModel from "@/app/modal/user.model"
import connectDatabase from "@/lib/db.config"
import { serverError } from "@/lib/server-error"
import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse as res } from "next/server"


export const POST = async(req:NextRequest)=>{

    try{
    await connectDatabase()
    
    const token = await getToken({
      req,
      secret: process.env.AUTH_SECRET,
    });

    if (!token?.id) {
      return res.json({ message: "Unauthorized" }, { status: 401 });
    }

    // const {slug} = await params //URL se listing ka slug nikalta hai.
    // const body = await req.json() //frontend se bheja hua request data read karta ha
    const body = await req.json();

    const {checkIn,checkOut,totalRent,slug} = body

      const listing = await listingModel.findOne({slug})
       if(!listing)
       return res.json({message:"listing not found"},{status:404})

      if(new Date(checkIn) >= new Date(checkOut)){
        return res.json({message:"Invalid checkIn/checkOut date"},{status:400})
      }

      if(listing.isBooked){
        return res.json({message:"Listing is already Booked"},{status:400})
      }
      
      const booking = await bookingModel.create({
        checkIn,checkOut,totalRent,  slug, host:listing.host, guest:token?.id, listing:listing._id
      })

      await booking.populate([
        {
          path: "host",
          select: "email",
        },
        {
          path: "listing",
          select: "slug",
        },
      ]);


      const User = await userModel.findOneAndUpdate(
        {_id:token.id},
        { $push: { booking: booking._id } },
        {new:true}
        );
      
      if(!User)
       return res.json({message:"listing not found"},{status:404})

      listing.isBooked = true;
      await listing.save();
     
      
      return res.json(
       {
        message: "Listing booked successfully",
        booking,
       },
       { status: 201 }
     );
    }
    catch(err){
        return serverError(err)
    }
}

export const DELETE = async(req:NextRequest)=>{

      try{

        await connectDatabase() 
        
        const token = await getToken({
          req,
          secret: process.env.AUTH_SECRET,
        });

        if (!token?.id) {
          return res.json({ message: "Unauthorized" }, { status: 401 });
        }
        
        const { bookingId } = await req.json();
         
        if(!bookingId){
          return res.json({message:"bookingId is required"},{status:400})
        }

        const booking = await bookingModel.findOne({
          _id: bookingId,
          host: token.id,
        });
        
        if (!booking) {
          return res.json(
            { message: "Booking not found or your are not the host" },
            { status: 404 }
          );
        }

      await bookingModel.findByIdAndDelete(booking._id);

        await listingModel.findByIdAndUpdate(
          booking.listing,
          { isBooked: false }
        );

        await userModel.updateOne({ _id: booking.guest },{ $pull: { booking: booking._id } });

        return res.json(
          { message: "Booking cancelled successfully" },
          { status: 200 }
        );

        
      }
      catch(err){
    return serverError(err)
      }
}