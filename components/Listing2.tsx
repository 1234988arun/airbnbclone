"use client";

import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { Button, message } from "antd";
import { useState } from "react";
import { MdBedroomParent, MdOutlinePool } from "react-icons/md";
import { GiFamilyHouse, GiWoodCabin } from "react-icons/gi";
import { SiHomeassistantcommunitystore } from "react-icons/si";
import { IoBedOutline } from "react-icons/io5";
import { FaTreeCity } from "react-icons/fa6";
import { BiBuildingHouse } from "react-icons/bi";
import { useListingContext } from "@/context/ListingContext";
import {useRouter} from "next/navigation";
import { useEffect } from "react";

const categories = [
  { name: "Villa", icon: GiFamilyHouse },
  { name: "Farm House", icon: MdBedroomParent },
  { name: "Pool House", icon: MdOutlinePool },
  { name: "Rooms", icon: GiWoodCabin },
  { name: "Flat", icon: SiHomeassistantcommunitystore },
  { name: "PG", icon: IoBedOutline },
  { name: "Cabin", icon: FaTreeCity },
  { name: "Shops", icon: BiBuildingHouse },
];

const Listing2 = () => {
  const { listingData, setListingData } = useListingContext();
  const [selectedCategory, setSelectedCategory] = useState("");
  
  const router = useRouter();

useEffect(() => {
  if (!listingData) {
    router.replace("/listingpage1");
  }
}, [listingData, router]);

  const selectCategory = (category: string) => {
     setSelectedCategory(category);

    if (!listingData) return;
   
    setListingData({
      ...listingData,
      category
    });
       
  }

  const handleSubmit =()=>{
    message.success("Listing Page 2 Added Successfully")
    router.replace("/listingpage3")
  }  
    return (
      <main className="min-h-screen bg-white px-4 py-5 sm:px-8 lg:h-screen lg:overflow-hidden lg:px-12 lg:py-8">
        <div className="mx-auto flex h-full max-w-6xl flex-col">
          <div className="mb-8 flex shrink-0 items-center justify-between gap-4 sm:mb-12">
            <Button aria-label="Go back" className="!flex !h-11 !w-11 !items-center !justify-center !rounded-full !border-0 !bg-[#e51b23] !text-white shadow-md hover:!bg-[#c9161d]" icon={<ArrowLeftOutlined />} onClick={()=>router.back()}/>
            <Button type="primary" className="!h-11 !rounded-full !border-0 !bg-[#e85d4a] !px-5 !text-sm !font-medium shadow-md hover:!bg-[#d95040] sm:!px-7">
              Set Your Category
            </Button>
          </div>

          <section className="flex min-h-0 flex-1 items-start justify-center overflow-y-auto py-2 sm:items-center sm:py-6">
            <div className="mx-auto flex w-full max-w-3xl flex-col items-center">
              <h1 className="mb-10 text-center text-2xl font-medium tracking-tight text-slate-900 sm:mb-14 sm:text-3xl">
                Which of these best describes your place?
              </h1>
              <div className="flex w-full flex-wrap justify-center gap-4 sm:gap-6">
                {categories.map(({ name, icon: Icon }) => {
                  const isSelected = selectedCategory === name;
                  return (
                    <button
                      key={name}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => selectCategory(name)}
                      className={`flex h-28 w-[calc(50%-0.5rem)] flex-col items-center justify-center rounded-xl border bg-white text-sm transition-all duration-200 sm:h-32 sm:w-40 ${isSelected ? "border-[#e85d4a] bg-[#fff5f2] text-[#d95040] shadow-md" : "border-slate-200 text-slate-900 shadow-sm hover:-translate-y-1 hover:border-[#e85d4a] hover:shadow-lg"}`}
                    >
                      <Icon className="mb-3 text-2xl sm:text-3xl" />
                      <span>{name}</span>
                    </button>
                  );
                })}
              </div>
              <Button onClick={handleSubmit}  type="primary"  disabled={!selectedCategory} className="!mt-8 !h-11 !w-36 !self-end !rounded-lg !border-0 !bg-[#e85d4a] !px-6 !text-sm !font-semibold shadow-md hover:!bg-[#d95040] disabled:!bg-slate-300 sm:!mt-10">
                Next <ArrowRightOutlined />
              </Button>
            </div>
          </section>
        </div>
      </main>
    );
    
  };

export default Listing2;
