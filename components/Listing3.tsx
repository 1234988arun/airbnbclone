'use client'

import { useListingContext } from "@/context/ListingContext";
import {Button, message} from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from 'next/image'
import { ArrowLeftOutlined} from "@ant-design/icons";
import axios from "axios";
import { clientError } from "@/lib/client-errot";
import { compressListingImage } from "@/lib/compress-image";


const Listing3 = () => {
  const {listingData} = useListingContext()
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(()=>{
    if(!listingData){
      router.replace("/listingpage1")
    }
  },[listingData,router])


   const title = listingData?.title
   const description = listingData?.description
   const category = listingData?.category
   const landMark = listingData?.landMark
   const rent = listingData?.rent
   const city = listingData?.city
   const image1 = listingData?.image1
   const image2 = listingData?.image2
   const image3 = listingData?.image3
  const image1Url = image1 instanceof File ? URL.createObjectURL(image1) : "";
  const image2Url = image2 instanceof File ? URL.createObjectURL(image2) : "";
  const image3Url = image3 instanceof File ? URL.createObjectURL(image3) : "";
   
   const handleSubmit = async()=>{
     try{
        setLoading(true)
       const formData = new FormData()
       formData.append('title', title || "")
       formData.append('description', description || "")
       formData.append('city', city || "")
       formData.append('rent', String(rent || ""))
      formData.append('landMark', landMark || "")
       formData.append('category', category || "")     
       if (!(image1 instanceof File) || !(image2 instanceof File) || !(image3 instanceof File)) {
         message.error("Please select all three images on Listing Page 1");
         router.replace("/listingpage1");
         return;
       }

       const [compressedImage1, compressedImage2, compressedImage3] = await Promise.all([
         compressListingImage(image1),
         compressListingImage(image2),
         compressListingImage(image3),
       ]);
       formData.append("image1", compressedImage1, compressedImage1.name)
       formData.append("image2", compressedImage2, compressedImage2.name)
       formData.append("image3", compressedImage3, compressedImage3.name)

      const {data} =await axios.post('/api/auth/listing', formData)
       console.log("api response",data)
       
       message.success("Listing Added Successfully")
       router.replace("/")
     }
     catch(err){
     clientError(err)
     }
     finally{
       setLoading(false)
     }
  }
  return (
    <div className="flex items-start justify-start gap-3 px-4 py-5 sm:gap-6 sm:px-15 md:gap-10">
      <div className="flex min-w-0 flex-1 flex-col gap-4">
      <Button type="primary" danger icon={<ArrowLeftOutlined />} className="!flex !h-10 !w-10 !shrink-0 !items-center !justify-center !p-0 !text-lg !rounded-full sm:!h-12 sm:!w-12 sm:!text-xl" onClick={()=>router.push("/listingpage1")}/>
         <h1 className="text-xl sm:text-3xl md:text-4xl">{title}</h1>
         <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
             <div className="relative aspect-4/3 overflow-hidden rounded-xl">
             {
              image1Url &&
               <Image fill sizes="(max-width: 640px) 100vw, 50vw" alt="listingImage" className="object-cover" src={image1Url} />
             }
             </div>
             <div className="grid grid-cols-2 gap-2 sm:grid-cols-1 sm:grid-rows-2">
               <div className="relative aspect-4/3 overflow-hidden rounded-xl sm:aspect-auto">
               {
                image2Url &&
                <Image fill sizes="(max-width: 640px) 50vw, 50vw" alt="listingImage" className="object-cover" src={image2Url} />
               }
               </div>
               <div className="relative aspect-4/3 overflow-hidden rounded-xl sm:aspect-auto">
               {
                image3Url &&
                <Image fill sizes="(max-width: 640px) 50vw, 50vw" alt="listingImage" className="object-cover" src={image3Url}/>
               }
               </div>
             </div>
         </div>
         <div className="flex flex-col gap-2">
            <h2 className="text-md sm:text-2xl md:text-2xl uppercase">{landMark}</h2>
            <h3 className="text-md sm:text-2xl md:text-2xl uppercase">{category}</h3>
            <p className="text-sm sm:text-md md:text-xl uppercase">Rs {rent} / Day</p>
            <Button loading={loading} htmlType="submit" className="w-full h-10 sm:!w-100 !h-10" type="primary" danger onClick={handleSubmit}>Add Listing</Button>
         </div>
      </div>
    </div>
  )
}

export default Listing3
