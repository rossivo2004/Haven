'use client'
import { useState, useEffect } from "react";
import { Link } from "@nextui-org/link";
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code";
import { button as buttonStyles } from "@nextui-org/theme";

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

import { fetchProducts } from "@/src/api/productApi";

interface ProductIn {
    id: number;
    name: string;
    price: string;
    images: string[];
}


function BodyHome() {
    const [productData, setProductData] = useState<ProductIn | null>(null);

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
                <Image
                    className="banner-image absolute top-0 left-0 w-full max-w-screen-2xl mx-auto h-full object-cover"
                    src="https://th.bing.com/th/id/OIP.tbtNZFbXc4MIatG0eTbDxAHaFQ?w=1748&h=1240&rs=1&pid=ImgDetMain"
                    alt="Banner"
                    layout="fill"
                    priority
                />
            </div>

            <div className="lg:mt-20 mt-10">
                <div className="max-w-screen-xl mx-auto px-4 flex items-center justify-between mb-2 lg:mb-6">
                    <div className="font-bold lg:text-4xl text-2xl">Flash Sales</div>
                    <div className="flex items-center">
                        <div className="font-semibold lg:text-lg text-xs mr-2">Kết thúc sau:</div>
                        <div>
                            <div className="flex items-center justify-center lg:space-x-4 space-x-2 lg:p-4">
                                {['Ngày', 'Giờ', 'Phút', 'Giây'].map((unit, index) => (
                                    <div key={index} className="flex flex-col items-center justify-center bg-yellow-400 text-white font-bold text-sm lg:w-10 lg:h-10 w-8 h-8 rounded-md">
                                        <div>{index === 0 ? '01' : '10'}</div>
                                        <div className="text-xs font-normal">{unit}</div>
                                    </div>
                                ))}
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

                <div className="max-w-screen-xl mx-auto px-4 mb-14 ">
                    <div className="font-bold text-4xl mb-6">Category</div>
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
                                    slidesPerView: 4,
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
                                                    className="w-full h-auto max-h-[300px] object-cover rounded-lg"
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
                            <div className="font-bold lg:text-4xl text-2xl mb-6">Sản Phẩm Nổi Bật</div>
                            <img src={`/images/bn-5.png`} alt="A cat sitting on a chair" className="lg:block hidden" />
                        </div>
                        <div className="flex-1">
                            <div className="flex w-full flex-col items-center lg:items-end">
                                <div className="font-bold lg:text-4xl text-2xl lg:hidden">Sản Phẩm Nổi Bật</div>
                                <Tabs aria-label="Disabled Options" className="mb-6" variant="underlined">
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

                <div className="w-ful max-w-screen-xl gap-10 flex lg:flex-row flex-col-reverse lg:h-[500px] mb-16 px-4 mx-auto">
                    <div className="lg:w-1/2 w-full flex flex-col justify-center">
                        <div className="lg:text-4xl text-2xl font-semibold mb-3">Giảm giá <span className="text-[40px] text-main">10%</span><br />cho tất cả các sản phẩm</div>
                        <div className="mb-6 font-normal text-lg">
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                            It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
                        </div>
                        <div>
                            <Button variant="bordered" className="border-main text-main">Xem thêm</Button>
                        </div>
                    </div>
                    <div className="flex-1 h-full">
                        <img src={`/images/bn-6.png`} alt="A cat sitting on a chair" className="w-full h-full object-fill min-h-[320px] max-h-[500px]" />
                    </div>
                </div>

                <div className="max-w-screen-xl mx-auto px-4 mb-16">
                    <div className="flex justify-between items-center mb-6">
                        <div className="font-bold lg:text-4xl text-2xl">Sản phẩm mới</div>
                        <div className="font-medium text-sm text-main">
                            <Link href="/shop?new">Xem thêm</Link></div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:grid-rows-2 gap-4">
                        <div className="lg:col-span-2 md:col-span-3 col-span-2">
                            <img src={`/images/bn-7.png`} alt="A cat sitting on a chair" className="w-full h-full object-cover" />
                        </div>
                        {DUMP_PRODUCTS.slice(0, 6).map((product) => (
                            <BoxProduct key={product.id} product={product} />
                        ))}
                    </div>


                </div>

                <div className="w-full gap-10 max-w-screen-xl mx-auto flex lg:flex-row flex-col lg:h-[500px] mb-16 px-4">
                    <div className="lg:w-1/2 w-full h-full">
                        <img src={`/images/bn-6.png`} alt="A cat sitting on a chair" className="w-full h-full object-cover min-h-[320px] max-h-[500px]" />
                    </div>
                    <div className="flex-1 h-full flex flex-col justify-center">
                        <div className="text-4xl font-semibold mb-3">Giảm giá <span className="text-[40px] text-main">10%</span><br />cho tất cả các sản phẩm</div>
                        <div className="mb-6 font-normal text-lg">
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                            It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
                        </div>
                        <div>
                            <Button variant="bordered" className="border-main text-main">Xem thêm</Button>
                        </div>
                    </div>
                </div>

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