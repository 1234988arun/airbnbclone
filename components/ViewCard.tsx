  'use client'

  import { useEffect, useState } from "react";
  import Image from 'next/image'
  import { ArrowLeftOutlined, CloseOutlined, EnvironmentOutlined, BankOutlined,StarFilled} from "@ant-design/icons";
  import { useRouter } from "next/navigation";
  import { useListingContext } from "@/context/ListingContext";
  import { useSession } from "next-auth/react";
  import { Button, Form, Input, InputNumber, message, DatePicker } from "antd";
  import { clientError } from "@/lib/client-errot";
  import axios from "axios";
  import dayjs, { Dayjs } from "dayjs";
  import { compressListingImage } from "@/lib/compress-image";


  type ListingLocationValues = {
    title: string;
    description: string;
    image1: FileList;
    image2: FileList;
    image3: FileList;
    rent: number;
    city: string;
    ratings:number;
    landMark: string;
    category:string
  };

  const ViewCard = ({slug}:{slug:string}) => {
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const { handleViewCard, listingCard } = useListingContext()
    const [updateListing, setUpdateListing] = useState(false)
    const [bookingPopup, setBookingPopup] = useState(false)
    const [checkIn, setCheckIn] = useState<Dayjs | null>(null);
    const [checkOut, setCheckOut] = useState<Dayjs | null>(null);
  


    const { data: session } = useSession();

    useEffect(()=>{
      handleViewCard(slug)
    },[slug])


    
    const handleSubmit = async(values:ListingLocationValues)=>{
      try{
        setLoading(true)

        const formData = new FormData()
        formData.append('title', values.title || "")
        formData.append('description', values.description || "")
        formData.append('city', values.city || "")
        formData.append('rent', String(values.rent || ""))
        formData.append('landMark', values.landMark || "")
        const selectedImages = await Promise.all([
          values.image1?.[0] ? compressListingImage(values.image1[0]) : null,
          values.image2?.[0] ? compressListingImage(values.image2[0]) : null,
          values.image3?.[0] ? compressListingImage(values.image3[0]) : null,
        ]);

        selectedImages.forEach((image, index) => {
          if (image) formData.append(`image${index + 1}`, image, image.name);
        });

        await axios.put(`/api/auth/listing/${[slug]}`, formData)

        await handleViewCard(slug);

        message.success("Listing Added Successfully")
        setUpdateListing(false);
      }
      catch(err){
      clientError(err)
      }
      finally{
        setLoading(false)
      }
    }

    const DeleteListing = async()=>{
      try{
         setLoading(true)
         await axios.delete(`/api/auth/listing/${[slug]}`)
         message.success('Listing deleted successfully')
         router.push('/')
      }
      catch(err){
        clientError(err)
      }
      finally{
        setLoading(false)
      }
    }

    const nights = checkIn && checkOut? checkOut.diff(checkIn, "day"): 0;
    const bookingPrice = listingCard?.rent || 0;
    const subtotal = bookingPrice * nights;
    const airbnbCharge = subtotal * 0.07;
    const tax = (subtotal + airbnbCharge) * 0.05;
    const totalPrice = nights > 0? subtotal + airbnbCharge + tax: 0;  

    const createBooking = async(slug:string)=>{
      try{
            if (!checkIn || !checkOut) {
            message.error("Please select check-in and check-out dates");
            return;    
            }
            
          const payload = {
           checkIn: checkIn.format("YYYY-MM-DD"),
           checkOut: checkOut.format("YYYY-MM-DD"),
           totalRent: totalPrice,
           slug
           };

         
        const { data } = await axios.post(`/api/auth/booking`, payload);

        sessionStorage.setItem("booking", JSON.stringify(data.booking));


        message.success('Booking Added Successfully')
        
        setBookingPopup(false)
        router.push('/booked')
      }
 catch (err) {
  console.log("BOOKING ERROR:", err);
  clientError(err);
}

    }

    return (
      <div className="flex items-start justify-start gap-3 px-4 py-5 sm:gap-6 sm:px-15 md:gap-10">
        <div className="flex relative min-w-0 flex-1 flex-col gap-4">
        <Button type="primary" danger icon={<ArrowLeftOutlined />} className="!flex !h-10 !w-10 !shrink-0 !items-center !justify-center !p-0 !text-lg !rounded-full sm:!h-12 sm:!w-12 sm:!text-xl" onClick={()=>router.push('/')}/>
          <h1 className="text-xl sm:text-3xl md:text-4xl">Listing</h1>
          <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
              <div className="relative aspect-4/3 overflow-hidden rounded-xl">
              
              {listingCard?.image1 && (
                          <Image
                            fill
                            sizes="(max-width: 640px) 100vw, 50vw"
                            alt="listingImage"
                            className="object-cover"
                              src={typeof listingCard.image1 === "string" ? listingCard.image1 : ""}
                          />
                        )}
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-1 sm:grid-rows-2">
                <div className="relative aspect-4/3 overflow-hidden rounded-xl sm:aspect-auto">
                
                              {listingCard?.image2 && (
                          <Image
                            fill
                            sizes="(max-width: 640px) 100vw, 50vw"
                            alt="listingImage"
                            className="object-cover"
                            src={typeof listingCard.image2 === "string" ? listingCard.image2 : ""}
                          />
                        )}
                </div>
                <div className="relative aspect-4/3 overflow-hidden rounded-xl sm:aspect-auto">
                
                
                              {listingCard?.image3 && (
                          <Image
                            fill
                            sizes="(max-width: 640px) 100vw, 50vw"
                            alt="listingImage"
                            className="object-cover"
                            src={typeof listingCard.image3 === "string" ? listingCard.image3 : ""}
                          />
                        )}
                </div>
              </div>
          </div>
          <div className="flex flex-col gap-2">
              <h2 className="text-md sm:text-2xl md:text-2xl uppercase">{listingCard?.landMark}</h2>
              <h3 className="text-md sm:text-2xl md:text-2xl uppercase">{listingCard?.title}</h3>
              <p>{listingCard?.description}</p>
              <p className="text-sm sm:text-md md:text-xl uppercase">Rs {listingCard?.rent} / Day</p>
              

                {session?.user?.id === listingCard?.host ? 
                  <div className="flex gap-7">
                    <Button loading={loading} htmlType="submit" className="w-full h-10 sm:!w-100 !h-10" type="primary" danger onClick={()=>setUpdateListing(!updateListing)}>Edit Listing</Button>
                    <Button loading={loading} htmlType="submit" className="w-full h-10 sm:!w-100 !h-10" type="primary" danger onClick={DeleteListing}>Delete Listing</Button>
                  </div>:
                  <div>
                    <Button loading={loading} htmlType="submit" className="w-full h-10 sm:!w-100 !h-10" type="primary" danger onClick={()=>setBookingPopup(!bookingPopup)}>Book Listing</Button>
                  </div>

                }

  {updateListing && (
    <div className="absolute inset-0 z-50 bg-black/20 p-3 backdrop-blur-md sm:p-5">
      <div className="mx-auto flex w-full max-w-3xl flex-col rounded-2xl bg-zinc-800 p-4 shadow-2xl sm:p-6">

        {/* Header */}
        <div className="mb-4 flex shrink-0 items-center justify-between gap-3">
          <Button
            aria-label="Close"
            className="!flex !h-10 !w-10 !items-center !justify-center !rounded-full !border-0 !bg-rose-600 !text-white shadow-md sm:!h-11 sm:!w-11"
            icon={<CloseOutlined />}
            onClick={() => setUpdateListing(false)}
          />

          <Button
            type="primary"
            className="!h-10 !rounded-full !border-0 !bg-[#e85d4a] !px-4 !text-xs !font-medium shadow-md sm:!h-11 sm:!px-7 sm:!text-sm"
          >
            Update your details
          </Button>
        </div>

        {/* Form */}
        <div className="max-h-[75vh] overflow-y-auto pr-1">
          <Form<ListingLocationValues>
            layout="vertical"
            requiredMark={false}
            scrollToFirstError
            className="w-full"
            onFinish={handleSubmit}
              initialValues={{
    title: listingCard?.title,
    description: listingCard?.description,
    rent: listingCard?.rent,
    city: listingCard?.city,
    landMark: listingCard?.landMark,
    category: listingCard?.category,
  }}

          >
            <div className="grid gap-4">

              <Form.Item
                className="!mb-0"
                label={
                  <span className="font-medium text-white">
                    Title
                  </span>
                }
                name="title"
                rules={[
                  {
                    required: true,
                    message: "Please enter a title",
                  },
                ]}
              >
                <Input
                  className="!h-12 !rounded-xl"
                  placeholder="For example, Cozy 2BHK near the city center"
                />
              </Form.Item>

              <Form.Item
                className="!mb-0"
                label={
                  <span className="font-medium text-white">
                    Description
                  </span>
                }
                name="description"
                rules={[
                  {
                    required: true,
                    message: "Please add a description",
                  },
                ]}
              >
                <Input.TextArea
                  className="!rounded-xl"
                  autoSize={{
                    minRows: 4,
                    maxRows: 7,
                  }}
                  placeholder="Describe the rooms, amenities, views, and what guests will enjoy"
                />
              </Form.Item>

              {["image1", "image2", "image3"].map(
                (imageName, index) => (
                  <Form.Item
                    key={imageName}
                    className="!mb-0"
                    label={
                      <span className="font-medium text-white">
                        Image {index + 1}(optional) (for example, living room or bedroom)
                      </span>
                    }
                    name={imageName}
                    getValueFromEvent={(e) => e.target.files}
                    getValueProps={() => ({})}
                    
                  >
                    <Input
                      type="file"
                      accept="image/*"
                      className="!h-12 !rounded-xl"
                    />
                  </Form.Item>
                )
              )}

              <Form.Item
                label={
                  <span className="font-medium text-white">
                    Monthly rent
                  </span>
                }
                name="rent"
                rules={[
                  {
                    required: true,
                    message: "Please enter the rent",
                  },
                ]}
                className="!mb-0"
              >
                <InputNumber
                  className="!h-12 !w-full !rounded-xl"
                  min={1}
                  placeholder="For example, 25000"
                  prefix={
                    <span className="mr-2 text-[#e85d4a]">
                      ₹
                    </span>
                  }
                />
              </Form.Item>

              <Form.Item
                label={
                  <span className="font-medium text-white">
                    City
                  </span>
                }
                name="city"
                className="!mb-0"
                rules={[
                  {
                    required: true,
                    message: "Please enter the city",
                  },
                ]}
              >
                <Input
                  className="!h-12 !rounded-xl"
                  prefix={
                    <EnvironmentOutlined className="mr-2 text-[#e85d4a]" />
                  }
                  placeholder="For example, Dehradun"
                />
              </Form.Item>

              <Form.Item
                className="!mb-0"
                label={
                  <span className="font-medium text-white">
                    Nearby landmark
                  </span>
                }
                name="landMark"
                rules={[
                  {
                    required: true,
                    message: "Please enter a nearby landmark",
                  },
                ]}
              >
                <Input
                  className="!h-12 !rounded-xl"
                  prefix={
                    <BankOutlined className="mr-2 text-[#e85d4a]" />
                  }
                  placeholder="For example, near Clock Tower"
                />
              </Form.Item>

              <Button
                htmlType="submit"
                type="primary"
                loading={loading}
                block
                className="!sm:mt-5 !h-12 !rounded-xl !border-0 !bg-[#e85d4a] !text-base !font-semibold shadow-lg hover:!bg-[#d95040]"
              >
                Update Listing
              </Button>

            </div>
          </Form>
        </div>

      </div>
    </div>
  )}


{bookingPopup && (
  <div className="fixed inset-0 z-[100] overflow-y-auto bg-white/80 p-3 backdrop-blur-md sm:p-6">

    <div className="mx-auto flex min-h-full w-full max-w-6xl items-start justify-center py-4 sm:py-8">

      <div className="grid  w-full grid-cols-1 gap-4 lg:grid-cols-2">

        {/* LEFT CARD */}
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-xl sm:p-6">

          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold sm:text-2xl">
              Confirm & Book
            </h2>

            <Button
              type="text"
              shape="circle"
              icon={<CloseOutlined />}
              onClick={() => setBookingPopup(false)}
              className="!text-lg"
            />
          </div>

          <div className="my-5 border-t border-gray-200" />

          <h3 className="mb-5 text-lg font-semibold">
            Your Trip
          </h3>

          {/* Check In */}
          <div className="mb-5 flex items-center justify-between gap-4">
            <span className="font-medium text-gray-700">
              CheckIn
            </span>

            <DatePicker
              className="!h-11 !w-[200px]  md:!w-[270px] !rounded-xl"
              placeholder="Select date"
                minDate={dayjs()}
                maxDate={checkOut ? checkOut.subtract(1, "day") : undefined}

              onChange={(date) => setCheckIn(date)}
            />
          </div>

          {/* Check Out */}
          <div className="flex items-center justify-between gap-4">
            <span className="font-medium text-gray-700">
              CheckOut
            </span>

            <DatePicker
              className="!h-11 !w-[200px] md:!w-[270px] !rounded-xl"
              placeholder="Select date"
              minDate={checkIn ? checkIn.add(1, "day") : dayjs()}
              onChange={(date) => setCheckOut(date)}
            />
          </div>

          <Button
            type="primary"
            block
            className="!mt-8 !h-12 !rounded-xl !bg-[#e85d4a] !text-base !font-semibold"
            onClick={() => createBooking(slug)}
          >
            Book Now
          </Button>

        </div>


        {/* RIGHT CARD */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-xl">

          {/* Listing Header */}
          <div className="flex gap-4 border-b border-gray-200 p-4 sm:p-5">

            <div className="relative h-24 w-28 shrink-0 overflow-hidden rounded-xl sm:h-28 sm:w-32">
              {typeof listingCard?.image1 === "string" && (
                <Image
                  src={listingCard.image1}
                  alt={listingCard.title || "Listing"}
                  fill
                  className="object-cover"
                />
              )}
            </div>

            <div className="min-w-0">
              <h2 className="line-clamp-2 text-base font-semibold sm:text-lg">
                {listingCard?.landMark}
              </h2>
              <p>{listingCard?.category}</p>

              <div className="mt-2 flex items-center gap-1 text-sm">
                <StarFilled className="!text-yellow-500" />
                <span className="font-medium">
                  {listingCard?.ratings}
                </span>
              </div>
            </div>

          </div>


          {/* Price Details */}
          <div className="p-4 sm:p-6">

            <h3 className="mb-5 text-lg font-semibold">
              Booking Price
            </h3>

            <div className="space-y-4">

              <h4 className="flex justify-between text-sm font-normal text-gray-700">
                <span>
                  ₹ {bookingPrice} × {nights} nights
                </span>
                <span>
                  ₹ {bookingPrice * nights}
                </span>
              </h4>

              <h4 className="flex justify-between text-sm font-normal text-gray-700">
                <span>Tax</span>
                <span>₹ {tax}</span>
              </h4>

              <h4 className="flex justify-between text-sm font-normal text-gray-700">
                <span>Airbnb Charge</span>
                <span>₹ {airbnbCharge}</span>
              </h4>

            </div>

            <div className="my-6 border-t border-gray-200" />

            <h1 className="flex justify-between text-xl font-bold sm:text-2xl">
              <span>Total Price</span>
              <span>₹ {totalPrice}</span>
            </h1>

          </div>

        </div>

      </div>

    </div>
  </div>
)}


          </div>
        </div>

      </div>
    )
  }

  export default ViewCard
