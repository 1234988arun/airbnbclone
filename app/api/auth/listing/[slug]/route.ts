import listingModel from "@/app/modal/listing.model"
import uploadOnCloudinary from "@/lib/cloudinary"
import connectDatabase from "@/lib/db.config"
import { serverError } from "@/lib/server-error"
import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse as res } from "next/server"

const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024;

export const GET = async(req:NextRequest,  {params}:{params:Promise<{slug:string}>})=>{
    try{
        await connectDatabase()
         const {slug} = await params

         const listing =  await listingModel.findOne({ slug })
         if(!listing)
            return res.json({message:"listing not found"},{status:404})

         return res.json(listing,{status:200})

    }
    catch(err){
        return serverError(err)
    }
}



export const PUT = async(req:NextRequest, { params }: { params: Promise<{ slug: string }> })=>{
          try{
            await connectDatabase()
            
            const token = await getToken({
                req,
                secret:process.env.NEXTAUTH_SECRET
            })
            if(!token?.id){
                return res.json({message:"Unauthorized"},{status:401})
            }

           const {slug} = await params;

           
           const formData = await req.formData();
           const title = formData.get("title") as string;
           const description = formData.get("description") as string;
           const city = formData.get("city") as string;
           const rent = formData.get("rent") as string;
           const landMark= formData.get("landMark") as string;
           const image1 = formData.get("image1");
           const image2 = formData.get("image2");
           const image3 = formData.get("image3");

                     const uploadedImages = [image1, image2, image3].filter(
                         (image): image is File => image instanceof File
                     );
                     if (uploadedImages.some((image) => !image.type.startsWith("image/") || image.size > MAX_IMAGE_SIZE_BYTES)) {
                         return res.json(
                             { message: "Each image must be an image file no larger than 2 MB" },
                             { status: 400 }
                         );
                     }

           const updateimage1 = image1 instanceof File
            ? await uploadOnCloudinary(image1, "image1")
            : null;

           const updateimage2 = image2 instanceof File
            ? await uploadOnCloudinary(image2, "image2")
            : null;

           const updateimage3 = image3 instanceof File
           ? await uploadOnCloudinary(image3, "image3")
            : null;

           const updateData = {
            title,
            description,
            city,
            rent,
            landMark,
            ...(updateimage1 && { image1: updateimage1 }),
            ...(updateimage2 && { image2: updateimage2 }),
            ...(updateimage3 && { image3: updateimage3 }),
            };
           
           const updateListing = await listingModel.findOneAndUpdate({ slug, host: token.id },{ $set: updateData },{ new: true });
           if(!updateListing)
            return res.json({message:"Listing not found"},{status:404});

           return res.json({message:"listing updated successfully",updateListing})
      
          }
          catch(err){
              return serverError(err)
          }

      }


export const DELETE = async(req:NextRequest, { params }: { params: Promise<{ slug: string }> })=>{
    try{

    await connectDatabase()

     const token = await getToken({
                req,
                secret:process.env.AUTH_SECRET
            })
            if(!token?.id){
                return res.json({message:"Unauthorized"},{status:401})
            }

     const {slug} = await params

     await listingModel.findOneAndDelete({slug,host: token.id});
      
     return res.json({message:"listing deleted successfully"})
    }
    catch(err){
        return serverError(err)
    }
}



// export const DELETE = async(req:NextRequest, context:IdInterface)=>{
//     try{
//         const session = await  getServerSession(authOptions)
//         if(!session)
//             return res.json({message:"unauthorized"},{status:401})
               
//         if(session.user.role !== 'user')
//             return res.json({message:"unauthorized"}, {status:401})

//          const {id} = await context.params

//          const cart = await CartModel.findByIdAndDelete(id)
//          if(!cart){
//             return res.json({message:"order not found"},{status:404})
//          } 

//          return res.json(cart)
         
//     }
//     catch(err){
//        return  ServerCatchError(err)
//     }
// }