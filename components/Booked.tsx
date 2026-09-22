"use client";

import { clientError } from "@/lib/client-errot";
import { CheckOutlined, StarFilled, HomeOutlined } from "@ant-design/icons";
import { Button, Card, message } from "antd";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Booked = () => {
  const router = useRouter();
  const booking = JSON.parse(sessionStorage.getItem("booking") || "{}");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  

  const handleBooking = async (selectedRating: number) => {
      const slug = booking?.listing?.slug;

      if (!slug) {
        message.error("Listing information is missing. Please create a new booking.");
        return;
      }

      if (selectedRating < 1 || selectedRating > 5) {
        message.error("Please select a rating");
        return;
      }

      try {
        await axios.post("/api/auth/rating", {
          slug,
          rating: selectedRating,
        });

        message.success("Rating submitted successfully");
        sessionStorage.removeItem("booking");
        router.push("/");
      } catch (err) {
        clientError(err);
      }
};
  return (
    <main className="relative min-h-screen bg-slate-50 px-4 py-6 md:py-0 sm:px-6 lg:px-8">

      {/* Go Home */}
      <Button
        icon={<HomeOutlined />}
        onClick={() => router.push("/")}
        className="!absolute !right-4 !top-4 !rounded-md !h-10    !w-42 !border-0 !bg-[#e51b23] !text-white hover:!bg-[#c9161d] sm:!right-6"
      >
        Go Home
      </Button>

      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 pt-10">

        <Card className="w-full max-w-md !rounded-xl !shadow-md">
          <div className="flex flex-col items-center">

            <div className="mb-5 flex h-20 w-20 animate-[pulse_1.5s_ease-in-out_infinite] items-center justify-center rounded-full bg-green-100">
              <CheckOutlined className="!text-5xl !font-bold !text-green-500" />
            </div>

            <h1 className="mb-6 text-2xl font-semibold text-slate-900">
              Booking Confirmed
            </h1>

            <div className="w-full space-y-3 text-sm">

              <div className="flex items-center justify-between gap-4 border-b pb-3">
                <span className="shrink-0 font-medium text-slate-600">
                  BookingId
                </span>
                <span className="min-w-0 break-all text-right font-semibold text-slate-900">
                  {booking?._id}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 border-b pb-3">
                <span className="shrink-0 font-medium text-slate-600">
                  Owner Details
                </span>
                <span className="min-w-0 break-all text-right font-semibold text-slate-900">
                  {booking?.host?.email}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="font-medium text-slate-600">
                  TotalRent
                </span>
                <span className="font-semibold text-slate-900">
                  ₹{booking?.totalRent}
                </span>
              </div>

            </div>
          </div>
        </Card>

        <Card className="w-full max-w-lg !rounded-xl !shadow-md">
          <div className="flex flex-col items-center">
            <h2 className="mb-5 text-xl font-semibold text-slate-900">
              {rating} out of 5 Rating
            </h2>

            <div className="mb-6 flex gap-2">
        {[1, 2, 3, 4, 5].map((star, index) => {

            const starValue = index + 1;
           const isFilled = starValue <= (hoverRating || rating);

            return (
              <StarFilled
                key={star}
                onMouseEnter={() => setHoverRating(starValue)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(starValue)}
                className={`!text-3xl sm:!text-4xl cursor-pointer ${isFilled ? "!text-yellow-400" : "!text-zinc-400"}`}
              />
            );
          })}
            </div>
              <Button
                type="primary"
                disabled={rating === 0}
                className="!h-10 !w-42 !rounded-md !border-0 !bg-[#e51b23] !px-8 !text-sm !font-medium !text-white hover:!bg-[#c9161d]"
                onClick={() => handleBooking(rating)}
              >
                Submit
              </Button>
          </div>
        </Card>

      </div>
    </main>
  );
};

export default Booked;