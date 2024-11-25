'use client'
import Link from "next/link";
import { Formik, Form, Field, ErrorMessage } from "formik";

import * as Yup from "yup";
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux'; // Import useDispatch from Redux
import { setUserId } from "@/src/store/userSlice";// Import your action to set user ID

import Cookies from 'js-cookie'; // Import js-cookie for cookie management
import axios from "axios";
import apiConfig from "@/src/config/api";
import { Spinner } from "@nextui-org/react";
import { useState } from "react";
import Dashboard from "../Dashboard/Dashboard";

import { EyeFilledIcon } from "@/src/assets/icon/EyeFilledIcon/EyeFilledIcon";
import { EyeSlashFilledIcon } from "@/src/assets/icon/EyeSlashFilledIcon/EyeSlashFilledIcon";

interface SignInValues {
    email: string; // Change phone to email

    password: string;
}

function BodySignIn() {
    const dispatch = useDispatch(); // Initialize dispatch
const [loading, setLoading] = useState(false);
const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

    const validationSchema = Yup.object({

        email: Yup.string() // Change phone to email

            .required("Vui lòng nhập email")
            .email("Email không hợp lệ"), // Add email validation

        password: Yup.string()
            .required("Vui lòng nhập mật khẩu")

            .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),

    });


    const handleCheckSignin = async (values: SignInValues) => {
        setLoading(true);
        try {
            const response = await axios.post(apiConfig.user.loginToken, values); // Use axios to post data

            toast.success('Đăng nhập thành công!'); // Show success message

            // console.log(response.data);

            Cookies.set('access_token', response.data.access_token, { expires: 1 }); // Set access_token in cookie for 7 days
            Cookies.set('refresh_token', response.data.refresh_token, { expires: 1 }); // Set refresh_token in cookie for 7 days
            
            window.location.href = '/';
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Đăng nhập thất bại! Vui lòng thử lại.'; // Get error message from response
            toast.error(errorMessage); // Show error message
        } finally {
            setLoading(false);
        }
    };

    return (

        <div className="my-20 max-w-screen-xl mx-auto px-4 h-auto">

            <div className="flex lg:flex-row flex-col lg:h-[680px] gap-10">
                <div className="lg:w-1/2 w-full">

                    <img

                        src={"/images/si-1.png"}
                        alt=""
                        className="h-auto w-auto object-cover"

                    />
                </div>
                <div className="flex-1 flex flex-col justify-center">

                    <div className="text-4xl font-medium mb-5 dark:text-white">Đăng nhập</div>
                    <div className="text-base font-normal mb-6 dark:text-white">
                        Vui lòng nhập đầy đủ thông tin đăng nhập!

                    </div>
                    <div>

                        <Formik

                            initialValues={{ email: "", password: "" }} // Change initialValues to email
                            validationSchema={validationSchema}

                            onSubmit={(values) => {
                                handleCheckSignin(values)

                            }}
                        >

                            {() => (

                                <Form className="flex flex-col gap-8">

                                    <div>
                                        <Field

                                        required
                                            type="email" // Change type to email

                                            name="email" // Change name to email
                                            placeholder="Email" // Change placeholder to Email

                                            className="border-b border-black dark:text-white py-2 text-base font-normal focus:outline-none w-full "

                                        />

                                        <ErrorMessage

                                            name="email" // Change name to email
                                            component="div"

                                            className="text-red-500 text-sm mt-1"

                                        />

                                    </div>
                                    <div className="relative">

                                        <Field
                                        required

                                            type={showPassword ? "text" : "password"}

                                            name="password"

                                            placeholder="Mật khẩu"
                                            className="border-b border-black dark:text-white py-2 text-base font-normal focus:outline-none w-full "
                                        />
                                        <div className="absolute right-0 top-0 mt-4 mr-2 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ? <EyeFilledIcon /> : <EyeSlashFilledIcon />} 
                                        </div>

                                        <ErrorMessage
                                            name="password"

                                            component="div"

                                            className="text-red-500 text-sm mt-1"

                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-main text-white py-4 rounded mb-4"
                                    >
                                        {loading ? <Spinner size="sm"/> : 'Đăng nhập'}
                                    </button>

                                </Form>

                            )}

                        </Formik>

                    </div>

                <div className="flex items-center mb-2">
  <div className="flex-1 border-t border-gray-300" />
  <span className="mx-2 dark:text-white">Hoặc</span>

  <div className="flex-1 border-t border-gray-300" />

</div>

<div className="text-center mb-2 flex gap-3 items-center justify-center">

<Dashboard />
                    </div>



                    <div className="text-center text-base font-normal">

                    <Link href={'/forgotpassword'}>

                        <div className="mb-2 dark:text-white">Quên mật khẩu?</div>
                        </Link>

                        <div className="dark:text-white">

                            Bạn chưa có tài khoản?{" "}

                            <Link href={"/signup"} className="text-main">

                                Đăng ký ngay

                            </Link>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}


export default BodySignIn;
