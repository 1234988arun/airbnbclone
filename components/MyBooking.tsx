"use client";

import {
  ArrowLeftOutlined,
  CheckCircleFilled,
  StarFilled,
} from "@ant-design/icons";
import { Button, Card, Empty, Skeleton } from "antd";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { clientError } from "@/lib/client-errot";

interface BookingListing {
  image1?: string;
  image2?: string;
  image3?: string;
  title?: string;
  landMark?: string;
  ratings?: number;
  rent?: number;
}

interface Booking {
  _id: string;
  listing?: BookingListing;
}

interface UserBookingsResponse {
  booking: Booking[];
}

const MyBooking = () => {
  const router = useRouter();

  const fetcher = async (url: string): Promise<UserBookingsResponse> => {
    try {
      const { data } = await axios.get(url);
      return data as UserBookingsResponse;
    } catch (err) {
      clientError(err);
      throw err;
    }
  };

  const { data, isLoading } = useSWR<UserBookingsResponse>("/api/auth/user", fetcher);

  if (isLoading) {
    return (
      <div className="p-6">
        <Skeleton />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white px-4 py-6 sm:px-6 md:px-8 lg:px-12">
      <div className="mx-auto w-full max-w-5xl">

        {/* Heading */}
        <div className="relative mb-8 flex items-center justify-center">
          <Button
            aria-label="Go back"
            className="!absolute !left-0 !flex !h-10 !w-10 !items-center !justify-center !rounded-full !border-0 !bg-[#e51b23] !p-0 !text-white shadow-md hover:!bg-[#c9161d]"
            icon={<ArrowLeftOutlined />}
            onClick={() => router.push("/")}
          />

          <h1 className="text-2xl font-medium tracking-tight text-slate-900 sm:text-3xl">
            MY BOOKING
          </h1>
        </div>

        {/* No Booking */}
        {data?.booking?.length === 0 ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <Empty description="Sorry, no booking available" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data?.booking?.map((booking) => (
              <BookingCard
                key={booking._id}
                listing={booking.listing}
                bookingId={booking._id}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

const BookingCard = ({
  listing,
  bookingId,
}: {
  listing?: BookingListing;
  bookingId: string;
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const [currentImage, setCurrentImage] = useState(0);

  const images = [
    listing?.image1,
    listing?.image2,
    listing?.image3,
  ].filter((image): image is string => Boolean(image));

  useEffect(() => {
    const interval = setInterval(() => {
      if (images.length < 2) return;

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

  const landmark = listing?.landMark || "";

  return (
    <Card
      className="mx-auto !mt-2 w-full max-w-[330px] overflow-hidden"
      cover={
        <div className="relative w-full overflow-hidden">

          {/* Booked Badge */}
          <div className="absolute right-3 top-3 z-10 flex items-center gap-1 rounded-full bg-green-500 px-3 py-1.5 text-sm font-medium text-white shadow-md">
            <CheckCircleFilled />
            <span>Booked</span>
          </div>


          {/* Images */}
          <div
            ref={scrollRef}
            className="flex w-full overflow-x-auto !scroll-smooth scrollbar-none snap-x snap-mandatory"
          >
            {images.map((image, index) => (
              <div
                key={index}
                className="relative h-[210px] min-w-full shrink-0 snap-center sm:h-[230px]"
              >
                <Image
                  src={image || ""}
                  alt={listing?.title || "Listing"}
                  fill
                  sizes="(max-width: 640px) 100vw, 330px"
                  className="rounded-xl object-cover sm:rounded-2xl"
                />
              </div>
            ))}
          </div>
        </div>
      }
    >
      {/* Landmark + Rating */}
      <h2 className="flex items-center justify-between text-md font-semibold">
        <span>
          {landmark.length > 15 ? `${landmark.slice(0, 15)}...` : landmark}
        </span>

        <span className="flex items-center gap-1 text-sm">
          <StarFilled className="!text-yellow-500" />
          {listing?.ratings}
        </span>
      </h2>

      {/* Title */}
      <p className="text-[12px] font-medium text-gray-500">
        {listing?.title}
      </p>

      {/* Rent */}
      <p className="mt-2 text-[12px] font-medium text-gray-500">
        ₹{listing?.rent}/day
      </p>
    </Card>
  );
};

export default MyBooking;