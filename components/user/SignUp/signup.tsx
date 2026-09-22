  "use client";

  import { Button, Carousel, Form, Input, message } from "antd";
  import { FcGoogle } from "react-icons/fc";
  import Image from 'next/image'
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { clientError } from "@/lib/client-errot";


interface SignUpValues {
  fullname: string;
  email: string;
  password: string;
}

  const SignUp = () => {

  const [loading, setLoading] = useState(false)
  const router = useRouter()

    const handleSubmit = async(values:SignUpValues)=>{
      try{   
               setLoading(true)
               const {data} = await axios.post('/api/auth/signup', values)
               console.log(data)
               message.success('signup successfully')
               router.push('/login')
      }
      catch (err) {
       clientError(err)
      }
      finally{
          setLoading(false)
      }
    }
    return (
      <div className="h-screen bg-gray-100 flex flex-col lg:flex-row">

        {/* LEFT - SIGNUP FORM */}
        <div className="w-full lg:w-1/2 min-h-screen flex items-center justify-center px-5 pb-5">
          <Form
            className="w-full max-w-md flex flex-col"
            layout="vertical"
            onFinish={handleSubmit}
          >
                <div className="flex mb-4">
                    <Image
                      src="/Airbnb-Logo.png"
                      alt="Airbnb"
                      width={110}
                      height={0}
                      loading="eager"
                      sizes="110px"
                      className="object-contain"
                    />
                  </div>

            <h1 className="text-3xl font-bold mb-6">
              Welcome to Airbnb
            </h1>

            <Form.Item
              className="mb-4!"
              label="Full Name"
              name="fullname"
              
              rules={[
                {
                  required: true,
                  message: "Please input your fullname!",
                },
              ]}
            >
              <Input size="large" className="border border-black" />
            </Form.Item>

            <Form.Item
              className="mb-4!"
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input your email!",
                },
                {
                  type: "email",
                  message: "Please enter a valid email!",
                },
              ]}
            >
              <Input
                type="email"
                size="large"
                className="border border-black"
              />
            </Form.Item>

            <Form.Item
              className="mb-4!"
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input.Password
                size="large"
                className="border border-black"
              />
            </Form.Item>

            <Form.Item className="mb-3!">
              <Button
                className="w-full"
                size="large"
                type="primary"
                danger
                htmlType="submit"
                loading={loading}
              >
                Sign Up
              </Button>
            </Form.Item>

            {/* DIVIDER */}
            <div className="flex items-center gap-3 my-2">
              <div className="h-px bg-gray-300 flex-1" />
              <span className="text-gray-500 text-sm">OR</span>
              <div className="h-px bg-gray-300 flex-1" />
            </div>


            <div className="mt-4 text-start text-[16px]">
                      Already have an account?{" "}
                      <Link href="/login" className="text-red-500 font-semibold hover:underline">
                        Login
                      </Link>
              </div>

          
          </Form>
        </div>

        {/* RIGHT - IMAGE */}
        {/* RIGHT - IMAGE SLIDER */}
  <div className="w-full hidden lg:block lg:w-1/2 h-64 lg:h-screen">
    <Carousel
      autoplay
      autoplaySpeed={3000}
      effect="fade"
      dots
      className="h-full"
    >
      <div className="h-64 lg:h-screen">
        <Image
          src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1400&q=80"
          alt="Beautiful Airbnb home"
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      </div>

      <div className="h-64 lg:h-screen">
        <Image
          src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80"
          alt="Luxury Airbnb interior"
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      </div>

      <div className="h-64 lg:h-screen">
        <Image
          src="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1400&q=80"
          alt="Modern Airbnb interior"
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      </div>

      <div className="h-64 lg:h-screen">
        <Image
          src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=80"
          alt="Cozy Airbnb living room"
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
    </Carousel>
  </div>

      </div>
    );
  };

  export default SignUp;