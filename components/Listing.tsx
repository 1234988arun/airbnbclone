"use client";

import { ArrowLeftOutlined, ArrowRightOutlined, EnvironmentOutlined, BankOutlined } from "@ant-design/icons";
import { Button, Form, Input, InputNumber } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import message from "antd/es/message";
import { useListingContext } from "@/context/ListingContext";
import { compressListingImage } from "@/lib/compress-image";

type ListingLocationValues = {
  title: string;
  description: string;
  image1: FileList;
  image2: FileList;
  image3: FileList;
  rent: number;
  city: string;
  landMark: string;
};

const Listing = () => {
    const router = useRouter();
    const { setListingData } = useListingContext();
    const [Loading,setLoading] = useState(false)
    const handleSubmit = async (values: ListingLocationValues) => {
      try {
        setLoading(true);
        const [image1, image2, image3] = await Promise.all([
          compressListingImage(values.image1[0]),
          compressListingImage(values.image2[0]),
          compressListingImage(values.image3[0]),
        ]);

        setListingData({
          title: values.title,
          description: values.description,
          rent: values.rent,
          city: values.city,
          landMark: values.landMark,
          image1,
          image2,
          image3,
          category: "",
        });

        message.success("listing details saved");
        router.push("/listingpage2");
      } catch (error) {
        message.error(error instanceof Error ? error.message : "listing images not saved");
      } finally {
        setLoading(false);
      }
    };


  return (
    <main className="min-h-screen bg-white px-3 py-2 sm:px-8 sm:py-4 lg:h-screen lg:overflow-hidden lg:px-12 lg:py-5">
      <div className="mx-auto flex h-full max-w-6xl flex-col">
        <div className="mb-2 flex shrink-0 items-center justify-between gap-3 sm:mb-5 lg:mb-8">
          <Button
            aria-label="Go back"
            className="!flex !h-10 !w-10 !items-center !justify-center !rounded-full !border-0 !bg-[#1f2937] !text-white shadow-md hover:!bg-[#374151] sm:!h-11 sm:!w-11"
            icon={<ArrowLeftOutlined />}
            onClick={() => router.back()}
          />
          <Button type="primary" className="!h-10 !rounded-full !border-0 !bg-[#e85d4a] !px-4 !text-xs !font-medium shadow-md hover:!bg-[#d95040] sm:!h-11 sm:!px-7 sm:!text-sm">
            SetUp Your Home
          </Button>
        </div>

        <Form<ListingLocationValues> layout="vertical" requiredMark={false} onFinish={handleSubmit} scrollToFirstError className="min-h-0 flex-1">
          <div className="grid min-h-0 flex-1 lg:h-full lg:grid-cols-[minmax(280px,0.8fr)_minmax(0,1.2fr)] lg:gap-10">
            <aside className="relative hidden overflow-hidden rounded-[2rem] lg:block">
              <Image
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85"
                alt="Bright modern home interior"
                fill
                priority
                className="object-cover"
                sizes="(min-width: 1024px) 35vw, 0px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
              <p className="absolute bottom-8 left-8 max-w-xs text-2xl font-semibold leading-tight text-white">
                Make guests feel at home from the very first look.
              </p>
            </aside>

            <section className="min-h-0 w-full overflow-y-auto px-1 pb-2 sm:px-4 sm:pb-6 lg:pb-8">
              <div className="grid gap-4">
                    <Form.Item className="!mb-0" label={<span className="font-medium text-slate-700">Title</span>} name="title" rules={[{ required: true, message: "Please enter a title" }]}>
                      <Input  className="!h-12 !rounded-xl" placeholder="For example, Cozy 2BHK near the city center" />
                    </Form.Item>
                    <Form.Item className="!mb-0" label={<span className="font-medium text-slate-700">Description</span>} name="description" rules={[{ required: true, message: "Please add a description" }]}>
                      <Input.TextArea  className="!rounded-xl" autoSize={{ minRows: 4, maxRows: 7 }} placeholder="Describe the rooms, amenities, views, and what guests will enjoy" />
                    </Form.Item>
                   {["image1", "image2", "image3"].map((imageName, index) => (
                        <Form.Item
                          key={imageName}
                          className="!mb-0"
                          label={`Image ${index + 1} (for example, living room or bedroom)`}
                          name={imageName}
                          getValueFromEvent={(e) => e.target.files}
                          getValueProps={() => ({})}
                          rules={[
                            { required: true, message: `Please choose image ${index + 1}` }
                          ]}
                        >
                          <Input
                            type="file"
                            accept="image/*"
                            className="!h-12 !rounded-xl"
                          />
                        </Form.Item>
                      ))}
                    <Form.Item label={<span className="font-medium text-slate-700">Monthly rent</span>} name="rent" rules={[{ required: true, message: "Please enter the rent" }]}>
                      <InputNumber   className="!h-12 !w-full !rounded-xl" min={1} placeholder="For example, 25000" prefix={<span className="mr-2 text-[#e85d4a]">₹</span>} />
                    </Form.Item>

                    <Form.Item label={<span className="font-medium text-slate-700">City</span>} name="city" rules={[{ required: true, message: "Please enter the city" }]}>
                      <Input   className="!h-12 !rounded-xl" prefix={<EnvironmentOutlined className="mr-2 text-[#e85d4a]" />} placeholder="For example, Dehradun" />
                    </Form.Item>
                    <Form.Item label={<span className="font-medium text-slate-700">Nearby landmark</span>} name="landMark" rules={[{ required: true, message: "Please enter a nearby landmark" }]}>
                      <Input   className="!h-12 !rounded-xl" prefix={<BankOutlined className="mr-2 text-[#e85d4a]" />} placeholder="For example, near Clock Tower or a metro station" />
                    </Form.Item>
                    <Button htmlType="submit" type="primary" loading={Loading} block className="!mt-5 !h-12 !rounded-xl !border-0 !bg-[#e85d4a] !text-base !font-semibold shadow-lg shadow-[#e85d4a]/20 hover:!bg-[#d95040]">
                      Next <ArrowRightOutlined />
                    </Button>
              </div>
            </section>
          </div>
        </Form>
      </div>
    </main>
  );
};

export default Listing;
