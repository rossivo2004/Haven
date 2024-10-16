'use client'
import { useState, useEffect, CSSProperties } from "react";
import { motion } from "framer-motion";
import { Link } from "@nextui-org/link";
import Image from "next/image";
import { useParams } from 'react-router-dom';

import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code";
import { button as buttonStyles } from "@nextui-org/theme";
import { siteConfig } from "@/src/config/site";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y, Mousewheel, Autoplay } from 'swiper/modules';
import { Tabs, Tab, Button } from "@nextui-org/react";

import { title, subtitle } from "@/src/components/primitives";
import { GithubIcon } from "@/src/components/icons";
import BoxProduct from "@/src/components/BoxProduct";
import BoxProductFlashSale from "../BoxProductFlashSale";
import BoxBlog from "@/src/components/BoxBlog";
import InfiniteScroll from "../InfiniteScroll";

import { DUMP_PRODUCTS } from "@/src/dump";
import { CATEGORY } from "@/src/dump";
import { BLOG } from "@/src/dump";
import { useProducts } from '@/src/hooks/product';

import RocketLaunchOutlinedIcon from '@mui/icons-material/RocketLaunchOutlined';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import './style.scss'

import { fetchProducts } from "@/src/api/productApi";

import {useTranslations} from 'next-intl';

import apiConfig from '@/src/config/api';

import { Category } from "@/src/interface";
import axios from "axios";

interface ProductIn {
    id: number;
    name: string;
    price: string;
    images: string[];
}

function BodyHome() {
    const [productData, setProductData] = useState<ProductIn | null>(null);

    const [counter, setCounter] = useState(59); // Bắt đầu từ 59 giây

    const { flatProducts } = useProducts(); // Use updated hook without filters
    const [language, setLanguage] = useState('vi'); // Default to 'en'
    const params = useParams(); 
    const { lang = 'vi' } = params;
    const t = useTranslations('HomePage');
    const [loading, setLoading] = useState(false);

    const [category, setCategory] =  useState<Category[]>([]);

    const fetchCategory = async () => {
        setLoading(true); // Start loading
        try {
            const response = await axios.get(`${apiConfig.categories.getAll}`, { withCredentials: true });

            setCategory(response.data.categories.data);
        } catch (error) {
            console.error('Error fetching category:', error);
        } finally {
            setLoading(false); // End loading
        }
    }

    useEffect(() => {
        fetchCategory();
    }, [])
    

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
                <motion.div
                    initial={{ y: "100%" }} // Trượt từ dưới lên
                    animate={{ y: 0 }} // Trượt đến vị trí ban đầu
                    whileInView="visible" // Chạy hiệu ứng khi trong khung nhìn
                    viewport={{ once: true }}
                    transition={{ duration: 2 }}
                    variants={{
                        hidden: { opacity: 0, y: 50 }, // Điều chỉnh giá trị y để trượt từ dưới lên
                        visible: { opacity: 1, y: 0 },
                    }}
                >
                    <div className="max-w-screen-xl mx-auto px-4 flex items-center justify-between mb-4 lg:mb-6">
                        <div className="lg:h-[200px] h-auto w-full grid lg:grid-cols-4 grid-cols-2">
                            <div className="border border-gray-200 w-full h-full flex items-center group justify-center flex-col lg:gap-2 gap-1 p-2 dark:hover:bg-gray-600 hover:bg-gray-50 transition-all">
                                <RocketLaunchOutlinedIcon className="mb-2 lg:!w-10 lg:!h-10 !h-8 !w-8 text-black dark:text-white" />
                                <div className="text-lg text-[#666666] group-hover:text-black dark:group-hover:text-white font-medium group-hover:tracking-wider transition-all">
                                {t('free_shipping')}
                                </div>
                                <div className="text-sm text-[#c6c6c6]">{t('free_shipping_title')}</div>
                            </div>
                            <div className="border border-gray-200 w-full h-full group flex items-center justify-center flex-col lg:gap-2 gap-1 p-2 dark:hover:bg-gray-600 hover:bg-gray-50  transition-all">
                                <WhatsAppIcon className="mb-2 lg:!w-10 lg:!h-10 !h-8 !w-8 text-black dark:text-white" />
                                <div className="text-lg text-[#666666] group-hover:text-black dark:group-hover:text-white font-medium group-hover:tracking-wider transition-all">
                                {t('24/7_support')}
                                </div>
                                <div className="text-sm text-[#c6c6c6]">{t('24/7_support_title')}</div>
                            </div>
                            <div className="border border-gray-200 w-full h-full group flex items-center justify-center flex-col lg:gap-2 gap-1 p-2 dark:hover:bg-gray-600 hover:bg-gray-50  transition-all">
                                <Inventory2OutlinedIcon className="mb-2 lg:!w-10 lg:!h-10 !h-8 !w-8 text-black dark:text-white" />
                                <div className="text-lg text-[#666666] group-hover:text-black dark:group-hover:text-white font-medium group-hover:tracking-wider transition-all">
                                {t('free_returns')}
                                </div>
                                <div className="text-sm text-[#c6c6c6]">{t('free_returns_title')}</div>
                            </div>
                            <div className="border border-gray-200 w-full h-full group flex items-center justify-center flex-col lg:gap-2 gap-1 p-2 dark:hover:bg-gray-600 hover:bg-gray-50  transition-all">
                                <PaymentOutlinedIcon className="mb-2 lg:!w-10 lg:!h-10 !h-8 !w-8 text-black dark:text-white" />
                                <div className="text-lg text-[#666666] group-hover:text-black dark:group-hover:text-white font-medium group-hover:tracking-wider transition-all">
                                {t('order_online')}
                                </div>
                                <div className="text-sm text-[#c6c6c6]">Hotline: 0357 420 420</div>
                            </div>
                        </div>
                    </div>
                </motion.div>


                <motion.div>
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
                        <div className="max-w-screen-xl mx-auto px-4 flex items-center justify-between mb-2 lg:mb-6 lg:mt-20 mt-10">
                            <div className="text-black dark:text-white font-bold lg:text-4xl text-2xl">{t('flashsale')}</div>
                            <div className="flex items-center">
                                <div className="font-semibold lg:text-lg text-xs mr-2 text-black dark:text-white">{t('end_after')}</div>
                                <div>
                                    <div className="grid grid-flow-col gap-5 text-center auto-cols-max">
                                        <div className="flex flex-col p-2 items-center justify-center w-12 h-12 bg-main rounded-box text-white">
                                            <span className="countdown font-mono text-sm">
                                                <span style={{ "--value": 15 } as CSSProperties}></span>
                                            </span>
                                            <div className="text-[10px]">
                                            {t('day')}
                                            </div>
                                        </div>
                                        <div className="flex flex-col p-2 items-center justify-center w-12 h-12 bg-main rounded-box text-white">
                                            <span className="countdown font-mono text-sm">
                                                <span style={{ "--value": 10 } as CSSProperties}></span>
                                            </span>
                                            <div className="text-[10px]">
                                            {t('hour')}
                                            </div>
                                        </div>
                                        <div className="flex flex-col p-2 items-center justify-center w-12 h-12 bg-main rounded-box text-white">
                                            <span className="countdown font-mono text-sm">
                                                <span style={{ "--value": 24 } as CSSProperties}></span>
                                            </span>
                                            <div className="text-[10px]">
                                            {t('minute')}
                                            </div>
                                        </div>
                                        <div className="flex flex-col p-2 items-center justify-center w-12 h-12 bg-main rounded-box text-white">
                                            <span className="countdown font-mono text-sm">
                                                <span style={customStyle}></span>
                                            </span>
                                            <div className="text-[10px]">
                                            {t('second')}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                    <div className="max-w-screen-xl mx-auto px-4 mb-14">
                        <div className="lg:grid md:grid grid lg:grid-cols-4 grid-cols-2 gap-4">
                            {/* {flatProducts.slice(0, 8).map((product) => (
                                <BoxProductFlashSale key={product.id} product={product} />
                            ))} */}
                        </div>
                    </div>
                </motion.div>



                <div className="max-w-screen-xl mx-auto px-4 mb-20 ">
                    <div className="text-black dark:text-white font-bold text-4xl mb-6">{t('category')}</div>
                    <div>
                        <Swiper
                            modules={[Navigation, Pagination, Scrollbar, A11y, Mousewheel, Autoplay]}
                            spaceBetween={20}
                            slidesPerView={2} // 1 slide per view initially for mobile
                            autoplay={{ delay: 4000, disableOnInteraction: false }}
                            loop={true}
                            breakpoints={{
                                640: { // Tablet and larger phones
                                    slidesPerView: 2,
                                    spaceBetween: 20,
                                },
                                768: { // Desktop
                                    slidesPerView: 3,
                                    spaceBetween: 20,
                                },
                                1024: { // Larger desktops
                                    slidesPerView: 6,
                                    spaceBetween: 20,
                                },
                            }}
                        >
                            {category.map((item, index) => (
                                <SwiperSlide key={index}>
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }} // Bắt đầu nhỏ hơn
                                        whileInView={{ opacity: 1, scale: 1 }} // Lớn dần khi vào viewport
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }} // Hiệu ứng chậm dần cho mỗi box
                                    >
                                        <Link href={`${lang}/shop?category[]=${item.name}`} className="w-full">
                                            <div className="w-full max-w-[300px] h-auto max-h-[300px] group relative">
                                                <div className="flex w-full items-center justify-center rounded-full overflow-hidden">
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="w-[200px] max-h-[200px] h-[200px] object-cover rounded-lg"
                                                    />
                                                </div>
                                                <div className="flex items-center justify-center text-base lg:text-base font-semibold mt-2 text-black absolute bottom-0 w-full group-hover:-translate-y-[90px] group-hover:scale-150 transition-transform duration-300 ease-in-out">
                                                    <div className="bg-white px-1 w-max rounded-2xl min-w-[70px] flex items-center justify-center">
                                                        {item.name}
                                                    </div>
                                                </div>
                                            </div>

                                        </Link>
                                    </motion.div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>


                <motion.div
                    initial="hidden" // Bắt đầu với trạng thái ẩn
                    whileInView="visible" // Chạy hiệu ứng khi trong khung nhìn
                    viewport={{ once: false }} // Chạy lại hiệu ứng khi cuộn lại
                    transition={{ duration: 1 }} // Thay đổi thời gian nếu cần
                    variants={{
                        hidden: { opacity: 0, y: 50 }, // Trạng thái ẩn
                        visible: { opacity: 1, y: 0 }, // Trạng thái hiện tại
                    }}
                >
                    <div className="max-w-screen-xl mx-auto px-4 mb-16">
                        <div className="flex gap-4">
                            <div className="lg:w-1/4 lg:block hidden">
                                <div className="text-black dark:text-white font-bold lg:text-4xl w-max text-2xl mb-6">{t('featured_products')}</div>
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
                                                {/* {flatProducts.slice(0, 6).map((product) => (
                                                    <BoxProduct key={product.id} product={product} />
                                                ))} */}
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
                </motion.div>


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
                        <div className="lg:text-4xl text-2xl font-semibold mb-3 text-black dark:text-white">
                            Giảm giá <span className="text-[40px] text-main">10%</span><br />cho các sản phẩm ưa thích
                        </div>
                        <div className="mb-6 font-normal text-lg text-black dark:text-white">
                            Chúng tôi đang cung cấp ưu đãi đặc biệt giảm giá 10% cho các sản phẩm ưa thích. Đây là cơ hội tuyệt vời để bạn sở hữu những sản phẩm yêu thích với giá hấp dẫn. Nhanh tay để không bỏ lỡ!
                        </div>
                        <div>
                            <Link href="/shop">
                                <Button variant="bordered" className="border-main text-main">
                                    {t('see_more')}
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

                <motion.div
                    initial="hidden" // Bắt đầu với trạng thái ẩn
                    whileInView="visible" // Chạy hiệu ứng khi trong khung nhìn
                    viewport={{ once: false }} // Chạy lại hiệu ứng khi cuộn lại
                    transition={{ duration: 1 }} // Thay đổi thời gian nếu cần
                    variants={{
                        hidden: { opacity: 0, y: 50 }, // Trạng thái ẩn
                        visible: { opacity: 1, y: 0 }, // Trạng thái hiện tại
                    }}
                >
                    <div className="max-w-screen-xl mx-auto px-4 mb-16">
                        <div className="flex justify-between items-center mb-6">
                            <div className="text-black dark:text-white font-bold lg:text-4xl text-2xl">{t('new_products')}</div>
                            <div className="font-medium text-sm text-main">
                                <Link href="/shop?new" className="text-main">{t('see_more')}</Link></div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:grid-rows-2 gap-4">
                            <div className="lg:col-span-2 md:col-span-3 col-span-2">
                                <img src={`/images/bn-7.jpeg`} alt="A cat sitting on a chair" className="w-full h-full object-cover rounded-lg" />
                            </div>
                            {/* {flatProducts.slice(0, 6).map((product) => (
                                <BoxProduct key={product.id} product={product} />
                            ))} */}
                        </div>


                    </div>
                </motion.div>

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
                            <div className="text-4xl font-semibold mb-3 text-black dark:text-white">Ưu Đãi Hấp Dẫn – Mua Nhiều Tiết Kiệm Nhiều</div>
                            <div className="mb-6 font-normal text-lg text-black dark:text-white">
                                Chúng tôi luôn có những chương trình khuyến mãi đặc biệt giúp bạn tiết kiệm chi phí. Đừng bỏ lỡ cơ hội nhận ngay những ưu đãi độc quyền khi mua sắm trên trang web của chúng tôi.
                            </div>
                            <div>
                                <Link href="/shop">
                                    <Button variant="bordered" className="border-main text-main">{t('see_more')}</Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </motion.div>

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
                    <div className="max-w-screen-xl mx-auto px-4 mb-16">
                        <div className="flex justify-between mb-6 items-center">
                            <div className="font-bold lg:text-4xl text-2xl text-black dark:text-white">Thịt Đông Lạnh Nhập Khẩu Hàng Đầu Thế Giới</div>
                            <div className="font-medium text-sm text-main">{t('see_more')}</div>
                        </div>
                        <div>
                            <div className="lg:grid md:grid grid lg:grid-cols-4 grid-cols-2 gap-4">
                                {/* {flatProducts.slice(0, 8).map((product) => (
                                    <BoxProduct key={product.id} product={product} />
                                ))} */}
                            </div>
                        </div>
                    </div>
                </motion.div>

                <div className="max-w-screen-xl mx-auto px-4 mb-16">
                    <div className="flex items-center justify-between mb-6">
                        <div className="font-bold text-4xl text-black dark:text-white">Tin tức mới</div>
                        <div className="font-medium text-sm text-main">{t('see_more')}</div>
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
                        <img src={`/images/bn-8.png`} alt="A cat sitting on a chair" className="object-cover w-full h-full rounded-lg" />

                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg"></div>

                        <div className="absolute inset-0 flex flex-col justify-center items-center text-white z-10">
                            {/* Hiệu ứng cho dòng text khi scroll tới */}
                            <motion.p
                                className="text-lg"
                                initial={{ opacity: 0, y: -50, scale: 0.8 }} // Trượt từ trên xuống và nhỏ dần
                                whileInView={{ opacity: 1, y: 0, scale: 1 }} // Khi scroll tới, trượt về đúng vị trí và lớn lên
                                viewport={{ once: true }} // Chỉ chạy hiệu ứng một lần khi cuộn tới
                                transition={{ duration: 1.2, ease: "easeOut" }} // Thời gian chuyển động
                            >
                                Ăn Ngon Mỗi Ngày
                            </motion.p>

                            <motion.h1
                                className="text-4xl font-bold mt-2 text-center"
                                initial={{ opacity: 0, y: -50, scale: 0.8 }} // Trượt từ trên xuống và nhỏ dần
                                whileInView={{ opacity: 1, y: 0, scale: 1 }} // Khi scroll tới, trượt về đúng vị trí và lớn lên
                                viewport={{ once: true }} // Chỉ chạy hiệu ứng một lần khi cuộn tới
                                transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }} // Thêm độ trễ
                            >
                                Korean Abalone Products
                            </motion.h1>

                            {/* <motion.button
        className="mt-4 px-6 py-3 bg-transparent border border-white rounded-full hover:bg-white hover:text-black transition"
        initial={{ opacity: 0, y: -50, scale: 0.8 }} // Trượt từ trên xuống và nhỏ dần
        whileInView={{ opacity: 1, y: 0, scale: 1 }} // Khi scroll tới, trượt về đúng vị trí và lớn lên
        viewport={{ once: true }} // Chỉ chạy hiệu ứng một lần khi cuộn tới
        transition={{ duration: 1.8, ease: "easeOut", delay: 0.4 }} // Thêm độ trễ cho button
      >
        Xem video →
      </motion.button> */}
                        </div>
                    </div>
                </div>



                <InfiniteScroll />

            </div>
        </div>
    );
}

export default BodyHome;