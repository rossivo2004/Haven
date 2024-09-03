'use client'
import Link from "next/link";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";


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
                        alt=""
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
                            onSubmit={(values) => {
                                alert('Đăng kí thành công !');
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