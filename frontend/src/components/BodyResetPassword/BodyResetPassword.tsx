'use client'
import Link from "next/link";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from 'axios'; 
import Cookies from 'js-cookie'; // Add this import
import apiConfig from "@/src/config/api";
import { toast } from "react-toastify";

function BodyResetPassword() {
    const validationSchema = Yup.object({
        password: Yup.string()
            .required("Vui lòng nhập mật khẩu")
            .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
        repassword: Yup.string()
            .required("Vui lòng xác nhận mật khẩu")
            .oneOf([Yup.ref('password')], 'Mật khẩu không khớp')
    });

    return (
        <div className="my-20 max-w-screen-xl mx-auto px-4 h-auto">
            <div className="flex lg:flex-row flex-col lg:h-[680px] gap-10">
                <div className="lg:w-1/2 w-full">
                    <img
                        src={"/images/si-2.png"}
                        alt="A cat sitting on a chair"
                        className="h-auto w-auto object-cover"
                    />
                </div>
                <div className="flex-1 flex flex-col justify-center">
                    <div className="text-4xl font-medium mb-5">Quên mật khẩu</div>
                    <div className="text-base font-normal mb-6">
                        Vui lòng nhập thông tin bên dưới!
                    </div>
                    <div>
                        <Formik
                            initialValues={{ password: "", repassword: "" }}
                            validationSchema={validationSchema}
                            onSubmit={async (values) => {
                                try {
                                    // Retrieve user data from cookies
                                    const userCookie = Cookies.get('user'); // Get user cookie
                                    const user = userCookie ? JSON.parse(userCookie) : null; // Parse user cookie
                                    const email = user ? user.email : null; // Extract email

                                    console.log("Email from cookies:", email); // Debugging line

                                    if (!email) {
                                        toast.error("Không thể cập nhật!!!")
                                        return; // Exit if email is not found
                                    }

                                    // Make the API call to update the password
                                    const response = await axios.post(apiConfig.user.updatePassword, {
                                        email: email, // Use email from cookies
                                        password: values.password,
                                        password_confirmation: values.repassword,
                                    });

                                    if (response.status === 200) {
                                        const { email, otp } = response.data; // Adjust based on your API response
                                        Cookies.set('email', email, { expires: 7 }); // Store email in cookies for 7 days
                                        Cookies.set('otp_code', otp, { expires: 7 }); // Store OTP in cookies for 7 days
                                        toast.success("Cập nhật thành công!")
                                    }
                                } catch (error) {
                                    console.error("Error updating password:", error);
                                    alert('Có lỗi xảy ra, vui lòng thử lại.');
                                }
                            }}
                        >
                            {() => (
                                <Form className="flex flex-col gap-10">
                                    <div>
                                        <Field
                                            type="password"
                                            name="password"
                                            placeholder="Mật khẩu"
                                            className="border-b border-black py-2 text-base font-normal focus:outline-none w-full"
                                        />
                                        <ErrorMessage
                                            name="password"
                                            component="div"
                                            className="text-red-500 text-sm mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Field
                                            type="password"
                                            name="repassword"
                                            placeholder="Xác nhận lại mật khẩu"
                                            className="border-b border-black py-2 text-base font-normal focus:outline-none w-full"
                                        />
                                        <ErrorMessage
                                            name="repassword"
                                            component="div"
                                            className="text-red-500 text-sm mt-1"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-main text-white py-4 rounded mb-4"
                                    >
                                        Xác nhận
                                    </button>
                                </Form>
                            )}
                        </Formik>
                    </div>
                    <div className="text-center text-base font-normal">
                        <div className="hover:underline">
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

export default BodyResetPassword;