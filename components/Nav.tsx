"use client";

import Image from "next/image";
import Link from "next/link";
import {
  MenuOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Dropdown,
  MenuProps,
  Modal,
} from "antd";
import {
  MdBedroomParent,
  MdOutlinePool,
  MdWhatshot,
} from "react-icons/md";
import {
  GiFamilyHouse,
  GiWoodCabin,
} from "react-icons/gi";
import {
  SiHomeassistantcommunitystore,
} from "react-icons/si";
import { IoBedOutline } from "react-icons/io5";
import { FaTreeCity } from "react-icons/fa6";
import { BiBuildingHouse } from "react-icons/bi";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

const categories = [
  { name: "Trending", icon: MdWhatshot },
  { name: "Villa", icon: GiFamilyHouse },
  { name: "Farm House", icon: MdBedroomParent },
  { name: "Pool House", icon: MdOutlinePool },
  { name: "Rooms", icon: GiWoodCabin },
  { name: "Flat", icon: SiHomeassistantcommunitystore },
  { name: "PG", icon: IoBedOutline },
  { name: "Cabins", icon: FaTreeCity },
  { name: "Shops", icon: BiBuildingHouse },
];

interface Listing {
  title?: string;
  city?: string;
  landMark?: string;
  slug?: string;
  bookedByUser?: boolean;
}

const Nav = () => {
  const router = useRouter();
  const session = useSession();

  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<Listing[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (!search.trim()) {
      setShowSuggestions(false);
      return;
    }
  

    const timer = setTimeout(async () => {
      try {
        const { data } = await axios.get(
          `/api/auth/listing?search=${encodeURIComponent(search)}`
        );

        setSuggestions(data?.listing?.slice(0, 5) || []);
        setShowSuggestions(true);
      } catch (err) {
        console.log(err);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const handleSuggestionClick = (item: Listing) => {
    setShowSuggestions(false);

    if (item.bookedByUser) {
      Modal.info({
        title: "Already Booked",
        content: "You have already booked this listing.",
        okText: "Okay",
      });

      return;
    }

    if (item.slug) {
      router.push(`/${item.slug}`);
    }
  };

  const handleSearch = () => {
    if (!search.trim()) return;

    setShowSuggestions(false);

    router.push(
      `/?search=${encodeURIComponent(search.trim())}`
    );
  };

  const items: MenuProps["items"] = !session.data
    ? [
        {
          key: "login",
          label: "Login",
          onClick: () => router.push("/login"),
        },
        {
          key: "signup",
          label: "SignUp/Create Account",
          onClick: () => router.push("/signup"),
        },
      ]
    : [
        {
          key: "logout",
          label: "Logout",
          onClick: () => {
            signOut({ callbackUrl: "/login" });
          },
        },
        { type: "divider" },
        {
          key: "listing",
          label: "My Listing",
          onClick: () => router.push("/mylisting"),
        },
        {
          key: "booking",
          label: "Check Booking",
          onClick: () => router.push("/my-booking"),
        },
      ];

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center px-2 pb-2 md:px-4 md:py-2 gap-2 md:gap-3 shadow-xs">

        {/* Logo */}
        <div className="shrink-0">
          <Image
            width={120}
            height={0}
            loading="eager"
            sizes="120px"
            priority
            alt="logo-image"
            src="/Airbnb-Logo.png"
          />
        </div>

        {/* Search */}
        <div className="block w-full md:w-[50%] relative">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => {
              if (search.trim()) {
                setShowSuggestions(true);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            placeholder="Any Where | Any Location | Any City"
            className="outline-none border border-gray-400 w-full px-3 py-2 pr-12 rounded-3xl text-sm"
          />

          <Button
            type="primary"
            danger
            shape="circle"
            className="!absolute top-1 right-2"
            icon={<SearchOutlined />}
            onClick={handleSearch}
          />

          {/* Suggestions */}
          {showSuggestions && search.trim() && (
            <div className="absolute top-12 left-0 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">

              {suggestions.length > 0 ? (
                suggestions.map((item) => (
                  <div
                    key={item.slug}
                    onClick={() =>
                      handleSuggestionClick(item)
                    }
                    className="px-4 py-3 cursor-pointer hover:bg-gray-100 border-b last:border-b-0"
                  >
                    <p className="font-medium text-sm">
                      {item.title}
                    </p>

                    <p className="text-xs sm:text-sm text-gray-500">
                      {item.city}
                      {item.landMark &&
                        ` • ${item.landMark}`}
                    </p>
                  </div>
                ))
              ) : (
                <div className="px-4 py-3 text-gray-500 text-sm">
                  No results found
                </div>
              )}

            </div>
          )}
        </div>

        {/* Right section */}
        <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">

          <Link
            href="/listingpage1"
            className="text-sm font-medium text-slate-700 transition-colors hover:text-red-500"
          >
            List your home
          </Link>

          <Dropdown
            menu={{
              items,
              style: { width: 150 },
            }}
            trigger={["hover"]}
            placement="bottomRight"
          >
            <Button className="!h-auto !rounded-3xl !outline-none !py-2 !flex !items-center !gap-2">
              <MenuOutlined />

              <Avatar
                size="small"
                className="!bg-red-500"
              >
                {session.data?.user?.email
                  ?.charAt(0)
                  .toUpperCase()}
              </Avatar>
            </Button>
          </Dropdown>
        </div>
      </div>

      {/* Categories */}
      <div className="flex md:justify-center sm:justify-start sm:gap-8 gap-5 md:gap-12 py-3 md:py-5 overflow-x-scroll md:overflow-x-auto w-full px-2 md:px-0 category-scroll">
        {categories.map((item) => {
          const Icon = item.icon;

          return (
            <span
              key={item.name}
              onClick={() =>
                router.push(`/?category=${item.name}`)
              }
              className="flex flex-col items-center cursor-pointer transition-transform duration-300 hover:scale-110 shrink-0"
            >
              <Icon className="text-xl md:text-3xl" />

              <p className="font-medium text-xs md:text-sm">
                {item.name}
              </p>
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default Nav;

