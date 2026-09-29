
import listingModel from "@/app/modal/listing.model";
import userModel from "@/app/modal/user.model";
import uploadOnCloudinary from "@/lib/cloudinary";
import connectDatabase from "@/lib/db.config";
import {serverError} from "@/lib/server-error";
import { getToken } from "next-auth/jwt";
import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

import { NextRequest, NextResponse as res } from "next/server";
import bookingModel from "@/app/modal/booking.model";


export const POST = async (req: NextRequest) => {
  try {

    await connectDatabase(); // Ensure the database is connected before proceeding
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });
    
    if(!token?.id){
        return res.json({ message: "Unauthorized" }, { status: 401 });
    }

    const host = token?.id;
    const formData = await req.formData();
    const title = String(formData.get("title") || "");
    const description = String(formData.get("description") || "");
    const rent = Number(formData.get("rent"));
    const city = String(formData.get("city") || "");
    const landMark = String(formData.get("landMark") || "");
    const category = String(formData.get("category") || "");
    const slug = title .toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
    const image1 = formData.get("image1");
    const image2 = formData.get("image2");
    const image3 = formData.get("image3");


    const User = await userModel.findById(host)
     if(!User){
        return res.json({ message: "User not found" }, { status: 404 });
     }

    if(!title || !description || !rent || !city || !landMark) {
        return res.json({ message: "All fields are required" }, { status: 400 });
    }
    
    if (
            !(image1 instanceof File) ||
            !(image2 instanceof File) ||
            !(image3 instanceof File)
            ) {
            return res.json(
                { message: "All three images are required" },
                { status: 400 }
            );
            }
 
            const saveToPublic = async (file: File) => {
                    const uploadDir = path.join(
                        process.cwd(),
                        "public",
                        "uploads",
                        "listings"
                    );


                    await fs.mkdir(uploadDir, { recursive: true });
                    const extension = path.extname(file.name) || ".jpg";
                    const fileName = `${randomUUID()}${extension}`;
                    const filePath = path.join(uploadDir, fileName);

                    await fs.writeFile(
                        filePath,
                        Buffer.from(await file.arrayBuffer())
                    );

                    return `/uploads/listings/${fileName}`;
            }



    const uploadimage1 = await   uploadOnCloudinary(image1, "image1");
    const uploadimage2 = await   uploadOnCloudinary(image2, "image2");
    const uploadimage3 = await   uploadOnCloudinary(image3, "image3");   
    
    const [publicImage1, publicImage2, publicImage3] = await Promise.all([
        saveToPublic(image1),
        saveToPublic(image2),
        saveToPublic(image3),
        ]);

        console.log("TITLE:", title);
console.log("SLUG:", slug);

    const listing = await listingModel.create({
        title,
        description,    
        rent,
        city,
        landMark,
        slug,
        category,
        image1: uploadimage1,
        image2: uploadimage2,
        image3: uploadimage3,
        publicImage1,
        publicImage2,
        publicImage3,   
        host
    })

    const user =await userModel.findByIdAndUpdate(
        host,
        { $push: { listing: listing._id } },
        { new: true }
    )
    if(!user) {
        return res.json({ message: "User not found" }, { status: 404 });
    }

    return res.json({ message: "Listing added successfully", listing }, { status: 201 });
}

catch(err){
    return serverError(err)
}
}


// export const GET = async(req:NextRequest)=>{
//     try{
//         await connectDatabase()
     
//       const { searchParams } = new URL(req.url)
//       const category = searchParams.get("category")//for getting the category

//       const filter = category ? { category } : {};

//       const listings = await listingModel.find(filter).sort({createdAt:-1}).lean();
//       const bookings = await bookingModel.find({ status: "booked" }).select("_id listing").lean();//lean return plain js object
//       const bookingByListing = new Map(
//       bookings.map((booking) => [
//         booking.listing.toString(),
//         booking._id.toString(),
//       ])
//     );

//     const listing = listings.map((item) => ({
//       ...item,
//       bookingId: bookingByListing.get(item._id.toString()) || null,//idhr booking id ja rhi hai previous item ke sath
//     }));

//     return res.json({ listing });
//     }
//     catch(err){
//         return serverError(err)
//     }
// }


export const GET = async (req: NextRequest) => {
  try {
    await connectDatabase();

    const { searchParams } = new URL(req.url);

    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    const filter = {
      ...(category ? { category } : {}),
      ...(search
        ? {
            $or: [
              { title: { $regex: search, $options: "i" } },
              { city: { $regex: search, $options: "i" } },
              { landMark: { $regex: search, $options: "i" } },
            ],
          }
        : {}),
    };

    const listings = await listingModel
      .find(filter)
      .sort({ createdAt: -1 })
      .lean();

    const bookings = await bookingModel
      .find({ status: "booked" })
      .select("_id listing guest")
      .lean();

    const bookingByListing = new Map(
      bookings.map((booking) => [
        booking.listing.toString(),
        booking._id.toString(),
      ])
    );

    const userBookedListings = new Set(
      token?.id
        ? bookings
            .filter(
              (booking) => booking.guest.toString() === token.id
            )
            .map((booking) => booking.listing.toString())
        : []
    );

    const listing = listings.map((item) => ({
      ...item,
      bookingId:
        bookingByListing.get(item._id.toString()) || null,
      bookedByUser: userBookedListings.has(item._id.toString()),
    }));

    return res.json({ listing });
  } catch (err) {
    return serverError(err);
  }
};