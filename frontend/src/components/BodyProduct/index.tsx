'use client'
import { useState, useEffect } from 'react';
import { useParams } from "next/navigation";
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import { number } from 'yup';

import { ProductProps, Variant } from '@/src/interface';
import { SingleProduct } from '@/src/interface';
import { RadioGroup, Radio, useRadio, VisuallyHidden, RadioProps, cn } from "@nextui-org/react";
import { addItem } from '@/src/store/cartSlice';
import { Button, Divider } from '@nextui-org/react';

// import { useProducts } from '@/src/hooks/product';

import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

import ImageSwiper from '../SliderImageProductDetail';
// import RecentlyViewed from '../RecentlyViewed/RecentlyViewed';
import BoxProduct from '../BoxProduct';
import Loading from '../ui/Loading';
import BreadcrumbNav from '../Breadcrum';

import apiConfig from '@/src/config/api';
import axios from 'axios';

interface CustomRadioProps extends RadioProps {
    isSelected: boolean;
}

const CustomRadio = ({ isSelected, children, ...props }: CustomRadioProps) => {
    const {
        Component,
        getBaseProps,
        getInputProps,
        getLabelProps,
        getLabelWrapperProps,
    } = useRadio(props);

    return (
        <Component
            {...getBaseProps()}
            className={cn(
                "group flex items-center justify-between hover:bg-content2",
                "w-max cursor-pointer border-2 border-default rounded-lg gap-4 p-1 pr-3 font-medium ",
                isSelected ? "data-[selected=true]:bg-main border-main !text-white" : "border-gray-300" // Điều chỉnh kiểu khi được chọn
            )}
        >
            <VisuallyHidden>
                <input {...getInputProps()} />
            </VisuallyHidden>
            <div {...getLabelWrapperProps()}>
                {children && <span {...getLabelProps()}>{children}</span>}
            </div>
        </Component>
    );
};

function BodyProduct() {
    const { id } = useParams(); // get id product
    const [product, setProduct] = useState<Variant | null>(null);
    const [activeVariant, setActiveVariant] = useState<string | null>(null);
    const router = useRouter();
    // const image = product?.images || [];

    const [activeTab, setActiveTab] = useState<number>(0);
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [priceDiscount, setPriceDiscount] = useState(0);

    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);

    const dispatch = useDispatch();
    // const cart = useSelector((state) => state.cart);
    // const { flatProducts } = useProducts(); // Use updated hook without filters

    const handleQuantityChange = (value: number) => {
        if (value > 0) {
            setQuantity(value);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${apiConfig.products.getproductvariantsbyid}${id}`);
                setProduct(response.data.product);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching product data:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    console.log(product);




    console.log(id);


    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        handleResize(); // Check initial size
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleTabClick = (index: number) => {
        if (isMobile) {
            setActiveTab(index);
        } else {
            // Smooth scroll to the section on desktop
            const element = document.getElementById(`section-${index}`);
            if (element) {
                element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
            }
        }
    };

    const getLowerPrice = (discountedPrice: string | undefined, flashSalePrice: string | undefined): string => {
        const discounted = parseFloat(discountedPrice || "0");
        const flashSale = parseFloat(flashSalePrice || "0");
        return Math.min(discounted, flashSale).toLocaleString('vi-VN');
    };

    //     const handleAddToCart = () => {
    //         if (product) {
    //             const salePrice = product.price - (product.price * product.discount) / 100;

    //             // dispatch(addItem({
    //             //     id: product.id,
    //             //     name: product.name,
    //             //     images: product.images,
    //             //     price: product.price,
    //             //     salePrice: salePrice,
    //             //     quantity: quantity,
    //             //     select: false,
    //             //     // stock: product.stock,
    //             // }));

    //             toast.success('Thêm sản phẩm thành công');
    //             setQuantity(1);
    //         } else {
    //             toast.error('Thêm sản phẩm thất bại');
    //         }
    //     };

    //   const handleVariantChange = (variantId: string) => {
    //     const selectedVariant = product?.variants.find((variant) => variant.id === variantId);
    //     if (selectedVariant) {

    //         setActiveVariant(selectedVariant.id);

    //         // Update the URL without a full page reload
    //         const newUrl = `/product/${selectedVariant.id}`;
    //         router.push(newUrl, undefined);


    //     }
    // };

    // useEffect(() => {
    //     if (product && activeVariant) {
    //         const selectedVariant = product.variants.find(variant => variant.id === activeVariant);
    //         if (selectedVariant) {
    //             const discount = selectedVariant.discount ? selectedVariant.price * (1 - selectedVariant.discount / 100) : selectedVariant.price;
    //             setPriceDiscount(discount);
    //         }
    //     }
    // }, [activeVariant, product]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loading />
            </div>
        );
    }



    return (
        <div className="max-w-screen-xl lg:mx-auto mx-4 px-4">
            <div className="py-5 h-[62px]">
                <BreadcrumbNav
                    items={[
                        { name: 'Trang chủ', link: '/' },
                        { name: 'Sản phẩm', link: '/shop' },
                        { name: product?.name || "", link: "#", },
                    ]}
                />
            </div>

            <div className='flex gap-10 lg:flex-row flex-col-reverse mb-20'>
                <div className='lg:w-1/2 w-full'>
                    <div className='lg:text-3xl text-2xl font-bold mb-4'>{product?.name}</div>
                    <div className="flex items-center mb-4">
                        {/* Ratings section */}
                        {[...Array(4)].map((_, i) => (
                            <svg key={i} className="w-4 h-4 text-yellow-300 me-1" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                            </svg>
                        ))}
                        <svg className="w-4 h-4 text-gray-300 me-1 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                        </svg>
                        <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">4.95</p>
                        <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">out of</p>
                        <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">5</p>
                    </div>

                    <div className='lg:text-base text-[13px] font-normal mb-4'>Tình trạng: <span className='text-red-600 font-bold'>{product && product.stock !== undefined && product.stock > 0 ? 'còn hàng' : 'hết hàng'}
                    </span></div>

                    <div className='flex gap-5 items-center mb-4'>
                    <div className='font-bold text-3xl text-price'>
                    {getLowerPrice(product?.DiscountedPrice?.toString(), product?.FlashSalePrice?.toString())} đ
                        </div>
                        <div className='flex flex-col font-normal text-base'>
                            {product?.discount !== undefined && product.discount > 0 ? (
                                <div>
                                    <div className='line-through'>{product?.price.toLocaleString('vi-VN')} đ</div>
                                    <div className='text-price'>
                                        Khuyến mãi <span>{product.discount}%</span>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>

                    <div className='mb-4'>
                        {/* <RadioGroup label="" orientation="horizontal" value={activeVariant}>
                            {product?.variants.map((item) => (
                                <CustomRadio
                                    key={item.id}
                                    value={item.id}
                                    onChange={() => handleVariantChange(item.id)}
                                    isSelected={activeVariant === item.id} // Xác định biến thể đang được chọn
                                >
                                    {item.name}
                                </CustomRadio>
                            ))}
                        </RadioGroup> */}


                    </div>

                    {/* <div className='font-normal text-sm mb-4'>
                        Mã sản phẩm: 2320320320
                    </div> */}

                    <div className='font-normal text-sm mb-5'>
                        {product?.product?.description}
                    </div>

                    {/* {product && product.stock !== undefined && product.stock > 0 ? */}
                        <div>

                            <div className="flex gap-2">
                                <Link href={`/vi/shop?category%5B%5D=${product?.product?.category?.name}`}>
                                    <span className="flex p-[2px] lg:text-sm text-xs lg:py-[2px] lg:px-1 items-center justify-center w-fit rounded-lg border border-gray-400">{product?.product?.category?.name}</span>
                                </Link>
                                <Link href={`/vi/shop?category%5B%5D=${product?.product?.brand?.name}`}>
                                    <span className="flex p-[2px] lg:text-sm text-xs lg:py-[2px] lg:px-1 items-center justify-center w-fit rounded-lg border border-gray-400">{product?.product?.brand?.name}</span>
                                </Link>
                            </div>

                            <div className="flex items-center gap-7 text-black py-5">
                                <span className="text-base sm:text-xl font-semibold">Số lượng</span>
                                <div className="flex items-center border border-gray-300">
                                    <button className="p-2" onClick={() => handleQuantityChange(quantity - 1)}>-</button>
                                    <Divider orientation="vertical" />
                                    <input
                                        type="text"
                                        value={quantity}
                                        onChange={(e) => handleQuantityChange(Number(e.target.value))}
                                        min={1}
                                        className="w-16 text-center border-none outline-none"
                                    />
                                    <Divider orientation="vertical" />
                                    <button className="p-2" onClick={() => handleQuantityChange(quantity + 1)}>+</button>
                                </div>

                            </div>

                            <div className="flex flex-row gap-3">
                                {/* <Button onClick={handleAddToCart} className="flex flex-1 bg-[#FFC535] border border-[#FFC535] text-base text-white font-semibold rounded py-7">
                                    <AddShoppingCartIcon /> Thêm vào giỏ hàng
                                </Button> */}
                                <Button className="flex flex-1 bg-[#f79a9a] text-base text-red-600 border-2 border-red-600 font-semibold rounded py-7">
                                    <FavoriteBorderIcon />Yêu thích
                                </Button>
                                <Button className="flex flex-1 bg-[#f79a9a] text-base text-red-600 border-2 border-red-600 font-semibold rounded py-7">
                                    <FavoriteIcon />Đã thích
                                </Button>
                            </div>
                        </div>
                        
                        <div></div>
                    {/* } */}


                </div>
                <div className='flex-1'>
                <ImageSwiper imgDemo={[product?.image || '', ...(product?.product?.product_images?.map(img => img.image) || [])]} />
                </div>
            </div>

            <div className='mb-10'>
                <div className="w-full">
                    {/* Tab Links */}
                    <div className="flex border-b border-gray-300 mb-4 lg:border-b-0 lg:text-xl text-lg">
                        {['Mô Tả', 'Giới Thiệu', 'Nhận Xét Sản Phẩm'].map((tab, index) => (
                            <button
                                key={index}
                                className={`flex-1 py-2 text-center lg:border-b-2 lg:border-transparent ${activeTab === index && isMobile ? 'border-b-2 border-black' : ''
                                    }`}
                                onClick={() => handleTabClick(index)}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content Sections */}
                    <div className="block lg:hidden">
                        {/* Show only active tab content on mobile */}
                        {activeTab === 0 && <div className="content-section font-bold text-3xl">
                            <div className='text-center font-boldtext-4xl mb-4'>
                                Content of Giới Thiệu
                            </div>
                            <div>
                                <div className='font-bold text-2xl'>Thông tin sản phẩm</div>
                                <div className='font-normal text-base'>
                                    <div>Thương hiệu: TRUST FARM, GREEN CATTLE, SEAFOOD KINGDOM, YUMPO, JINSHIM ABALONE KOREA </div>
                                </div>
                            </div>
                        </div>}
                        {activeTab === 1 && <div className="content-section text-center font-bold text-3xl">Content of Giới Thiệu</div>}
                        {activeTab === 2 && <div className="content-section text-center font-bold text-3xl">Content of Nhận Xét Sản Phẩm</div>}
                    </div>

                    {/* Content Sections - Always visible on Desktop */}
                    <div className="hidden lg:block">
                        <div id="section-0" className="content-section py-5 mb-10">
                            <div className='text-center font-bold lg:text-4xl mb-4'>
                                Content of Mô Tả
                            </div>
                        </div>
                        <div id="section-1" className="content-section py-5 mb-10">

                            <div className='text-center font-bold lg:text-4xl mb-4'>
                                Content of Giới Thiệu
                            </div>
                            <div>
                                <div className='font-bold text-2xl'>Thông tin sản phẩm</div>
                                <div className='font-normal text-base'>
                                    <div>Thương hiệu: TRUST FARM, GREEN CATTLE, SEAFOOD KINGDOM, YUMPO, JINSHIM ABALONE KOREA </div>
                                </div>
                            </div>
                        </div>
                        <div id="section-2" className="content-section py-5">
                            <div className='text-center font-bold lg:text-4xl mb-4'>
                                Content of Nhận Xét Sản Phẩm
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* <div className='mb-10'>
                <div className="flex items-center mb-4">
                    <span className="font-bold text-2xl">Sản Phẩm Tương Tự</span>
                    <div className="flex-grow border-t border-black ml-4" />
                </div>
                <div>
                    <div className="lg:grid md:grid grid lg:grid-cols-4 grid-cols-2 gap-4">
                        {flatProducts.slice(0, 4).map((product) => (
                            <BoxProduct key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </div> */}

            <div>
                <div className="flex items-center mb-4">
                    <span className="font-bold text-2xl">Đã Xem Gần Đây</span>
                    <div className="flex-grow border-t border-black ml-4" />
                </div>
                <div>
                    <div>
                        {/* <  {DUMP_PRODUCTS.slice(0, 4).map((product) => (
                            <BoxProduct key={product.id} product={product} />
                        ))}> */}
                        {/* <RecentlyViewed /> */}

                    </div>
                </div>
            </div>
        </div>
    );
}

export default BodyProduct;