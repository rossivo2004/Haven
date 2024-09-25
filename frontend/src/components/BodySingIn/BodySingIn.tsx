'use client'
import Link from "next/link";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from 'react-toastify';

interface SignInValues {
    phone: string;
    password: string;
}

function BodySignIn() {
    const validationSchema = Yup.object({
        phone: Yup.string()
            .required("Vui lòng nhập số điện thoại")
            .matches(/^[0-9]+$/, "Số điện thoại không hợp lệ")
            .min(10, "Số điện thoại phải có ít nhất 10 chữ số"),
        password: Yup.string()
            .required("Vui lòng nhập mật khẩu")
            .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    });

    const handleCheckSignin = async (values: SignInValues) => {
        try {
            const response = await fetch('/api/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            if (response.ok) {
                toast.success('Đăng nhập thành công!');
                localStorage.setItem('user', String(values.phone));
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || 'Đăng nhập thất bại! Vui lòng thử lại.');
            }
        } catch (error) {
            toast.error('Đăng nhập thất bại! Vui lòng thử lại.');
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
                    <div className="text-4xl font-medium mb-5">Đăng nhập</div>
                    <div className="text-base font-normal mb-6">
                        Vui lòng nhập đầy đủ thông tin đăng nhập!
                    </div>
                    <div>
                        <Formik
                            initialValues={{ phone: "", password: "" }}
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
                                            type="text"
                                            name="phone"
                                            placeholder="Số điện thoại"
                                            className="border-b border-black py-2 text-base font-normal focus:outline-none w-full"
                                        />
                                        <ErrorMessage
                                            name="phone"
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
                                            className="border-b border-black py-2 text-base font-normal focus:outline-none w-full"
                                        />
                                        <ErrorMessage
                                            name="password"
                                            component="div"
                                            className="text-red-500 text-sm mt-1"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-main text-white py-2 rounded mb-4"
                                    >
                                        Đăng nhập
                                    </button>
                                </Form>
                            )}
                        </Formik>
                    </div>
                <div className="flex items-center mb-2">
  <div className="flex-1 border-t border-gray-300" />
  <span className="mx-2">Hoặc</span>
  <div className="flex-1 border-t border-gray-300" />
</div>

<div className="text-center mb-2 flex gap-3 items-center justify-center">
                        <button>
                            <img src="/images/google-logo.png" alt="" className="w-8 h-8" />
                        </button>
                        <button>
                            <img src="/images/facebook-logo.png" alt="" className="w-8 h-8" />
                        </button>
                    </div>


                    <div className="text-center text-base font-normal">
                    <Link href={'/forgotpassword'}>
                        <div className="mb-2">Quên mật khẩu?</div>
                        </Link>
                        <div>
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
