'use client'

import { clientError } from "@/lib/client-errot";
import { ArrowLeftOutlined, BankOutlined, CloseOutlined, EnvironmentOutlined, StarFilled } from "@ant-design/icons";
import { Button, Empty, Form, Input, InputNumber, Modal, Skeleton, message } from "antd";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { useState } from "react";
import { compressListingImage } from "@/lib/compress-image";

interface ListingFormValues {
  title: string;
  description: string;
  image1?: FileList;
  image2?: FileList;
  image3?: FileList;
  rent: number;
  city: string;
  landMark: string;
}

interface UserListing {
  _id: string;
  title: string;
  description: string;
  image1: string;
  category?: string;
  city?: string;
  landMark?: string;
  rent?: number;
  ratings?: number;
  isBooked?: boolean;
  slug: string;
}

interface UserResponse {
  listing: UserListing[];
}


const MyListing = () => {
  const router = useRouter();
  const [editingListing, setEditingListing] = useState<UserListing | null>(null);
  const [loading, setLoading] = useState(false);

    
    const fetcher = async (url: string): Promise<UserResponse> => {
      try{
        const {data} = await axios.get(url)
        console.log(data)
        return data  
      }
      catch(err){
        clientError(err)
        throw err;
      }
    }

    const { data, isLoading, mutate } = useSWR<UserResponse>('/api/auth/user', fetcher)
    console.log(data)

    const handleEdit = async (values: ListingFormValues) => {
      if (!editingListing) return;

      try {
        setLoading(true);
        const formData = new FormData();
        formData.append("title", values.title || "");
        formData.append("description", values.description || "");
        formData.append("city", values.city || "");
        formData.append("rent", String(values.rent || ""));
        formData.append("landMark", values.landMark || "");

        const selectedImages = await Promise.all([
          values.image1?.[0] ? compressListingImage(values.image1[0]) : null,
          values.image2?.[0] ? compressListingImage(values.image2[0]) : null,
          values.image3?.[0] ? compressListingImage(values.image3[0]) : null,
        ]);

        selectedImages.forEach((image, index) => {
          if (image) formData.append(`image${index + 1}`, image, image.name);
        });

        await axios.put(`/api/auth/listing/${editingListing.slug}`, formData);
        message.success("Listing updated successfully");
        setEditingListing(null);
        await mutate();
      } catch (err) {
        clientError(err);
      } finally {
        setLoading(false);
      }
    };

    const handleDelete = (slug: string) => {
      Modal.confirm({
        title: "Delete Listing",
        content: "Are you sure you want to delete this listing?",
        okText: "Yes",
        cancelText: "No",
        okButtonProps: { danger: true },
        onOk: async () => {
          try {
            setLoading(true);
            await axios.delete(`/api/auth/listing/${slug}`);
            message.success("Listing deleted successfully");
            await mutate();
          } catch (err) {
            clientError(err);
          } finally {
            setLoading(false);
          }
        },
      });
    };
  
    if(isLoading)
      return(
       <div>
        <Skeleton/>
       </div>
      )

  return (
    <main className="relative min-h-screen bg-white px-4 py-6 sm:px-6 md:px-8 lg:px-12">

      {/* Back Button */}
      <div className="absolute left-4 top-4 z-10 sm:left-6 sm:top-6 md:left-8">
        <Button
          aria-label="Go back"
          className="!flex !h-10 !w-10 !items-center !justify-center !rounded-full !border-0 !bg-[#e51b23] !p-0 !text-white shadow-md hover:!bg-[#c9161d] sm:!h-11 sm:!w-11"
          icon={<ArrowLeftOutlined />}
          onClick={() => router.push("/")}
        />
      </div>

      {/* Main Box */}
      <div className="mx-auto w-full max-w-6xl">

        <section className="w-full rounded-xl  p-4 sm:p-6 md:p-8">
          
          {data?.listing?.length === 0 ? (
      <div className="col-span-full flex min-h-[400px] items-center justify-center">

    <Empty description="Sorry, no listing available" />
  </div>
) :       

<div>
          {/* Heading */}
          <h1 className="mb-6 text-center text-2xl font-medium tracking-tight text-slate-900 sm:mb-8 sm:text-3xl md:text-4xl">
            MY LISTING
          </h1>

          {/* Listing Cards */}
          <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
           
            {data?.listing?.map((listing: UserListing) => (
              <div
                key={listing._id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
              >
                {/* Image */}
                <Image
                  src={listing.image1}
                  alt={listing.title}
                  width={200}
                  height={0}
                  className="h-52 w-full object-cover sm:h-56"
                />

                {/* Card Content */}
                <div className="p-4">

                  <div className="mb-2 flex items-start justify-between gap-2">
                    <h2 className="line-clamp-2 text-base font-semibold leading-6 text-slate-900 sm:text-lg">
                      {listing.title}
                    </h2>

                    <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                      {listing.category}
                    </span>
                  </div>

                  <p className="mb-3 line-clamp-2 text-sm leading-5 text-gray-500">
                    {listing.description}
                  </p>

                  <p className="truncate text-sm text-gray-600">
                    {listing.city}
                  </p>

                  <p className="mt-1 line-clamp-1 text-sm text-gray-500">
                    {listing.landMark}
                  </p>

                  <div className="mt-3 flex items-center gap-1 text-sm">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarFilled
                        key={star}
                        className={star <= (listing.ratings || 0) ? "!text-yellow-400" : "!text-gray-300"}
                      />
                    ))}
                    <span className="ml-1 text-gray-500">{listing.ratings || 0}/5</span>
                  </div>

                  {/* Rent + Status */}
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t pt-4">
                    <p className="text-base font-semibold text-slate-900 sm:text-lg">
                      ₹{listing.rent}
                      <span className="text-xs font-normal text-gray-500 sm:text-sm">
                        {" "} / night
                      </span>
                    </p>

                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        listing.isBooked
                          ? "bg-red-100 text-red-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {listing.isBooked ? "Booked" : "Available"}
                    </span>
                  </div>

                  {/* Buttons */}
                  <div className="mt-4 flex gap-2">
                    <Button
                      loading={loading}
                      className="!h-9 !flex-1 sm:!h-10"
                      onClick={() => setEditingListing(listing)}
                    >
                      Edit
                    </Button>

                    <Button
                      danger
                      loading={loading}
                      className="!h-9 !flex-1 sm:!h-10"
                      onClick={() => handleDelete(listing.slug)}
                    >
                      Delete
                    </Button>
                  </div>

                </div>
              </div>
            ))}

          </div>

</div>
}
        </section>
      </div>

      {editingListing && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/30 p-4 backdrop-blur-sm sm:p-8">
          <div className="mx-auto w-full max-w-2xl rounded-2xl bg-zinc-800 p-4 shadow-2xl sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Edit Listing</h2>
              <Button
                aria-label="Close edit listing"
                icon={<CloseOutlined />}
                onClick={() => setEditingListing(null)}
                className="!flex !h-9 !w-9 !items-center !justify-center !rounded-full !border-0 !bg-rose-600 !text-white"
              />
            </div>

            <Form<ListingFormValues>
              key={editingListing._id}
              layout="vertical"
              requiredMark={false}
              initialValues={{
                title: editingListing.title,
                description: editingListing.description,
                rent: editingListing.rent,
                city: editingListing.city,
                landMark: editingListing.landMark,
              }}
              onFinish={handleEdit}
            >
              <Form.Item name="title" label={<span className="text-white">Title</span>} rules={[{ required: true, message: "Please enter a title" }]}>
                <Input />
              </Form.Item>
              <Form.Item name="description" label={<span className="text-white">Description</span>} rules={[{ required: true, message: "Please add a description" }]}>
                <Input.TextArea autoSize={{ minRows: 3, maxRows: 6 }} />
              </Form.Item>

              {(["image1", "image2", "image3"] as const).map((imageName, index) => (
                <Form.Item
                  key={imageName}
                  name={imageName}
                  label={<span className="text-white">Image {index + 1} (optional)</span>}
                  getValueFromEvent={(event) => event.target.files}
                  getValueProps={() => ({})}
                >
                  <Input type="file" accept="image/*" />
                </Form.Item>
              ))}

              <Form.Item name="rent" label={<span className="text-white">Rent</span>} rules={[{ required: true, message: "Please enter the rent" }]}>
                <InputNumber min={1} className="!w-full" prefix="₹" />
              </Form.Item>
              <Form.Item name="city" label={<span className="text-white">City</span>} rules={[{ required: true, message: "Please enter the city" }]}>
                <Input prefix={<EnvironmentOutlined />} />
              </Form.Item>
              <Form.Item name="landMark" label={<span className="text-white">Nearby landmark</span>} rules={[{ required: true, message: "Please enter a landmark" }]}>
                <Input prefix={<BankOutlined />} />
              </Form.Item>

              <Button htmlType="submit" type="primary" loading={loading} block className="!h-11 !border-0 !bg-[#e51b23]">
                Update Listing
              </Button>
            </Form>
          </div>
        </div>
      )}
    </main>
  );
};

export default MyListing;