'use client'
import useSWR from "swr";

import ListingCard from "./ListingCard"
import { Empty, Skeleton } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { clientError } from "@/lib/client-errot";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";


interface Listing {
  title?: string;
  rent?: number;
  ratings?:number;
  slug?: string;
  category?: string;
  city?: string;
  landMark?: string;
  publicImage1?: string;
  publicImage2?: string;
  publicImage3?: string;
  isBooked?:boolean;
  host?:string;
  bookingId?: string;
}

interface ListingResponse {
  listing: Listing[];
}

interface ListingSliderProps {
  title: string;
  listings: Listing[];
  onCancelled: () => void;
}

const ListingSlider = ({ title, listings, onCancelled }: ListingSliderProps) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  const updateSliderButtons = () => {
    const slider = sliderRef.current;

    if (!slider) return;

    setIsAtStart(slider.scrollLeft <= 1);
    setIsAtEnd(slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 1);
  };

  useEffect(() => {
    const slider = sliderRef.current;

    if (!slider) return;

    updateSliderButtons();
    slider.addEventListener("scroll", updateSliderButtons, { passive: true });
    window.addEventListener("resize", updateSliderButtons);

    return () => {
      slider.removeEventListener("scroll", updateSliderButtons);
      window.removeEventListener("resize", updateSliderButtons);
    };
  }, [listings.length]);

  const moveSlider = (direction: "previous" | "next") => {
    const slider = sliderRef.current;

    if (!slider) return;

    const firstCard = slider.firstElementChild as HTMLElement | null;
    const cardWidth = firstCard?.offsetWidth || slider.clientWidth;
    const gap = 12;
    const cardsPerMove = window.innerWidth >= 1024 ? 5 : 1;
    const distance = (cardWidth + gap) * cardsPerMove;

    slider.scrollBy({
      left: direction === "next" ? distance : -distance,
      behavior: "smooth",
    });
  };

  return (
    <section className="mt-10 px-4 lg:px-0">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">
          {title}
        </h2>

        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            aria-label={`Previous ${title}`}
            disabled={isAtStart}
            onClick={() => moveSlider("previous")}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 transition hover:border-slate-900 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
          >
            <LeftOutlined />
          </button>
          <button
            type="button"
            aria-label={`Next ${title}`}
            disabled={isAtEnd}
            onClick={() => moveSlider("next")}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 transition hover:border-slate-900 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
          >
            <RightOutlined />
          </button>
        </div>
      </div>

      <div
        ref={sliderRef}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth scrollbar-none"
      >
        {listings.length ? (
          listings.map((listing, index) => (
            <div
              key={`${listing.slug || listing.title}-${index}`}
              className="w-[85%] shrink-0 snap-start sm:w-[48%] lg:w-[calc((100%-48px)/5)]"
            >
              <ListingCard
                bookingId={listing.bookingId}
                landMark={listing.landMark}
                isBooked={listing.isBooked}
                host={listing.host}
                category={listing.category}
                title={listing.title}
                ratings={listing.ratings}
                slug={listing.slug}
                rent={listing.rent}
                image1={listing.publicImage1}
                image2={listing.publicImage2}
                image3={listing.publicImage3}
                onCancelled={onCancelled}
              />
            </div>
          ))
        ) : (
          <div className="w-full py-8">
            <Empty description="No listings available" />
          </div>
        )}
      </div>
    </section>
  );
};

const Homepage = () => {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

    const fetcher = async (url: string): Promise<ListingResponse> => {
      try{
          const {data} = await axios.get(url)
          return data as ListingResponse;
      }
      catch(err){
      clientError(err);
      throw err;
      }
    }

  
    const filterCategory = category === "Trending" ? "":category

   const { data, isLoading, mutate } = useSWR<ListingResponse>(
  `/api/auth/listing${category ? `?category=${filterCategory}` : ""}`,
  fetcher
)

   const { data: sliderData } = useSWR<ListingResponse>(
    "/api/auth/listing",
    fetcher
  );

    

    if(isLoading) 
        return (
    <div>
        <Skeleton/>
    </div>
    )

  return (
    <div className="min-w-0 overflow-x-hidden">
        <div className="w-full max-w-[1000px] mx-auto">
          <div className="w-full grid px-4 lg:px-0 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5  gap-3">
            
            {
              data?.listing?.length? 
                data?.listing?.map(({title,rent, landMark, slug , isBooked, host, category, ratings, publicImage1,publicImage2,publicImage3, bookingId},index)=>(
                    <ListingCard key={index} bookingId={bookingId} landMark={landMark} isBooked={isBooked} host={host} category={category} title={title} ratings={ratings} slug={slug} rent={rent} image1={publicImage1} image2={publicImage2} image3={publicImage3}  onCancelled={() => mutate()}/>
                )):
                <div className="col-span-full py-32 mx-auto w-full  flex items-center justify-center">
                  <Empty description="Sorry, no category available"/>
                </div>
            }
          </div>

          <ListingSlider
            title="Available in Greater Noida this weekend"
            listings={sliderData?.listing || []}
            onCancelled={() => mutate()}
          />

          <ListingSlider
            title="Popular homes in mohali"
            listings={sliderData?.listing || []}
            onCancelled={() => mutate()}
          />

        </div>
        <footer className="mt-16 w-full bg-[#f7f7f7] px-6 py-10 text-sm text-slate-700 lg:px-8">
            <div className="grid gap-8 border-b border-slate-300 pb-8 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <h3 className="mb-3 font-semibold text-slate-900">Support</h3>
                <div className="space-y-2">
                  <p>Help Centre</p>
                  <p>Safety information</p>
                  <p>Cancellation options</p>
                </div>
              </div>

              <div>
                <h3 className="mb-3 font-semibold text-slate-900">Hosting</h3>
                <div className="space-y-2">
                  <p>List your home</p>
                  <p>Hosting resources</p>
                  <p>Responsible hosting</p>
                </div>
              </div>

              <div>
                <h3 className="mb-3 font-semibold text-slate-900">StayFinder</h3>
                <div className="space-y-2">
                  <p>About us</p>
                  <p>Newsroom</p>
                  <p>Careers</p>
                </div>
              </div>

              <div>
                <h3 className="mb-3 font-semibold text-slate-900">Discover</h3>
                <div className="space-y-2">
                  <p>Popular stays</p>
                  <p>Travel inspiration</p>
                  <p>Explore destinations</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
              <p>© 2026 StayFinder, Inc. All rights reserved.</p>
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                <span>Privacy</span>
                <span>Terms</span>
                <span>Sitemap</span>
              </div>
            </div>
        </footer>

    </div>
  )
}

export default Homepage
