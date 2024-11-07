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

interface SignInValues {
    email: string; // Change phone to email

    password: string;
}

function BodySignIn() {
    const dispatch = useDispatch(); // Initialize dispatch
const [loading, setLoading] = useState(false);

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
            const response = await axios.post(apiConfig.user.login, values); // Use axios to post data

            toast.success(response.data.message); // Show success message

            Cookies.set('user_id', String(response.data.user.id), { expires: 7 }); // Set user_id in cookie for 7 days
            dispatch(setUserId(response.data.user.id)); // Dispatch action to set user ID in Redux
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

                                            className="border-b border-black dark:text-white py-2 text-base font-normal focus:outline-none w-full px-2 rounded-lg"

                                        />

                                        <ErrorMessage

                                            name="email" // Change name to email
                                            component="div"

                                            className="text-red-500 text-sm mt-1"

                                        />

                                    </div>
                                    <div>

                                        <Field
                                        required

                                            type="password"

                                            name="password"

                                            placeholder="Mật khẩu"
                                            className="border-b border-black dark:text-white py-2 text-base font-normal focus:outline-none w-full px-2 rounded-lg"
                                        />

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
