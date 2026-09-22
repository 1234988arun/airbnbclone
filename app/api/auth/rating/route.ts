// import listingModel from "@/app/modal/listing.model";
// import connectDatabase from "@/lib/db.config";
// import { serverError } from "@/lib/server-error";
// import { NextRequest } from "next/server";


// export const POST = async(req:NextRequest)=>{
//     try{
//       await connectDatabase()
//     //   const { slug, rating } = await req.json();//body frontend se read krne ke lye 
//           const body = await req.json();
//     const { slug, rating } = body;

//       if (!slug || !rating) {
//       return Response.json(
//         { message: "slug and rating are required" },
//         { status: 400 }
//       );
//     }

//     const listing = await listingModel.findOneAndUpdate(
//     { slug },                    // KIS listing ko update karna hai?
//     { $set: { ratings: rating } }, // KYA update karna hai?
//     { new: true }                // updated document wapas do
//     );

// if (!listing) {
//       return Response.json(
//         { message: "Listing not found" },
//         { status: 404 }
//       );
// }

//     // await bookingModel.populate("listing", "slug");
// // Slug Listing ke andar pehle se hai; populate bas Booking ke listing reference se us slug ko access karne deta hai.
// // Haan. booking.listing.slug chahiye, isliye populate("listing", "slug") karna padega; sirf listing ID chahiye hoti toh populate ki zarurat nahi thi.
//     return Response.json(
//       {
//         message: "Rating updated successfully",
//         rating: listing.ratings,
//       },
//       { status: 200 }
//     );

//     }
//     catch(err){
//         serverError(err)
//     }
// }

import listingModel from "@/app/modal/listing.model";
import connectDatabase from "@/lib/db.config";
import { serverError } from "@/lib/server-error";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    await connectDatabase();

    const body = await req.json();
    const { slug, rating } = body;

    if (
      typeof slug !== "string" ||
      !slug.trim() ||
      typeof rating !== "number" ||
      rating < 1 ||
      rating > 5
    ) {
      return Response.json(
        {
          message: "A valid slug and rating between 1 and 5 are required",
        },
        { status: 400 }
      );
    }

    const listing = await listingModel.findOneAndUpdate(
      { slug: slug.trim() },
      { $set: { ratings: rating } },
      { new: true }
    );

    if (!listing) {
      return Response.json(
        { message: "Listing not found" },
        { status: 404 }
      );
    }

    return Response.json(
      {
        message: "Rating updated successfully",
        rating: listing.ratings,
      },
      { status: 200 }
    );
  } catch (err) {
    return serverError(err);
  }
};