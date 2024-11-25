'use client'
import { useState, useEffect, useMemo } from 'react';
import { useParams } from "next/navigation";
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { number } from 'yup';

import { CartItem, ProductProps, Variant } from '@/src/interface';
import { SingleProduct } from '@/src/interface';
import { RadioGroup, Radio, useRadio, VisuallyHidden, RadioProps, cn } from "@nextui-org/react";
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
import Cookies from 'js-cookie';

import { addToCart, updateCart } from '@/src/store/cartSlice';
import { fetchUserProfile } from '@/src/config/token';

interface CustomRadioProps extends RadioProps {
    isSelected: boolean;
}

// import { ItemCart } from '@/src/interface';

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
    const token = Cookies.get('access_token'); // Get token from cookies
    const { id } = useParams(); // get id product
    const [product, setProduct] = useState<Variant | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [productFavourite, setProductFavourite] = useState<Variant | null>(null);
    const [activeVariant, setActiveVariant] = useState<string | null>(null);
    const router = useRouter();
    // const image = product?.images || [];

    const [activeTab, setActiveTab] = useState<number>(0);
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [priceDiscount, setPriceDiscount] = useState(0);
    const [variantsPr, setVariantsPr] = useState<Variant[]>([]);
    const [variantsRelated, setVariantsRelated] = useState<Variant[]>([]);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [isFavorited, setIsFavorited] = useState<boolean>(false);
    const [mainPrice, setMainPrice] = useState<number | null>(null);

    useEffect(() => {
        const getUserId = async () => {
            try {
                const userProfile = await fetchUserProfile(); // Fetch user profile using token
                setUserId(userProfile.id); // Set user ID from the fetched profile
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };

        getUserId(); // Call the function to get user ID
    }, [token]); 

    useEffect(() => {
        const fetchProductFavourite = async () => {
            if (userId) {
                try {
                    const response = await axios.get(`${apiConfig.favourite.getFavouriteById}${userId}`);

                    // Check if the response data is empty
                    if (response.data && response.data.length > 0) {
                        // console.log(response.data);
                        const favorites = response.data; // Assuming this returns an array of favorite products
                        const isProductFavorited = favorites.some((fav: Variant) => fav.id === product?.id); // Check if current product is in favorites
                        setIsFavorited(isProductFavorited); // Update state
                    } else {
                        // If no favorites found, set isFavorited to false
                        setIsFavorited(false);
                    }
                } catch (error: any) { // Specify the type of error as 'any'
                    console.error('Error fetching favorites:', error); // Handle errors
                    setIsFavorited(false); // Ensure isFavorited is false on error
                }
            } else {
                setIsFavorited(false); // Ensure isFavorited is false if no user ID
            }
        };
        fetchProductFavourite();
    }, [userId, product]);

    const dispatch = useDispatch();
    // const cart = useSelector((state) => state.cart);
    // const { flatProducts } = useProducts(); // Use updated hook without filters

    const handleQuantityChange = (value: number) => {
        if (value > 0) {
            setQuantity(value);
        }
    };

    useEffect(() => {
        const fetchRelatedVariants = async () => {
            const response = await axios.get(`${apiConfig.products.getRelatedVariants}${id}`);
            setVariantsRelated(response.data.relatedVariants);
        };
        fetchRelatedVariants();
    }, [id]);


   


    // ... existing code ...

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

    // console.log(product);

    useEffect(() => {
        const fetchProductPromotion = async () => {
            if (product && product.product_id) { // Ensure product and product_id are defined
                try {
                    const response = await axios.get(`${apiConfig.products.getproductvariants}${product.product_id}`, { withCredentials: true });
                    setVariantsPr(response.data.productVariants.data);
                } catch (error) {
                    console.error('Error fetching products:', error);
                }
            } else {
                console.warn('Product or product_id is undefined, skipping fetch.');
            }
        };
        fetchProductPromotion();
    }, [product]);

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

    useEffect(() => {
        if (product) {
            if (product && product.flash_sales.length > 0) { // Check if flash_sales has elements
                const flashSaleStock = product.flash_sales[0].pivot.stock; // Assuming flash_sales is an array
                if (flashSaleStock === 0) {
                    setMainPrice(product.DiscountedPrice ?? null); // Set to DiscountedPrice or null if undefined
                } else {
                    setMainPrice(product.FlashSalePrice ?? null); // Set to the regular price or null if undefined
                }
            } else {
                setMainPrice(product.DiscountedPrice ?? null);
            }
        }
    }, [product]);



    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loading />
            </div>
        );
    }



    const handleAddToFavorites = async (productVariantId: number) => {
        if (!userId) {
            toast.error('Bạn cần đăng nhập để thêm sản phẩm vào yêu thích.');
            return;
        }

        const body = {
            user_id: parseInt(userId), // Parse user ID
            product_variant_id: productVariantId,
        };

        try {
            if (isFavorited) {
                // If already favorited, remove from favorites
                const response = await axios.post(`${apiConfig.favourite.acitonFavourite}`, body, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true, // Ensure cookies are sent
                });
                if (response.status === 204) {
                    setIsFavorited(false); // Update state
                    toast.success('Sản phẩm đã được bỏ yêu thích!'); // Thông báo khi bỏ yêu thích
                }
            } else {
                // If not favorited, add to favorites
                const response = await axios.post(apiConfig.favourite.acitonFavourite, body, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true, // Ensure cookies are sent
                });
                if (response.status === 201) {
                    setIsFavorited(true); // Update state
                    toast.success('Sản phẩm đã được thêm vào yêu thích!');
                }
            }
        } catch (error: any) {
            console.error('Error updating favorites:', error);
            if (error.response) {
                console.error('Response data:', error.response.data);
                toast.error('Có lỗi xảy ra khi cập nhật yêu thích.'); // Thông báo lỗi
            }
        }
    };

// ... existing code ...

const handleAddToCart = async () => {
    const body = {
        user_id: userId ? parseInt(userId) : null, // Parse user ID if it exists
        product_variant_id: product?.id, // Ensure product ID is used
        quantity: quantity, // Use the quantity state
    };

    if (!userId) {
        // If user is not logged in, store in cookie
        const cartItems = JSON.parse(Cookies.get('cart_items') || '{"cart_items": []}');
        
        // Check if the product is already in the cart
        const existingItemIndex = cartItems.cart_items.findIndex((item: CartItem) => item.product_variant_id === body.product_variant_id);
        
        if (existingItemIndex > -1) {
            // If the product is already in the cart, update the quantity
            cartItems.cart_items[existingItemIndex].quantity += body.quantity;
        } else {
            // If the product is not in the cart, add it
            cartItems.cart_items.push({
                user_id: null,
                product_variant_id: body.product_variant_id,
                quantity: body.quantity,
                product_variant: {
                    id: product?.id, // Add the product_variant if needed
                    image: product?.image,
                    name: product?.name,
                    price: product?.price,
                    Discount: product?.discount,
                    FlashSalePrice: product?.FlashSalePrice,
                    DiscountedPrice: product?.DiscountedPrice,
                    priceMain: mainPrice
                }
            });

            dispatch(addToCart({
                user_id: null,
                product_variant_id: body.product_variant_id,
                quantity: quantity, // Use the quantity state
                product: product, // Add the product object
                product_variant: product?.id, // Add the product_variant if needed
            } as unknown as CartItem)); 
        }

        Cookies.set('cart_items', JSON.stringify(cartItems), { expires: 7 }); // Store cart in cookie for 7 days
        toast.success('Sản phẩm đã được thêm vào giỏ hàng tạm thời!'); // Notify user
    } else {
        // If user is logged in, check for existing cart items in cookies
        const existingCartItems = JSON.parse(Cookies.get('cart_items') || '{"cart_items": []}');
        if (existingCartItems.cart_items.length > 0) {
            // Prepare items for moving to database
            const itemsToMove = existingCartItems.cart_items.map((item: CartItem) => ({
                user_id: userId ? parseInt(userId) : null, // Set user_id to null for each item
                product_variant_id: item.product_variant_id,
                quantity: item.quantity,
            }));

            // Move existing cart items to database
            // try {
            //     await axios.post(`${apiConfig.cart.moveCartToDatabase}`, {
            //         user_id: parseInt(userId),
            //         cart_items: itemsToMove,
            //     }, {
            //         headers: {
            //             'Content-Type': 'application/json',
            //         },
            //         withCredentials: true, // Ensure cookies are sent
            //     });
            //     // Clear the cart in cookies after moving to database
            //     Cookies.remove('cart_items');
            //     toast.success('Giỏ hàng tạm thời đã được chuyển vào giỏ hàng của bạn!'); // Notify user
            // } catch (error) {
            //     console.error('Error moving cart to database:', error);
            //     toast.error('Có lỗi xảy ra khi chuyển giỏ hàng vào cơ sở dữ liệu.'); // Notify error
            // }
        }

        // Now add the current item to the cart in the database
        try {
            const response = await axios.post(`${apiConfig.cart.addToCart}`, body, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true, // Ensure cookies are sent
            });

            if (response.status === 200) {
                dispatch(addToCart({
                    user_id: parseInt(userId),
                    product_variant_id: product?.id, // Ensure product ID is used
                    quantity: quantity, // Use the quantity state
                    product: product, // Add the product object
                    product_variant: product?.id, // Add the product_variant if needed
                } as unknown as CartItem)); 
                toast.success('Sản phẩm đã được thêm vào giỏ hàng!'); 
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            toast.error('Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng.'); // Notify error
        }
    }
};

const handleBuyNow = async () => {
    

    const checkoutData = {
        productId: product?.id, // Use the current product ID
        selectedItems: [{
            id: product?.id,
            quantity: quantity, // Use the quantity state
            name: product?.name || '', // Get name for the selected item
            image: product?.image || '' // Get image for the selected item
        }],
        totalAmount: mainPrice, // Save total amount
        pointCart: 0, // Assuming no loyalty points for now
    };

    Cookies.set('checkout_data', JSON.stringify(checkoutData)); // Save selected items and total amount to cookies
    router.push('/checkout'); // Redirect to checkout page
};

const fetchUpdatedCart = async (userId: string) => {
    try {
        const response = await axios.get(`${apiConfig.cart.getCartByUserId}${userId}`, { withCredentials: true });
        if (response.data && response.data.cart_items) {
            // Dispatch an action to update the cart in Redux
            dispatch(updateCart(response.data.cart_items)); // You need to create this action
        }
    } catch (error) {
        console.error('Error fetching updated cart:', error);
    }
};

// ... existing code ...

    // const addToCart = async () => {
    //     const body = {
    //         quantity: quantity, // Use the quantity state
    //         product_variant_id: product?.id, // Ensure product ID is used
    //     };

    //     console.log("Sending to cart:", body); // Debug log

    //     try {
    //         const response = await fetch(apiConfig.cart.addToCart, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify(body),
    //             credentials: 'include', // Ensure cookies are sent
    //         });

    //         // Kiểm tra mã trạng thái
    //         if (!response.ok) {
    //             console.error('Failed to add to cart:', response.status);
    //             toast.error('Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng.');
    //             return;
    //         }

    //         // Chỉ đọc nội dung một lần
    //         const data = await response.json(); // Đọc nội dung JSON
    //         console.log('Added to cart:', data);
    //         toast.success(data.message); // Sử dụng thông điệp từ phản hồi
    //     } catch (error) {
    //         console.error('Error adding to cart:', error);
    //         toast.error('Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng.');
    //     }
    // };

    // ... existing code ...


    // ... existing code ...
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
                   <div className='flex items-center justify-between'>
                   <div className='lg:text-3xl text-2xl font-bold mb-4 dark:text-white'>{product?.name}</div>
                    <div className='cursor-pointer'>
                    {isFavorited ? ( // Conditional rendering based on isFavorited state
                                <div  className=" text-red-600">
                                    <FavoriteIcon onClick={() => handleAddToFavorites(product?.id as number)}/>
                                </div>
                            ) : (
                                <div
                                    // Ensure product ID is treated as a number
                                    className=" text-red-600"
                                >
                                    <FavoriteBorderIcon  onClick={() => handleAddToFavorites(product?.id as number)}/>
                                </div>
                            )}
                    </div>
                   </div>
                    {/* <div className="flex items-center mb-4">
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
                    </div> */}

                    <div className='lg:text-base text-[13px] font-normal mb-4 dark:text-white'>Tình trạng: <span className='text-red-600 font-bold'>{product && product.stock !== undefined && product.stock > 0 ? 'còn hàng' : 'hết hàng'}
                    </span></div>

                    <div className='flex gap-5 items-center mb-4'>
                        <div className='font-bold text-3xl text-price'>
                            {mainPrice?.toLocaleString('vi-VN')} đ
                        </div>
                        <div className='flex flex-col font-normal text-base'>
                            {product?.discount !== undefined && product.discount > 0 ? (
                                <div>
                                    <div className='line-through dark:text-white'>{product?.price.toLocaleString('vi-VN')} đ</div>
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

                    <div className='flex gap-2 mb-4'>
                        {variantsPr?.map((item) => (
                            <a href={`/product/${item.id}`} key={item.id}>
                                <div className={`py-1 px-2 border font-medium dark:text-white border-main text-main rounded-lg ${product?.id === item.id ? 'bg-main dark:text-white text-white border-main' : ''}`}>
                                    {item.variant_value}
                                </div>
                            </a>
                        ))}
                    </div>

                    <div className='font-normal text-sm mb-5 dark:text-white'>
                        {product?.product?.description}
                    </div>

                    {/* {product && product.stock !== undefined && product.stock > 0 ? */}
                    <div>

                        <div className="flex gap-2">
                            <Link href={`/shop?category%5B%5D=${product?.product?.category?.name}`}>
                                <span className="flex p-[2px] lg:text-sm text-xs lg:py-[2px] lg:px-1 items-center justify-center w-fit rounded-lg border border-gray-400 dark:text-white">{product?.product?.category?.name}</span>
                            </Link>
                            <Link href={`/shop?brand%5B%5D=${product?.product?.brand?.name}`}>
                                <span className="flex p-[2px] lg:text-sm text-xs lg:py-[2px] lg:px-1 items-center justify-center w-fit rounded-lg border border-gray-400 dark:text-white">{product?.product?.brand?.name}</span>
                            </Link>
                        </div>

                        <div className="flex items-center gap-7 text-black py-5">
                            <span className="text-base sm:text-xl font-semibold dark:text-white">Số lượng</span>
                            <div className="flex items-center border border-gray-300 dark:text-white !bg-transparent">
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
                            <Button onClick={handleAddToCart} className="flex flex-1 bg-[#FFC535] border border-[#FFC535] text-base text-white font-semibold rounded py-7">
                                <AddShoppingCartIcon /> Thêm vào giỏ hàng
                            </Button>
                           
                            <Button onClick={handleBuyNow} className="flex flex-1 text-[#FFC535] border border-[#FFC535] text-base bg-transparent font-semibold rounded py-7">
                                <AddShoppingCartIcon /> Mua ngay
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
                            <div className='font-bold text-2xl dark:text-white'>Mô tả sản phẩm</div>
                            <div className='dark:text-white'>
                                {product?.product?.description}
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
                    <span className="font-bold text-2xl dark:text-white">Sản phẩm tương tự</span>
                    <div className="flex-grow border-t border-black ml-4" />
                </div>
                <div>
                    <div className="lg:grid md:grid grid lg:grid-cols-4 grid-cols-2 gap-4">
                        {variantsRelated.map((product) => (
                            <BoxProduct key={product.id} product={product} />
                        ))}
                        {/* <RecentlyViewed /> */}

                    </div>
                </div>
            </div>
        </div>
    );
}

export default BodyProduct;