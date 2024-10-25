'use client'
import '../../styles/globals.css'

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

import SearchIcon from '@mui/icons-material/Search';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import HomeIcon from '@mui/icons-material/Home';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import SellOutlinedIcon from '@mui/icons-material/SellOutlined';
import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined';
import HeadsetOutlinedIcon from '@mui/icons-material/HeadsetOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import DeleteIcon from '@mui/icons-material/Delete';

import { Spinner } from "@nextui-org/react";
import { Tooltip, Button } from "@nextui-org/react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import { Input } from '@nextui-org/react';
import { Navbar, NavbarMenuToggle, NavbarMenuItem, NavbarMenu, NavbarContent, NavbarItem } from "@nextui-org/react"
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar, User } from "@nextui-org/react";
import { Brand, CartItem, Category, Variant } from '@/src/interface';
import useDebounce from '@/src/utils';
import { signIn, signOut, useSession } from "next-auth/react";

import { RootState } from '@/src/store/store';
import './style.scss'
import TooltipCu from '../ui/Tootip';
import apiConfig from '@/src/config/api';
import { logout } from '@/src/store/userSlice';
// import { updateQuantity } from '@/src/store/cartSlice';
// import { DUMP_PRODUCTS } from '@/src/dump';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';

const menuItems = [
    { href: '/store', icon: <LocationOnOutlinedIcon className="lg:w-4 lg:h-4" />, text: 'Hệ thống cửa hàng' },
    { href: '/', icon: <SellOutlinedIcon className="lg:w-4 lg:h-4" />, text: 'Đăng kí bán hàng' },
    { href: '/', icon: <AutorenewOutlinedIcon className="lg:w-4 lg:h-4" />, text: 'Chính sách đổi trả' },
    { href: '/', icon: <HeadsetOutlinedIcon className="lg:w-4 lg:h-4" />, text: 'Trung tâm hỗ trợ' },
    { href: '/', icon: <InfoOutlinedIcon className="lg:w-4 lg:h-4" />, text: 'Hướng dẫn' },
];

function Header({ params }: { params: { lang: string } }) {
    const dispatch = useDispatch();
    const router = useRouter();
    const [userData, setUserData] = useState<any>(null);
    // const cart = useSelector((state: any) => state.cart.items);
    const [cartCount, setCartCount] = useState<number>(0);
    const [products, setProducts] = useState<Variant[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Variant[]>([]);
    const [search, setSearch] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [loading, setLoading] = useState(false);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const debouncedSearch = useDebounce(search, 300);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    // const totalItems = useSelector(selectTotalItems);
    const [isMouseOver, setIsMouseOver] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isDropdownVisible, setIsDropdownVisible] = useState(true); // Controls the dropdown visibility
    const [language, setLanguage] = useState('vi'); // Default to 'en'

    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [totalSelectedPrice, setTotalSelectedPrice] = useState<number>(0);

    const [categories, setCategories] = useState<Category[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);

    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') || 'light';
        }
        return 'light';
    });

    const cartItems = useSelector((state: RootState) => state.cart.items); // Get cart items from Redux
    const cartCounts = cartItems.length; // Get the count of items in the cart

    // const handleQuantityChange = (id: number, quantity: number) => {
    //     if (quantity > 0) {
    //         dispatch(updateQuantity({ id, quantity }));
    //     }
    // };


    useEffect(() => {
        if (userId) {
            // Fetch user's cart from the API
            const fetchUserCart = async () => {
                try {
                    const response = await axios.get(`${apiConfig.cart.getCartByUserId}${userId}`, { withCredentials: true });
                    console.log('Fetched cart data:', response.data); // Log the fetched cart data
                    if (response.data && response.data) { // Check if cart_items exists
                        setCart(response.data); // Adjust according to your API response structure
                        setCartCount(response.data.length);
                    } else {
                        console.warn('No cart items found in response');
                    }
                } catch (error) {
                    console.error('Error fetching user cart:', error);
                }
            };
            fetchUserCart();
        } else {
            // If no user ID, show cart from cookies
            const existingCartItems = JSON.parse(Cookies.get('cart_items') || '{"cart_items": []}');
            if (existingCartItems.cart_items && existingCartItems.cart_items.length > 0) {
                setCart(existingCartItems.cart_items); // Set cart state from cookies
                setCartCount(existingCartItems.cart_items.length);
            } else {
                console.warn('No cart items found in cookies');
            }
        }
    }, []); // Ensure this useEffect runs only once
    // console.log(cart);


    useEffect(() => {
        const userId = Cookies.get('user_id'); // Get user_id from cookies
        if (userId) {
            fetchUserData(userId); // Fetch user data if user_id exists
        }
    }, []);

    const fetchUserData = async (id: string) => {
        try {
            const response = await axios.get(`${apiConfig.user.getUserById}${id}`); // Adjust the API endpoint as needed
            setUserData(response.data); // Store the user data in state
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const handleLogout = () => {
        signOut();
        axios.post(apiConfig.user.logout, { withCredentials: true });
        dispatch(logout()); // Dispatch the logout action
        setUserData(null); // Clear user data after logout
        toast.success('Đăng xuất thành công');
    };


    // useEffect(() => {
    //     const getApi = async () => {
    //         setLoading(true);
    //         try {
    //             const response = await axios.get(API_PRODUCTS);
    //             setProducts(response.data);
    //         } catch (error) {
    //             console.error("Failed to fetch products", error);
    //         }
    //         setLoading(false);
    //     }
    //     getApi();
    // }, []);

    const fetchProduct = async () => {
        setLoading(true); // Start loading
        try {
            const params = new URLSearchParams();
            const response = await axios.get(`${apiConfig.products.getallproductvariants}`, { withCredentials: true });

            setProducts(response.data.productvariants.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false); // End loading
        }
    };

    useEffect(() => {
        fetchProduct()
    }, [])

    // console.log(products);
    // console.log(products);


    useEffect(() => {
        if (debouncedSearch) {
            const filtered = products.filter(product =>
                product.name.toLowerCase().includes(debouncedSearch.toLowerCase())
            );
            setFilteredProducts(filtered);
            setIsDropdownVisible(true); // Show dropdown when search changes
        } else {
            setFilteredProducts([]);
            setIsDropdownVisible(false); // Hide dropdown if search is empty
        }
    }, [debouncedSearch, products]);


    // useEffect(() => {
    //     setCartCount(totalItems);
    // }, [totalItems]);

    // useEffect(() => {
    //     window.addEventListener('scroll', handleScroll);

    //     return () => {
    //         window.removeEventListener('scroll', handleScroll);

    //     };
    // }, [lastScrollY]);

    useEffect(() => {
        const handleScroll = () => {
            setIsDropdownVisible(false); // Hide dropdown on scroll

        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll); // Clean up event listener
        };
    }, []);

    useEffect(() => {
        const currentLang = window.location.pathname.startsWith('/vi') ? 'vi' : 'en';
        setLanguage(currentLang);
    }, []);


    useEffect(() => {
        // Khi theme thay đổi, cập nhật class trên document
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [theme]);

    const toggleTheme = () => {
        // Chuyển đổi theme giữa light và dark
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    const handleLanguageChange = (e: any) => {
        const selectedLang = e.target.value;

        // Lấy phần còn lại của URL
        const currentPath = window.location.pathname.replace(/^\/vi|\/en/, '');

        // Điều hướng đến URL tương ứng
        if (selectedLang === 'vi') {
            router.push(`/vi${currentPath}`);
        } else {
            router.push(`/en${currentPath}`);
        }
    };


    const fetchCategory = async () => {
        try {
            const response = await axios.get(apiConfig.categories.getAll, { withCredentials: true });

            setCategories(response.data.categories.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
        }
    };

    const fecthBrand = async () => {
        try {
            const response = await axios.get(apiConfig.brands.getAll, { withCredentials: true });

            setBrands(response.data.brands.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
        }
    };

    useEffect(() => {
        fetchCategory();
        fecthBrand()
    }, [])




    const userId = Cookies.get('user_id'); // Get user ID from cookies
    useEffect(() => {
        if (userId) { // {{ edit_1 }}
            const existingCartItems = JSON.parse(Cookies.get('cart_items') || '{"cart_items": []}');
            if (existingCartItems.cart_items.length > 0) {
                // Prepare items for moving to database
                const itemsToMove = existingCartItems.cart_items.map((item: CartItem) => ({
                    user_id: parseInt(userId), // Set user_id to null for each item
                    product_variant_id: item.product_variant_id,
                    quantity: item.quantity,
                }));

                // Move existing cart items to database
                const moveCartToDatabase = async () => {
                    try {
                        await axios.post(`${apiConfig.cart.moveCartToDatabase}`, {
                            user_id: parseInt(userId), // Handle undefined case
                            cart_items: itemsToMove,
                        }, {
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            withCredentials: true, // Ensure cookies are sent
                        });
                        // Clear the cart in cookies after moving to database
                        Cookies.remove('cart_items');
                        toast.success('Giỏ hàng tạm thời đã được chuyển vào giỏ hàng của bạn!'); // Notify user
                    } catch (error) {
                        console.error('Error moving cart to database:', error);
                        toast.error('Có lỗi xảy ra khi chuyển giỏ hàng vào cơ sở dữ liệu.'); // Notify error
                    }
                };

                moveCartToDatabase(); // Call the async function
            }
        }
    }, [userId]);



    

    return (
        <div>
            <div className='lg:h-[130px]'>
                <div className={`fixed top-0 left-0 right-0 bg-white transition-transform duration-300 z-50 `}>
                    {/* <div className={`fixed top-0 left-0 right-0 bg-white transition-transform duration-300 z-50 ${isVisible ? 'transform translate-y-0' : 'transform -translate-y-full'
                    }`}> */}
                    <div className="w-full bg-secondary lg:block hidden">
                        <div className="h-[74px] py-[10px] max-w-screen-xl mx-auto justify-between flex items-center px-4">
                            <Link href={"/"} className="cursor-pointer">
                                <img src="/images/FoodHaven.png" alt="Logo" className="w-[140px] h-auto object-fill" />
                            </Link>
                            <div
                                className="relative flex-1 px-20"
                                onMouseLeave={() => setIsMouseOver(false)}
                                onMouseEnter={() => setIsMouseOver(true)}
                            >
                                <div className="relative w-full">
                                    <input
                                        value={search}
                                        onChange={(event) => setSearch(event.target.value)}
                                        onFocus={() => setIsFocused(true)}
                                        onBlur={() => {
                                            // Chỉ ẩn nếu người dùng không hover vào kết quả tìm kiếm
                                            if (!isMouseOver) {
                                                setIsFocused(false);
                                                setSearch('');
                                            }
                                        }}
                                        className="w-full xl:h-10 lg:h-8 xl:text-sm lg:text-[10px] bg-white rounded-md py-2 xl:pl-4 lg:pl-2 pr-10 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        type="text"
                                        placeholder={"Tìm kiếm sản phẩm..."}
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center xl:pr-3 lg:pr-1">
                                        {search && (
                                            <button
                                                type="button"
                                                onClick={() => setSearch('')}
                                                className="text-gray-500 hover:text-gray-700"
                                                aria-label="Clear search"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                                </svg>
                                            </button>
                                        )}
                                        <SearchIcon className="ml-2" />
                                    </div>
                                </div>

                                {(isDropdownVisible && (isFocused || isMouseOver) && debouncedSearch) && (
                                    <div className="absolute w-full mt-2 bg-white shadow-lg rounded-md z-10">
                                        <div className="text-xl font-bold mt-2 ml-5">Tìm kiếm theo tên sản phẩm</div>
                                        <div className='flex gap-5 p-5'>
                                            <div className='w-1/4'>
                                                <img src="/images/nav-1.jpg" alt="A cat sitting on a chair" className='w-full rounded-lg h-[400px] object-cover' />
                                            </div>
                                            <div className='flex-1'>
                                                {loading ? (
                                                    <div className="flex items-center justify-center h-full"><Spinner /></div>
                                                ) : filteredProducts.length > 0 ? (
                                                    <ul className='overflow-scroll h-[400px]'>
                                                        {filteredProducts.map((product) => (
                                                            <li key={product.product_id} className="p-2 border-b hover:bg-gray-100">
                                                                <a href={`/product/${product.product_id}`} className="flex gap-4 items-center">
                                                                    <div className='w-14 h-14'>
                                                                        <img className='w-full h-full min-w-14 object-cover' src={product.image} alt={product.name} />
                                                                    </div>
                                                                    <div>{product.name}</div>
                                                                </a>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <div className="flex items-center justify-center w-full h-full">Không tìm thấy sản phẩm</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>


                            <div className="text-white flex gap-4 xl:text-sm lg:text-[10px]">
                                <div className="flex items-center gap-1">
                                    <div><LocalPhoneIcon className="xl:h-[30px] xl:w-[30px] lg:w-6 lg:h-6" /></div>
                                    <div className="xl:text-sm lg:text-[10px]">
                                        <div>Hotline</div>
                                        <div className="font-semibold">0326 482 490</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    {userData ? ( // Check if userData exists
                                        <Dropdown placement="bottom-end">
                                            <DropdownTrigger>
                                                <Avatar
                                                    isBordered
                                                    size='sm'
                                                    as="button"
                                                    className="transition-transform"
                                                    src={userData.avatar || "https://i.pravatar.cc/150?u=a042581f4e29026704d"} // Use user avatar or a default
                                                />
                                            </DropdownTrigger>
                                            <DropdownMenu aria-label="Profile Actions" variant="flat">
                                                <DropdownItem key="profile" className="h-14 gap-2">
                                                    <p className="font-semibold">Signed in as</p>
                                                    <p className="font-semibold">{userData.email}</p> {/* Display user email */}
                                                </DropdownItem>
                                                <DropdownItem key="settings">
                                                    <Link href={'/profile'}>
                                                        Trang cá nhân
                                                    </Link>
                                                </DropdownItem>
                                                <DropdownItem key="team_settings">Team Settings</DropdownItem>
                                                <DropdownItem key="analytics">
                                                    <Link href={'/profile/notify'}>
                                                        Thông báo
                                                    </Link>
                                                </DropdownItem>
                                                <DropdownItem key="system">
                                                    <Link href={'/profile/order'}>
                                                        Quản lí đơn hàng
                                                    </Link>
                                                </DropdownItem>
                                                <DropdownItem key="configurations">
                                                    <Link href={'/profile/promotion'}>
                                                        Mã giảm giá
                                                    </Link>
                                                </DropdownItem>
                                                <DropdownItem key="logout" color="danger" onClick={handleLogout}> {/* Add onClick to handle logout */}
                                                    Đăng xuất
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </Dropdown>
                                    ) : (
                                        <div className='flex items-center gap-1'>
                                            <div>
                                                <PersonIcon className="xl:h-[30px] xl:w-[30px] lg:w-6 lg:h-6" />
                                            </div>
                                            <div className="xl:text-sm lg:text-[10px]">
                                                <div>
                                                    <Link href={`/signin`}>Đăng nhập</Link>
                                                </div>
                                                <div>
                                                    <Link href={`/signup`}>Đăng kí</Link>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <TooltipCu position='right' title={
                                    <div className="flex items-center gap-1 max-w-[120px] min-w-[120px] relative py-3">
                                        <div className="relative">
                                            <ShoppingBagIcon className="xl:h-[30px] xl:w-[30px] lg:w-6 lg:h-6" />
                                            {/* <span className="w-4 h-4 bg-secondary flex items-center justify-center rounded-full absolute top-0 right-0">
                                             {cartCount}
                                         </span> */}
                                        </div>
                                        <Link href={`/cart`}>
                                            <div>
                                                <div className="xl:text-sm lg:text-[10px]">Giỏ hàng</div>
                                                <div className="font-semibold"><span>({cartCount})</span> Sản phẩm</div>
                                            </div>
                                        </Link>
                                    </div>
                                }>
                                    {isVisible ? (
                                        <div>
                                            <div className='p-4 min-w-[460px] max-w-[460px]'>
                                                <div className='flex justify-end mb-4 items-center'>
                                                    <div className='text-xl mb-2 font-semibold text-black'>Giỏ hàng của bạn</div>
                                                    
                                                </div>

                                                <div>
                                                    <ul className='max-h-[420px] overflow-hidden overflow-y-auto pr-2 text-black'>
                                                        {cart.length > 0 ? (
                                                            cart.map((item: any) => (
                                                                <li key={item.product_variant.id} className='flex items-center gap-4 mb-2'>
                                                                    <div>
                                                                        <Image src={item.product_variant.image} alt={item.product_variant.name} width={100} height={100} className='w-16 h-16 object-cover' />
                                                                    </div>
                                                                    <div>
                                                                        <div className='max-w-[220px]'>{item.product_variant.name}</div>



                                                                  
                                                                    </div>
                                                                    <div className='flex-1 text-right'>
                                                                        <div className='text-price font-semibold'>
                                                                        {Math.min(item.product_variant.DiscountedPrice, item.product_variant.FlashSalePrice).toLocaleString('vi-VN')} VND
                                                                        </div>
                                                                       
                                                                    </div>
                                                                </li>
                                                            ))
                                                        ) : (
                                                            <div className='text-center py-4'>Giỏ hàng trống</div>
                                                        )}
                                                    </ul>
                                                </div>
                                                <div className='flex items-center justify-between mt-6'>
                                                    <div><Link href={`/cart`} className='py-1 px-4 rounded-lg bg-main text-white'>Xem giỏ hàng</Link></div>
                                                    {/* <div className='text-xl font-semibold'>Tổng: <span className='text-price'>{totalSelectedPrice.toLocaleString('vi-VN')} VND</span> </div> */}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        null
                                    )
                                    }
                                </TooltipCu>
                                <div className='flex items-center'>
                                    <div className="pr-2">
                                        <label className="swap swap-rotate">
                                            {/* Ẩn checkbox */}
                                            <input
                                                type="checkbox"
                                                onChange={toggleTheme}
                                                checked={theme === 'light'}
                                            />

                                            {/* Icon mặt trời (light theme) */}
                                            <svg
                                                className="swap-on h-6 w-6 fill-current"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24">
                                                <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
                                            </svg>

                                            {/* Icon mặt trăng (dark theme) */}
                                            <svg
                                                className="swap-off h-6 w-6 fill-current"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24">
                                                <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
                                            </svg>
                                        </label>
                                    </div>
                                    <div className="border border-white h-6"></div>
                                    <div className='pl-2'>
                                        <select
                                            value={language}
                                            onChange={handleLanguageChange}
                                            className="text-white dark:text-white bg-transparent dark:bg-transparent rounded-lg outline-none border-transparent">
                                            <option className='text-black' value="vi">Vie</option>
                                            <option className='text-black' value="en">Eng</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='w-full lg:block bg-main hidden sticky top-0'>
                        <div className='h-14 py-[10px] max-w-screen-xl mx-auto justify-between flex items-center px-4'>
                            <ul className='flex gap-16 text-white font-medium'>
                                <li className='flex items-center'>
                                    <Link href={'/'}>TRANG CHỦ</Link>
                                </li>
                                <li className='flex items-center'>
                                    <Link href={`/blog`}>TIN TỨC</Link>
                                </li>
                                <li>


                                    <div className='group'>
                                        <TooltipCu position='left' title={
                                            <div className='flex items-center transition-all py-3'>
                                                <Link href={`/shop`}>
                                                    SẢN PHẨM
                                                </Link>
                                                <KeyboardArrowDownIcon className='group-hover:rotate-180 !transition-transform !duration-400' />
                                            </div>
                                        }>
                                            {
                                                isVisible ? (
                                                    <div className="p-1 grid grid-cols-4 grid-rows-2 gap-4 relative">
                                                        <div className='row-span-2'>
                                                            <img src="/images/nav-1.jpg" alt="A cat sitting on a chair" className='w-[180px] rounded-lg h-full object-cover' />
                                                        </div>
                                                        <div className='col-span-3 row-span-2'>
                                                            <div className='flex flex-col mb-4'>
                                                                <div className='text-black text-lg'>Phân loại</div>
                                                                <div className='grid grid-cols-2'>
                                                                    {categories.map((item, index) => (
                                                                        <Link key={index} href={`/shop?category[]=${item.name}`}>
                                                                            <div className="flex py-1 px-1 text-black cursor-pointer rounded-lg hover:bg-slate-200 items-center">
                                                                                <div className='mr-2'>
                                                                                    <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg" />
                                                                                </div>
                                                                                <div>{item.name}</div>
                                                                            </div>
                                                                        </Link>
                                                                    ))}
                                                                </div>

                                                            </div>
                                                            <div>
                                                                <div className='text-black text-lg'>Thương hiệu</div>
                                                                <div className='grid grid-cols-2'>
                                                                    {brands.map((item, index) => (
                                                                        <Link key={index} href={`/shop?brand[]=${item.name}`}>
                                                                            <div className="flex py-1 px-1 text-black cursor-pointer rounded-lg hover:bg-slate-200 items-center">
                                                                                <div className='mr-2'>
                                                                                    <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg" />
                                                                                </div>
                                                                                <div>{item.name}</div>
                                                                            </div>
                                                                        </Link>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    null
                                                )
                                            }
                                        </TooltipCu>
                                    </div>


                                </li>
                                {/* <li className='relative'>
                                    <Tooltip
                                        isDismissable
                                        color="default"
                                        placement="bottom-end"
                                        content={
                                            <div className="px-1 py-2 grid grid-cols-4 gap-1 relative">
                                                <div className='row-span-4'>
                                                    <img src="/images/nav-1.jpg" alt="A cat sitting on a chair" className='w-[180px] rounded-lg h-auto object-cover' />
                                                </div>
                                                {CATEGORY.map((item, index) => (
                                                    <Link key={index} href={`/shop?category=${item.tag}`}>
                                                        <div className="flex py-2 px-5 cursor-pointer rounded-lg hover:bg-slate-200 items-center">
                                                            <div className='mr-2'>
                                                                <img src={`/images/${item.image}`} alt={item.name} className="w-12 h-12 object-cover rounded-lg" />
                                                            </div>
                                                            <div>{item.name}</div>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        }
                                        className='!relative'
                                    >
                                        <div className='flex items-center sp_ar '>
                                            <Link href={'/shop'}>
                                                SẢN PHẨM
                                            </Link>
                                            <div className='sp_ar__down'>
                                                <KeyboardArrowDownIcon />
                                            </div>
                                        </div>
                                    </Tooltip>

                                </li> */}
                                <li className='flex items-center'>
                                    <Link href={`/contact`}>LIÊN HỆ</Link>
                                </li>
                                <li className='flex items-center'>
                                    <Link href={`/tracking`}>TRA CỨU</Link>
                                </li>
                                <li className='flex items-center'>
                                    <Link href={`/tracking`}>VỀ CHÚNG TÔI</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile */}
            <div className='w-full lg:hidden block'>
                <div>
                    <Navbar
                        isBordered
                        isMenuOpen={isMenuOpen}
                        onMenuOpenChange={setIsMenuOpen}
                        className="bg-main"
                    >
                        <Link href={'/'}>
                            <NavbarItem>
                                <img src="/images/FoodHaven.png" alt="A cat sitting on a chair" className="w-20 h-auto" />
                            </NavbarItem>
                        </Link>

                        <NavbarContent justify="end" className="gap-0">

                            <NavbarContent className=" text-white nav_menu__mb-ic ml-2" justify="end">
                                <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} />
                            </NavbarContent>
                        </NavbarContent>

                        <NavbarMenu>
                            {menuItems.map((item, index) => (
                                <NavbarMenuItem key={index}>
                                    <Link
                                        className="w-full text-black"
                                        color={
                                            index === 2 ? "warning" : index === menuItems.length - 1 ? "danger" : "foreground"
                                        }
                                        href="#"
                                    >
                                        {item.text}
                                    </Link>
                                </NavbarMenuItem>
                            ))}
                        </NavbarMenu>
                    </Navbar>
                </div>

                <div className=''>
                    <div className='bg-main h-14 w-full fixed bottom-0 px-4 z-20'>
                        <ul className="menu menu-horizontal w-full h-full flex items-center justify-around">
                            <li className='lg:mx-4'><Link href={'/'}><HomeIcon className='h-5 w-5' /></Link></li>
                            <li className='lg:mx-4'> <Button className='p-2 min-w-16' variant='light' onPress={onOpen}><SearchIcon className='h-5 w-5' /></Button></li>
                            <li className='lg:mx-4'><Link href={`/cart`}>  <div className="relative">
                                <ShoppingBagIcon className="xl:h-[30px] xl:w-[30px] lg:w-6 lg:h-6" />
                                <span className="w-4 h-4 bg-secondary flex items-center justify-center rounded-full absolute top-0 right-[-4px]">
                                    <div className='text-white'>{cartCount}</div>
                                </span>
                            </div></Link></li>
                            <li className='lg:mx-4'>
                                {/* <Link href={'/signin'}><PersonIcon className='h-5 w-5' /></Link> */}
                                <Dropdown placement="bottom-end">
                                    <DropdownTrigger>
                                        <Avatar
                                            isBordered
                                            size='sm'
                                            as="button"
                                            className="transition-transform"
                                            src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                                        />
                                    </DropdownTrigger>
                                    <DropdownMenu aria-label="Profile Actions" variant="flat">
                                        <DropdownItem key="profile" className="h-14 gap-2">
                                            <p className="font-semibold">Signed in as</p>
                                            <p className="font-semibold">zoey@example.com</p>
                                        </DropdownItem>
                                        <DropdownItem key="settings">
                                            <Link href={`/profile`}>
                                                Trang cá nhân
                                            </Link>
                                        </DropdownItem>
                                        <DropdownItem key="team_settings">Team Settings</DropdownItem>
                                        <DropdownItem key="analytics">
                                            <Link href={'/profile'}>
                                                Trang cá nhân
                                            </Link>
                                        </DropdownItem>
                                        <DropdownItem key="system">System</DropdownItem>
                                        <DropdownItem key="configurations">Configurations</DropdownItem>
                                        <DropdownItem key="help_and_feedback">
                                            Help & Feedback
                                        </DropdownItem>
                                        <DropdownItem key="logout" color="danger">
                                            Log Out
                                        </DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </li>
                        </ul>
                    </div>
                </div>

                <Modal isOpen={isOpen} onOpenChange={onOpenChange} size='full'>
                    <ModalContent>
                        {(onClose) => (
                            <div className='flex justify-center flex-col'>
                                <ModalHeader className="flex flex-col gap-1 mr-5">
                                    <Input
                                        value={search}
                                        onChange={(event) => setSearch(event.target.value)}
                                        onFocus={() => setIsFocused(true)}
                                        onBlur={() => setIsFocused(false)}
                                        className="w-full xl:h-10 lg:h-8 xl:text-sm lg:text-[10px] bg-white rounded-md py-2 xl:pl-4 lg:pl-2 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        type="text"
                                        placeholder={"Tìm kiếm sản phẩm..."}
                                    />
                                </ModalHeader>
                                <ModalBody>
                                    <div>
                                        {search && (
                                            <>
                                                {loading ? (
                                                    <div className="p-2 text-center">Loading...</div>
                                                ) : filteredProducts.length > 0 ? (
                                                    <ul className="h-screen overflow-y-auto pb-20">
                                                        {filteredProducts.map((product) => (
                                                            <li key={product.product_id} className="p-2 border-b hover:bg-gray-100">
                                                                <Link href={`/product/${product.product_id}`} className="flex gap-4 items-center">
                                                                    <div className="w-14 h-14">
                                                                        <img
                                                                            className="w-full h-full object-cover"
                                                                            // src={product.images.length > 0 ? product.images[0] : 'fallback-image-url'}
                                                                            alt={product.name}
                                                                        />
                                                                    </div>
                                                                    <div>{product.name}</div>
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <div className="p-2 text-center">No results found</div>
                                                )}
                                            </>
                                        )}
                                    </div>

                                </ModalBody>
                                {/* <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </ModalFooter> */}
                            </div>
                        )}
                    </ModalContent>
                </Modal>
            </div>
        </div>
    )
}

export default Header;