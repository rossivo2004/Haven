'use client'
import { motion } from "framer-motion";

import { useState, useEffect, CSSProperties } from "react";
import { Link } from "@nextui-org/link";
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code";
import { button as buttonStyles } from "@nextui-org/theme";
// React

import { siteConfig } from "@/src/config/site";
import { title, subtitle } from "@/src/components/primitives";
import { GithubIcon } from "@/src/components/icons";
import Image from "next/image";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y, Mousewheel, Autoplay } from 'swiper/modules';
import { Tabs, Tab, Button } from "@nextui-org/react";

import BoxProduct from "@/src/components/BoxProduct";
import BoxBlog from "@/src/components/BoxBlog";
import { DUMP_PRODUCTS } from "@/src/dump";
import { CATEGORY } from "@/src/dump";
import { BLOG } from "@/src/dump";

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import './style.scss'

import { fetchProducts } from "@/src/api/productApi";

interface ProductIn {
    id: number;
    name: string;
    price: string;
    images: string[];
}

function BodyHome() {
    const [productData, setProductData] = useState<ProductIn | null>(null);

    const [counter, setCounter] = useState(59); // Bắt đầu từ 59 giây

    useEffect(() => {
        const interval = setInterval(() => {
            setCounter((prevCounter) => (prevCounter > 0 ? prevCounter - 1 : 59)); // Nếu đạt 0, reset về 59
        }, 1000); // Cập nhật mỗi giây

        return () => clearInterval(interval); // Dọn dẹp interval khi component bị unmount
    }, []);

    // Định nghĩa kiểu CSS tùy chỉnh để sử dụng "--value"
    const customStyle: CSSProperties & { "--value"?: number } = {
        "--value": counter,
    };

    useEffect(() => {
        const getProducts = async () => {
            const data = await fetchProducts();
            const dataNew = data.slice(0, 60);
            setProductData(dataNew);
        };

        getProducts();
    }, []);

    //   console.log(productData);


    return (
        <div className="">
            <div className="banner-container relative w-full h-[260px] md:h-[400px] lg:h-[500px] ">
                <>
                    <Swiper modules={[Navigation, Pagination, Scrollbar, A11y, Mousewheel, Autoplay]} className="mySwiper w-full h-full" loop autoplay={{ delay: 3000, disableOnInteraction: false }}>
                        <SwiperSlide>
                            <Image
                                className="banner-image absolute top-0 left-0 w-full max-w-screen-2xl mx-auto h-full object-cover"
                                src={`/images/bn-11.png`}
                                alt="Banner"
                                layout="fill"
                                priority
                            />
                        </SwiperSlide>
                        <SwiperSlide>
                            <Image
                                className="banner-image absolute top-0 left-0 w-full max-w-screen-2xl mx-auto h-full object-cover"
                                src={`/images/bn-20.png`}
                                alt="Banner"
                                layout="fill"
                                priority
                            />
                        </SwiperSlide>
                        <SwiperSlide>
                            <Image
                                className="banner-image absolute top-0 left-0 w-full max-w-screen-2xl mx-auto h-full object-cover"
                                src={`/images/bn-21.png`}
                                alt="Banner"
                                layout="fill"
                                priority
                            />
                        </SwiperSlide>
                    </Swiper>
                </>

            </div>

            <div className="lg:mt-20 mt-10">
                <div className="max-w-screen-xl mx-auto px-4 flex items-center justify-between mb-2 lg:mb-6">
                    <div className="font-bold lg:text-4xl text-2xl">Flash Sales</div>
                    <div className="flex items-center">
                        <div className="font-semibold lg:text-lg text-xs mr-2">Kết thúc sau:</div>
                        <div>
                            <div className="grid grid-flow-col gap-5 text-center auto-cols-max">
                                <div className="flex flex-col p-2 items-center justify-center w-12 h-12 bg-main rounded-box text-white">
                                    <span className="countdown font-mono text-sm">
                                        <span style={{ "--value": 15 } as CSSProperties}></span>
                                    </span>
                                    Ngày
                                </div>
                                <div className="flex flex-col p-2 items-center justify-center w-12 h-12 bg-main rounded-box text-white">
                                    <span className="countdown font-mono text-sm">
                                        <span style={{ "--value": 10 } as CSSProperties}></span>
                                    </span>
                                    Giờ
                                </div>
                                <div className="flex flex-col p-2 items-center justify-center w-12 h-12 bg-main rounded-box text-white">
                                    <span className="countdown font-mono text-sm">
                                        <span style={{ "--value": 24 } as CSSProperties}></span>
                                    </span>
                                    Phút
                                </div>
                                <div className="flex flex-col p-2 items-center justify-center w-12 h-12 bg-main rounded-box text-white">
                                    <span className="countdown font-mono text-sm">
                                        <span style={customStyle}></span>
                                    </span>
                                    Giây
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-screen-xl mx-auto px-4 mb-14">
                    <div className="lg:grid md:grid grid lg:grid-cols-4 grid-cols-2 gap-4">
                        {DUMP_PRODUCTS.slice(0, 8).map((product) => (
                            <BoxProduct key={product.id} product={product} />
                        ))}
                    </div>
                </div>

                <div className="max-w-screen-xl mx-auto px-4 mb-20 ">
                    <div className="font-bold text-4xl mb-6">Phân Loại</div>
                    <div>
                        <Swiper
                            modules={[Navigation, Pagination, Scrollbar, A11y, Mousewheel, Autoplay]}
                            spaceBetween={20}
                            slidesPerView={2}  // 1 slide per view initially for mobile
                            autoplay={{ delay: 3000, disableOnInteraction: false }}
                            loop={true}
                            breakpoints={{
                                640: {  // Tablet and larger phones
                                    slidesPerView: 2,
                                    spaceBetween: 20,
                                },
                                768: {  // Desktop
                                    slidesPerView: 3,
                                    spaceBetween: 20,
                                },
                                1024: {  // Larger desktops
                                    slidesPerView: 6,
                                    spaceBetween: 20,
                                },
                            }}
                        >
                            {CATEGORY.map((item, index) => (
                                <SwiperSlide key={index}>
                                    <Link href={`/shop?category=${item.tag}`} className="w-full">
                                        <div className="w-full max-w-[300px] h-auto">
                                            <div className="flex w-full items-center justify-center">
                                                <img
                                                    src={`/images/${item.image}`}
                                                    alt=""
                                                    className="w-full h-auto max-h-[200px] object-cover rounded-lg"
                                                />
                                            </div>
                                            <div className="text-center text-lg lg:text-xl font-semibold mt-2 text-black">{item.name}</div>
                                        </div>
                                    </Link>
                                </SwiperSlide>
                            ))}
                        </Swiper>

                    </div>
                </div>

                <div className="max-w-screen-xl mx-auto px-4 mb-16">

                    <div className="flex gap-4">
                        <div className="lg:w-1/4 lg:block hidden">
                            <div className="font-bold lg:text-4xl w-max text-2xl mb-6">Sản Phẩm Nổi Bật</div>
                            <img src={`/images/bn-5.png`} alt="A cat sitting on a chair" className="lg:block hidden w-full h-[800px] object-cover rounded-lg" />
                        </div>
                        <div className="flex-1">
                            <div className="flex w-full flex-col items-center lg:items-end">
                                <div className="font-bold lg:text-4xl text-2xl lg:hidden">Sản Phẩm Nổi Bật</div>
                                <Tabs aria-label="Disabled Options" className="mb-6" variant="bordered" color="warning"
                                    classNames={{
                                        tabContent: "group-data-[selected=true]:text-white"
                                    }}
                                >
                                    <Tab key="photos" title="Photos" className="py-0">
                                        <div className="lg:grid md:grid grid lg:grid-cols-3 md:grid-cols-3 grid-cols-2 gap-4 w-full">
                                            {DUMP_PRODUCTS.slice(0, 6).map((product) => (
                                                <BoxProduct key={product.id} product={product} />
                                            ))}
                                        </div>

                                    </Tab>
                                    <Tab key="music" title="Music">
                                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

                                    </Tab>
                                    <Tab key="videos" title="Videos">
                                        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

                                    </Tab>
                                </Tabs>
                            </div>
                        </div>
                    </div>
                </div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ duration: 1.5 }}
                    variants={{
                        hidden: { opacity: 0, x: -50 },
                        visible: { opacity: 1, x: 0 }
                    }}
                    className="w-full max-w-screen-xl gap-10 flex lg:flex-row flex-col-reverse lg:h-[500px] mb-16 px-4 mx-auto"
                >
                    <div className="lg:w-1/2 w-full flex flex-col justify-center">
                        <div className="lg:text-4xl text-2xl font-semibold mb-3">
                            Giảm giá <span className="text-[40px] text-main">10%</span><br />cho các sản phẩm ưa thích
                        </div>
                        <div className="mb-6 font-normal text-lg">
                            Chúng tôi đang cung cấp ưu đãi đặc biệt giảm giá 10% cho các sản phẩm ưa thích. Đây là cơ hội tuyệt vời để bạn sở hữu những sản phẩm yêu thích với giá hấp dẫn. Nhanh tay để không bỏ lỡ!
                        </div>
                        <div>
                            <Link href="/shop">
                                <Button variant="bordered" className="border-main text-main">
                                    Xem thêm
                                </Button>
                            </Link>
                        </div>
                    </div>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        transition={{ duration: 1.5 }}
                        variants={{
                            hidden: { opacity: 0, x: 100 },
                            visible: { opacity: 1, x: 0 }
                        }}
                        className="flex-1 h-full"
                    >
                        <img
                            src={`/images/bn-6.jpg`}
                            alt="A cat sitting on a chair"
                            className="w-full h-full object-fill min-h-[320px] max-h-[500px] rounded-lg"
                        />
                    </motion.div>
                </motion.div>

                <div className="max-w-screen-xl mx-auto px-4 mb-16">
                    <div className="flex justify-between items-center mb-6">
                        <div className="font-bold lg:text-4xl text-2xl">Sản phẩm mới</div>
                        <div className="font-medium text-sm text-main">
                            <Link href="/shop?new">Xem thêm</Link></div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:grid-rows-2 gap-4">
                        <div className="lg:col-span-2 md:col-span-3 col-span-2">
                            <img src={`/images/bn-7.jpeg`} alt="A cat sitting on a chair" className="w-full h-full object-cover rounded-lg" />
                        </div>
                        {DUMP_PRODUCTS.slice(0, 6).map((product) => (
                            <BoxProduct key={product.id} product={product} />
                        ))}
                    </div>


                </div>
                
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 3 }}
                    variants={{
                        hidden: { opacity: 0, x: 0 }, // Bạn có thể điều chỉnh giá trị x để tạo hiệu ứng trượt
                        visible: { opacity: 1, x: 0 },
                    }}
                >
                    <div className="w-full gap-10 max-w-screen-xl mx-auto flex lg:flex-row flex-col lg:h-[500px] mb-16 px-4">
                        <div className="lg:w-1/2 w-full h-full">
                            <img src={`/images/bn-9.jpg`} alt="A cat sitting on a chair" className="w-full h-full object-cover min-h-[320px] max-h-[500px] rounded-lg" />
                        </div>
                        <div className="flex-1 h-full flex flex-col justify-center">
                            <div className="text-4xl font-semibold mb-3">Ưu Đãi Hấp Dẫn – Mua Nhiều Tiết Kiệm Nhiều</div>
                            <div className="mb-6 font-normal text-lg">
                                Chúng tôi luôn có những chương trình khuyến mãi đặc biệt giúp bạn tiết kiệm chi phí. Đừng bỏ lỡ cơ hội nhận ngay những ưu đãi độc quyền khi mua sắm trên trang web của chúng tôi.
                            </div>
                            <div>
                                <Link href="/shop">
                                    <Button variant="bordered" className="border-main text-main">Xem thêm</Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </motion.div>

                

                <div className="max-w-screen-xl mx-auto px-4 mb-16">
                    <div className="flex justify-between mb-6 items-center">
                        <div className="font-bold lg:text-4xl text-2xl">Thịt Đông Lạnh Nhập Khẩu Hàng Đầu Thế Giới</div>
                        <div className="font-medium text-sm text-main">Xem tất cả</div>
                    </div>
                    <div>
                        <div className="lg:grid md:grid grid lg:grid-cols-4 grid-cols-2 gap-4">
                            {DUMP_PRODUCTS.slice(0, 8).map((product) => (
                                <BoxProduct key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="max-w-screen-xl mx-auto px-4 mb-16">
                    <div className="flex items-center justify-between mb-6">
                        <div className="font-bold text-4xl">Tin tức mới</div>
                        <div className="font-medium text-sm text-main">Xem tất cả</div>
                    </div>

                    <Swiper
                        modules={[Navigation, Pagination, Scrollbar, A11y, Mousewheel, Autoplay]}
                        spaceBetween={20}
                        slidesPerView={1}
                        loop={true}
                        breakpoints={{
                            768: {
                                slidesPerView: 2,
                                spaceBetween: 20,
                            },
                        }}
                    >
                        {BLOG.slice(0, 4).map((blog, index) => (
                            <SwiperSlide key={index} className="lg:hidden">
                                <BoxBlog blog={blog} />
                            </SwiperSlide>
                        ))}

                    </Swiper>


                </div>

                <div className="max-w-screen-xl mx-auto px-4 mb-16">
                    <div className="relative w-full lg:h-[500px] h-auto">
                        <img src={`/images/bn-8.png`} alt="A cat sitting on a chair" className="object-cover w-full h-full" />

                        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

                        <div className="absolute inset-0 flex flex-col justify-center items-center text-white z-10">
                            <p className="text-lg">Ăn Ngon Mỗi Ngày</p>
                            <h1 className="text-4xl font-bold mt-2">Korean Abalone Products</h1>
                            <button className="mt-4 px-6 py-3 bg-transparent border border-white rounded-full hover:bg-white hover:text-black transition">
                                Xem video →
                            </button>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}

export default BodyHome;