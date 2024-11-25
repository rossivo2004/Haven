'use client'
import Link from "next/link";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from 'react-toastify';
import Cookies from 'js-cookie'; // Import js-cookie
import axios from 'axios'; // Import Axios
import apiConfig from "@/src/config/api";
import { useRouter } from "next/navigation";
import { useDispatch } from 'react-redux'; // Import useDispatch
import { setUser } from '@/src/store/userSlice';
import { useState } from "react";
import { Spinner } from "@nextui-org/spinner";
import Dashboard from "../Dashboard/Dashboard";
import { EyeFilledIcon } from "@/src/assets/icon/EyeFilledIcon/EyeFilledIcon";
import { EyeSlashFilledIcon } from "@/src/assets/icon/EyeSlashFilledIcon/EyeSlashFilledIcon";

interface SignUpValues {
    name: string;
    email: string;
    password: string;
}

function BodySingUp() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false);
    const validationSchema = Yup.object({
        name: Yup.string()
            .required("Vui lòng nhập tên")
            .min(8, "Tên phải có ít nhất 8 ký tự"),
        email: Yup.string()
            .required("Vui lòng nhập địa chỉ email")
            .email("Địa chỉ email không hợp lệ"),
        password: Yup.string()
            .required("Vui lòng nhập mật khẩu")
            .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
        repassword: Yup.string()
            .required("Vui lòng xác nhận mật khẩu")
            .oneOf([Yup.ref('password')], 'Mật khẩu không khớp')
    });

    const handleCheckSignup = async (values: SignUpValues) => {
        setLoading(true);
        try {
            const response = await axios.post(apiConfig.user.register_sendcode, values, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                // Save user data to cookies
                Cookies.set('userDataCode', JSON.stringify(values), { expires: 10 / (24 * 60) });
                dispatch(setUser(values));
                toast.success('Gửi mã xác nhận thành công!');
                router.push('/verifysignup');
            } else {
                toast.error('Đăng kí thất bại! Vui lòng thử lại.');
            }
        } catch (error: any) { // Specify the type of error as 'any'
            // Check if the error response contains a specific message
            toast.error('Email đã tồn tại!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="my-20 max-w-screen-xl mx-auto px-4 h-auto">
            <div className="flex lg:flex-row flex-col lg:h-[680px] gap-10">
                <div className="lg:w-1/2 w-full">
                    <img
                        src={"/images/si-3.png"}
                        alt="A cat sitting on a chair"
                        className="h-auto w-auto object-cover"
                    />
                </div>
                <div className="flex-1 flex flex-col justify-center">
                    <div className="text-4xl font-medium mb-5 dark:text-white">Đăng kí</div>
                    <div className="text-base font-normal mb-6 dark:text-white">
                        Vui lòng nhập đầy đủ thông tin đăng kí!
                    </div>
                    <div>
                        <Formik
                            initialValues={{ name: "", email: "", password: "", repassword: "" }}
                            validationSchema={validationSchema}
                            onSubmit={(values) => {
                                handleCheckSignup(values)
                            }}
                        >
                            {() => (
                                <Form className="flex flex-col gap-10">
                                    <div>
                                        <Field
                                            type="text"
                                            name="name"
                                            placeholder="Họ và tên"
                                            className="border-b border-black dark:text-white py-2 text-base font-normal focus:outline-none w-full"
                                        />
                                        <ErrorMessage
                                            name="name"
                                            component="div"
                                            className="text-red-500 text-sm mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Field
                                            type="text"
                                            name="email"
                                            placeholder="Email"
                                            className="border-b border-black dark:text-white py-2 text-base font-normal focus:outline-none w-full"
                                        />
                                        <ErrorMessage
                                            name="email"
                                            component="div"
                                            className="text-red-500 text-sm mt-1"
                                        />
                                    </div>
                                    <div className="relative">
                                        <Field
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            placeholder="Mật khẩu"
                                            className="border-b border-black dark:text-white py-2 text-base font-normal focus:outline-none w-full"
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
                                    <div className="relative">
                                        <Field
                                            type={showPassword ? "text" : "password"}
                                            name="repassword"
                                            placeholder="Xác nhận lại mật khẩu"
                                            className="border-b border-black dark:text-white py-2 text-base font-normal focus:outline-none w-full"
                                        />
                                        <div className="absolute right-0 top-0 mt-4 mr-2 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ? <EyeFilledIcon /> : <EyeSlashFilledIcon />}
                                        </div>
                                        <ErrorMessage
                                            name="repassword"
                                            component="div"
                                            className="text-red-500 text-sm mt-1"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className={`w-full bg-main text-white py-4 rounded mb-4 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        disabled={loading} // Disable button when loading
                                    >
                                        {loading ? <Spinner size="sm"/> : 'Đăng kí ngay'}
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
                    <div className="text-center text-base font-normal dark:text-white">
                        <Link href={'/forgotpassword'}>
                            <div className="mb-2 underline">Quên mật khẩu?</div>
                        </Link>
                        <div>
                            <Link href={"/signin"}>
                                Trở về
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BodySingUp;