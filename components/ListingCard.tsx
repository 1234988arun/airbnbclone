"use client";

import { CheckOutlined, CloseCircleFilled, StarFilled} from "@ant-design/icons";
import { Modal, Card, message } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FC, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { clientError } from "@/lib/client-errot";
import axios from "axios";

interface ListingCardInterface {
  title?: string;
  image1?: string;
  slug?:string;
  ratings?:number;
  image2?: string;
  image3?: string;
  landMark?: string;
  category?: string;
  rent?: number;
  isBooked?:boolean;
  host?:string;
  bookingId?:string;
  onCancelled?: () => void;
}

const ListingCard: FC<ListingCardInterface> = ({
  landMark = "add where this listing belongs too",
  title = "title1",
  rent = 0,
  slug,
  image1,
  image2,
  image3,
  ratings,
  isBooked,
  host,
  bookingId,
  onCancelled,
}) => {

  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentImage, setCurrentImage] = useState(0);
  
  const images = [image1, image2, image3];
  
  useEffect(() => {
    const interval = setInterval(() => {
      
      const nextImage = (currentImage + 1) % images.length;
      
      if (scrollRef.current) {
        scrollRef.current.scrollTo({
          left: scrollRef.current.clientWidth * nextImage,
          behavior: "smooth",
        });
      }
      
      setCurrentImage(nextImage);
      
    }, 3000);
    
    return () => clearInterval(interval);
  }, [currentImage, images.length]);
  
  const router = useRouter()
const { data: session } = useSession();

const handleCancel = async (bookingId: string) => {
  try {
    await axios.delete("/api/auth/booking", {
      data: { bookingId },
    });

    message.success("Booking cancelled successfully");
  } catch (err) {
    clientError(err);
    throw err;
  }
};
  return (
    <Card
  className="overflow-hidden !mt-2"
  cover={
    <div className="relative w-full overflow-hidden cursor-pointer">

          {/* Wishlist */}
  <div className="absolute left-0 top-3 z-10 flex flex-col gap-2">

  {isBooked && (
    <div className="flex w-fit items-center gap-1 rounded-md bg-white px-2 py-2 text-xs font-medium text-green-500 shadow-md">
      <CheckOutlined />
      <span>Booked</span>
    </div>
  )}

  {isBooked && session?.user?.id === host && (
    <button
      type="button"
      className="flex w-fit items-center gap-2 cursor-pointer rounded-md bg-white px-3 py-2 text-xs font-medium text-red-500 shadow-md"
     onClick={(event)=>{
      event.stopPropagation()
       Modal.confirm({
        title: "Cancel Booking",
        content: "Are you sure you want to cancel this booking?",
        okText: "Yes",
        cancelText: "No",
        onOk: async () => {
          if (!bookingId) {
            // message.error("Booking ID is missing");
            return;
          }

          await handleCancel(bookingId);
         if (onCancelled) onCancelled();
        },
      });
     }}
    >
      <CloseCircleFilled />
      <span>Cancel Booking</span>
    </button>
  )}

</div>

      <div
        ref={scrollRef}
        className="flex h-full w-full overflow-x-auto !scroll-smooth scrollbar-none snap-x snap-mandatory"
        onClick={() => {
  if (!slug) return;

  const isHost = session?.user?.id === host;

  if (isBooked && !isHost) return;

  router.push(`/${slug}`);
}}
      >
          <div className="relative h-[150px] min-w-full shrink-0 snap-center sm:h-[200px]">
            <Image
              src={image1 || ""}
              alt={title}
              fill
              sizes="(max-width: 640px) 85vw, (max-width: 1024px) 48vw, 20vw"
              className="rounded-xl sm:rounded-2xl object-cover"
            />
          </div>
          <div className="relative h-[150px] min-w-full shrink-0 snap-center sm:h-[200px]">
            <Image
              src={image2 || ""}
              alt={title}
              fill
              sizes="(max-width: 640px) 85vw, (max-width: 1024px) 48vw, 20vw"
              className="rounded-xl sm:rounded-2xl object-cover"
            />
          </div>
          <div className="relative h-[150px] min-w-full shrink-0 snap-center sm:h-[200px]">
            <Image
              src={image3 || ""}
              alt={title}
              fill
              sizes="(max-width: 640px) 85vw, (max-width: 1024px) 48vw, 20vw"
              className="rounded-xl sm:rounded-2xl object-cover"
            />
          </div>
      </div>
    </div>
  }
>
  <h2 className="text-md font-semibold flex items-center justify-between">
<span>
  {landMark?.length > 15 ? `${landMark.slice(0, 15)}...` : landMark}
</span>

  <span className="flex items-center gap-1 text-sm">
    <StarFilled className="!text-yellow-500" />
    {ratings}
  </span>
</h2>

  <p className="text-[12px] text-gray-500 font-medium">
    {title}
  </p>

  <p className="mt-2 text-[12px] text-gray-500 font-medium">
    ₹{rent}/day
  </p>
</Card>
  );
};

export default ListingCard;