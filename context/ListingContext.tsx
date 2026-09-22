"use client"

import axios from "axios";
import { createContext, useContext, useState } from "react";

type ListingData ={
    title?:string
    description?:string
    rent?:number
    city?:string
    host?:string
    landMark?:string
    category?:string
    image1?:string | File,
    image2?:string | File,
    image3?:string | File,
    ratings?:number
}

type ListingContextType = {
  listingData: ListingData | null;
  setListingData: React.Dispatch<React.SetStateAction<ListingData | null>>;
  handleViewCard: (slug: string) => Promise<void>;
  listingCard: ListingData | null; // ye add karo  
};


const ListingContext = createContext<ListingContextType | undefined>(undefined);

export const ListingProvider =({children}:{children:React.ReactNode})=>{
const [listingData,setListingData] = useState<ListingData | null>(null)
const [listingCard,setListingCard] = useState<ListingData | null>(null)

  const handleViewCard = async (slug: string) => {
    const {data} = await axios.get(`/api/auth/listing/${slug}`);
    setListingCard(data)
  };

return(
    <ListingContext.Provider value={{listingData,setListingData, handleViewCard, listingCard}}>
        {children}
    </ListingContext.Provider>
)
} 


export const useListingContext = () => {
    const context =  useContext(ListingContext)
    if(!context){
        throw new Error("useListingContext must be used within a ListingProvider")
    }
    return context
}

