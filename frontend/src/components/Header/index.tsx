'use client'
import '../../styles/globals.css'

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Link from 'next/link';
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

import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from "@nextui-org/react";
import { Tooltip, Button } from "@nextui-org/react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import { Input } from '@nextui-org/react';
import { Navbar, NavbarMenuToggle, NavbarMenuItem, NavbarMenu, NavbarContent, NavbarItem } from "@nextui-org/react"
import { Checkbox } from "@nextui-org/react";

import { Product } from '@/src/interface';
import API_PRODUCTS from '@/src/data';
import useDebounce from '@/src/utils';
import { CATEGORY } from '@/src/dump';
import { selectTotalItems } from '@/src/store/cartSlice';
import { removeItem } from '@/src/store/cartSlice';

import './style.css'
import { log } from 'console';

import { updateQuantity } from '@/src/store/cartSlice';

const menuItems = [
    { href: '/store', icon: <LocationOnOutlinedIcon className="lg:w-4 lg:h-4" />, text: 'Hệ thống cửa hàng' },
    { href: '/', icon: <SellOutlinedIcon className="lg:w-4 lg:h-4" />, text: 'Đăng kí bán hàng' },
    { href: '/', icon: <AutorenewOutlinedIcon className="lg:w-4 lg:h-4" />, text: 'Chính sách đổi trả' },
    { href: '/', icon: <HeadsetOutlinedIcon className="lg:w-4 lg:h-4" />, text: 'Trung tâm hỗ trợ' },
    { href: '/', icon: <InfoOutlinedIcon className="lg:w-4 lg:h-4" />, text: 'Hướng dẫn' },
];

function Header() {
    const dispatch = useDispatch();
    const cart = useSelector((state: any) => state.cart.items);
    const [cartCount, setCartCount] = useState<number>(0);
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [search, setSearch] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [loading, setLoading] = useState(false);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const debouncedSearch = useDebounce(search, 300);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const totalItems = useSelector(selectTotalItems);

    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [totalSelectedPrice, setTotalSelectedPrice] = useState<number>(0);

    const handleQuantityChange = (id: number, quantity: number) => {
        if (quantity > 0) {
            dispatch(updateQuantity({ id, quantity }));
        }
    };

    const columns = Math.ceil(CATEGORY.length / 5); // Calculate the number of columns needed

    const categoryColumns = [];
    for (let i = 0; i < columns; i++) {
        categoryColumns.push(CATEGORY.slice(i * 5, i * 5 + 5));
    }

    useEffect(() => {
        const getApi = async () => {
            setLoading(true);
            try {
                const response = await axios.get(API_PRODUCTS);
                setProducts(response.data);
            } catch (error) {
                console.error("Failed to fetch products", error);
            }
            setLoading(false);
        }
        getApi();
    }, []);

    useEffect(() => {
        if (debouncedSearch) {
            const filtered = products.filter(product =>
                product.name.toLowerCase().includes(debouncedSearch.toLowerCase())
            );
            setFilteredProducts(filtered);


        } else {
            setFilteredProducts([]);
        }
    }, [debouncedSearch, products]);

    useEffect(() => {
        setCartCount(totalItems);
    }, [totalItems]);


    return (
        <div>
            <div className="w-full bg-secondary lg:block hidden">
                <div className="h-[74px] py-[10px] max-w-screen-xl mx-auto justify-between flex items-center px-4">
                    <Link href={"/"} className="cursor-pointer">
                        <img src="/images/logo.png" alt="Logo" className="w-[140px] h-[28px] object-fill" />
                    </Link>
                    <div className="relative flex-1 px-20">
                        <div className="relative w-full">
                            <input
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                className="w-full xl:h-10 lg:h-8 xl:text-sm lg:text-[10px] bg-white rounded-md py-2 xl:pl-4 lg:pl-2 pr-10 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                                type="text"
                                placeholder="Tìm kiếm sản phẩm..."
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center xl:pr-3 lg:pr-1">
                                <SearchIcon />
                            </div>
                        </div>
                        {(isFocused) && (
                            <div className="absolute w-full mt-2 bg-white shadow-lg rounded-md z-10">
                                <div className="text-xl font-bold mt-2 ml-5">Tìm kiếm theo tên sản phẩm</div>
                                <div className='flex gap-5 p-5'>
                                    <div className='w-1/4'>
                                        <img src="/images/nav-1.jpg" alt="A cat sitting on a chair" className='w-full rounded-lg h-[400px] object-cover' />
                                    </div>
                                    <div className='flex-1'>
                                        {search ? (
                                            <>
                                                {loading ? (
                                                    <div className="flex items-center justify-center h-full"><Spinner /></div>
                                                ) : filteredProducts.length > 0 ? (
                                                    <ul className='overflow-scroll h-[400px]'>
                                                        {filteredProducts.map((product) => (
                                                            <li key={product.id} className="p-2 border-b hover:bg-gray-100 ">
                                                                <Link href={`/product/${product.id}`} className="flex gap-4 items-center ">
                                                                    <div className='w-14 h-14'>
                                                                        <img className='w-full h-full min-w-14 object-cover' src={product.images.length > 0 ? product.images[0] : 'fallback-image-url'} alt={product.name} />
                                                                    </div>
                                                                    <div>
                                                                        {product.name}
                                                                    </div>
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <div className="flex items-center justify-center w-full h-full">Không tìm thấy sản phẩm</div>
                                                )}
                                            </>
                                        ) : <div className="flex items-center justify-center w-full h-full">Không tìm thấy sản phẩm</div>}
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
                            <div><PersonIcon className="xl:h-[30px] xl:w-[30px] lg:w-6 lg:h-6" /></div>
                            <div className="xl:text-sm lg:text-[10px]">
                                <div>
                                    <Link href={'/signin'}>Đăng nhập</Link>
                                </div>
                                <div>
                                    <Link href={'/signup'}>Đăng kí</Link>
                                </div>
                            </div>
                        </div>

                        <Tooltip showArrow={true} placement='bottom-end' content={
                            <div>

                                <div className='p-4 min-w-[460px] max-w-[460px]'>
                                    <div  className='flex justify-between mb-4 items-center'>
                                        <div className="flex items-center mb-2">
                                      
                                        <span className="ml-2">Chọn tất cả</span>
                                    </div>
                                    <div className='text-xl mb-2 font-semibold'>Giỏ hàng của bạn</div>
                                    </div>
                                    
                                    <div>
                                        <ul className='max-h-[420px] overflow-hidden overflow-y-auto pr-2'>


                                            {cart.map((item: any) => (
                                                <li key={item.id} className='flex items-center gap-4 mb-2'>
                                                    <div>
                                                        
                                                    </div>
                                                    <div>
                                                        <img src={item.images[0]} alt={item.name} className='w-16 h-16 object-cover' />
                                                    </div>
                                                    <div>
                                                        <div className='max-w-[220px]'>{item.name}</div>
                                                        <div className="flex items-center">
                                                            <button
                                                                className="px-3 py-1 border rounded"
                                                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                            >
                                                                -
                                                            </button>
                                                            <span className="px-4">{item.quantity}</span>
                                                            <button
                                                                className="px-3 py-1 border rounded"
                                                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className='flex-1 text-right'>
                                                        <div>
                                                            {item.price.toLocaleString('vi-VN')} VND
                                                        </div>
                                                        <div onClick={() => dispatch(removeItem(item.id))}>
                                                            <DeleteIcon className='hover:text-red-600 cursor-pointer' />
                                                        </div>



                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className='flex items-center justify-between mt-6'>
                                        <div><Link href={'/cart'} className='py-1 px-4 rounded-lg bg-main text-white'>Xem giỏ hàng</Link></div>
                                        <div className='text-xl font-semibold'>Tổng: <span className='text-price'>{totalSelectedPrice.toLocaleString('vi-VN')} VND</span> </div>
                                    </div>
                                </div>
                            </div>
                        }>
                            <div className="flex items-center gap-1 max-w-[120px] min-w-[120px]">
                                <div className="relative">
                                    <ShoppingBagIcon className="xl:h-[30px] xl:w-[30px] lg:w-6 lg:h-6" />
                                    <span className="w-4 h-4 bg-secondary flex items-center justify-center rounded-full absolute top-0 right-0">
                                        {cartCount}
                                    </span>
                                </div>
                                <Link href={'/cart'}>
                                <div>
                                    <div className="xl:text-sm lg:text-[10px]">Giỏ hàng</div>
                                    <div className="font-semibold"><span>({cartCount})</span> Sản phẩm</div>
                                </div>
                                </Link>
                            </div>
                        </Tooltip>
                    </div>
                </div>
            </div>
            <div className='w-full lg:block bg-main hidden'>
                <div className='h-14 py-[10px] max-w-screen-xl mx-auto justify-between flex items-center px-4'>
                    <ul className='flex gap-10'>
                        <li>
                            <Link href={'/'}>TRANG CHỦ</Link>
                        </li>
                        <li>
                            <Tooltip
                                isDismissable
                                color="default"
                                placement="bottom-end"
                                content={
                                    <div className="px-1 py-2 grid grid-cols-4 gap-4">
                                        <div className='row-span-4'>
                                            <img src="/images/nav-1.jpg" alt="A cat sitting on a chair" className='w-[160px] rounded-lg h-auto object-cover' />
                                        </div>
                                        {CATEGORY.map((item, index) => (
                                            <Link key={index} href={`/shop?category=${item.tag}`}>
                                                <div className="flex py-2 px-5 cursor-pointer rounded-lg hover:bg-slate-200 items-center">
                                                    <div className='mr-2'>
                                                        <img src={`/images/${item.image}`} alt={item.name} className="w-8 h-8 object-cover rounded-lg" />
                                                    </div>
                                                    <div>{item.name}</div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                }
                            >
                                <div className='flex items-center'>
                                    <Link href={'/shop'}>
                                        SẢN PHẨM
                                    </Link>
                                    <KeyboardArrowDownIcon />
                                </div>
                            </Tooltip>

                        </li>
                        <li>
                            <Link href={'/blog'}>TIN TỨC</Link>
                        </li>
                        <li>
                            <Link href={'/contact'}>LIÊN HỆ</Link>
                        </li>
                        <li>
                            <Link href={'/tracking'}>TRA CỨU</Link>
                        </li>
                    </ul>
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
                                <img src="/images/logo.png" alt="A cat sitting on a chair" className="h-5" />
                            </NavbarItem>
                        </Link>

                        <NavbarContent justify="end" className="gap-0">
                            <NavbarContent className=" text-white nav_menu__mb-ic ml-2" justify="start">
                                aaa
                            </NavbarContent>
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
                    <div className='bg-main h-14 w-full fixed bottom-0 px-4 z-50'>
                        <ul className="menu menu-horizontal w-full h-full flex items-center justify-around">
                            <li className='mx-4'><Link href={'/'}><HomeIcon className='h-5 w-5' /></Link></li>
                            <li className='mx-4'> <Button className='p-2 min-w-16' variant='light' onPress={onOpen}><SearchIcon className='h-5 w-5' /></Button></li>
                            <li className='mx-4'><Link href={'/cart'}>  <div className="relative">
                                <ShoppingBagIcon className="xl:h-[30px] xl:w-[30px] lg:w-6 lg:h-6" />
                                <span className="w-4 h-4 bg-secondary flex items-center justify-center rounded-full absolute top-0 right-[-4px]">
                                    <div className='text-white'>{cartCount}</div>
                                </span>
                            </div></Link></li>
                            <li className='mx-4'><Link href={'/signin'}><PersonIcon className='h-5 w-5' /></Link></li>
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
                                        placeholder="Tìm kiếm sản phẩm..."
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
                                                            <li key={product.id} className="p-2 border-b hover:bg-gray-100">
                                                                <Link href={`/product/${product.id}`} className="flex gap-4 items-center">
                                                                    <div className="w-14 h-14">
                                                                        <img
                                                                            className="w-full h-full object-cover"
                                                                            src={product.images.length > 0 ? product.images[0] : 'fallback-image-url'}
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