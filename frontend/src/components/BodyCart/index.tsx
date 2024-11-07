'use client'
import React, { useState, useEffect } from 'react';
import { Checkbox, Spinner } from "@nextui-org/react";
import { useDispatch, useSelector } from 'react-redux';
import { CartItem } from '@/src/interface';
import DeleteIcon from '@mui/icons-material/Delete';
import BreadcrumbNav from '../Breadcrum';
import Link from 'next/link';
import { Chip } from "@nextui-org/react";
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@nextui-org/react';

import axios from 'axios';
import apiConfig from '@/src/config/api';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addToCart, updateCart } from '@/src/store/cartSlice';
import Loading from '../ui/Loading';

const Body_Cart = () => {
    const dispatch = useDispatch();
    const userId = Cookies.get('user_id'); // Get user ID from cookies
    const [cart, setCart] = useState<CartItem[]>([]);

    const [totalAmount, setTotalAmount] = useState<number>(0); // State to hold total amount
    const [loyaltyPoints, setLoyaltyPoints] = useState<number>(0);

    const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (userId) {
            // Fetch user's cart from the API
            const fetchUserCart = async () => {
                setLoading(true);
                try {
                    const response = await axios.get(`${apiConfig.cart.getCartByUserId}${userId}`, { withCredentials: true });
                    console.log('Fetched cart data:', response.data); // Log the fetched cart data
                    if (response.data && response.data) { // Check if cart_items exists
                        setCart(response.data); // Adjust according to your API response structure
                        // setCartCount(response.data.length);
                    } else {
                        console.warn('No cart items found in response');
                    }
                } catch (error) {
                    console.error('Error fetching user cart:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchUserCart();
        } else {
            // If no user ID, show cart from cookies
            const existingCartItems = JSON.parse(Cookies.get('cart_items') || '{"cart_items": []}');
            if (existingCartItems.cart_items && existingCartItems.cart_items.length > 0) {
                setCart(existingCartItems.cart_items); // Set cart state from cookies

                // setCartCount(existingCartItems.cart_items.length);
            } else {
                console.warn('No cart items found in cookies');
            }
        }
    }, []); // Ensure this useEffect runs only once
    console.log(cart);

    const handleCheckout = () => {
        const selectedItemsArray = Array.from(selectedItems);
        const checkoutData = {
            productId: selectedItemsArray,
            selectedItems: selectedItemsArray.map(itemId => {
                const item = cart.find(item => item.product_variant.id === itemId);
                return {
                    id: itemId,
                    quantity: item?.quantity || 0, // Get quantity for each selected item
                    name: item?.product_variant.name || '', // Get name for each selected item
                    image: item?.product_variant.image || '' // Get image for each selected item
                };
            }),
            totalAmount: totalAmount, // Save total amount
            pointCart: loyaltyPoints, // Save point
        };
        Cookies.set('checkout_data', JSON.stringify(checkoutData)); // Save selected items and total amount to cookies
    };

    const updateQuantity = async (item: CartItem, newQuantity: number) => {
        // Ensure quantity does not go below 1
        if (newQuantity < 1) {
            toast.warning('Số lượng tối thiểu là 1');
            return; // Dừng hàm nếu số lượng không hợp lệ
        }

        if (userId) {
            // If user is logged in, update quantity via API
            try {
                setLoading(true);
                await axios.put(`${apiConfig.cart.updateCartByUserId}${userId}/${item.product_variant.id}`, { quantity: newQuantity }, { withCredentials: true });
                setCart(prevCart => {
                    const updatedCart = prevCart.map(cartItem =>
                        cartItem.product_variant.id === item.product_variant.id
                            ? { ...cartItem, quantity: newQuantity }
                            : cartItem
                    );
                    return updatedCart;
                });
                toast.success('Cập nhật số lượng thành công');
            } catch (error) {
                console.error('Error updating quantity:', error);
                toast.error('Cập nhật số lượng thất bại');
            } finally {
                setLoading(false);
            }
        } else {
            const existingCartItems = JSON.parse(Cookies.get('cart_items') || '{"cart_items": []}') as { cart_items: CartItem[] }; // Specify type for existingCartItems
            const updatedCartItems = existingCartItems.cart_items.map((cartItem: CartItem) => // Explicitly define cartItem type
                cartItem.product_variant.id === item.product_variant.id
                    ? { ...cartItem, quantity: newQuantity }
                    : cartItem
            );
            Cookies.set('cart_items', JSON.stringify({ cart_items: updatedCartItems }));
            setCart(updatedCartItems);
            toast.success('Cập nhật số lượng thành công trong giỏ hàng');
        }
    };
    // ... existing code ...

    const deleteItem = async (item: CartItem) => {
        if (userId) {
            setLoading(true);
            await axios.delete(`${apiConfig.cart.deleteCartByUserId}${userId}/${item.product_variant.id}`, { withCredentials: true });
            setCart(prevCart => prevCart.filter(cartItem => cartItem.product_variant.id !== item.product_variant.id));
            dispatch(updateCart(cart.filter(cartItem => cartItem.product_variant.id !== item.product_variant.id))); // Dispatch updateCart action
            toast.success('Xóa sản phẩm thành công');
        } else {
            setLoading(true);
            const existingCartItems = JSON.parse(Cookies.get('cart_items') || '{"cart_items": []}');
            const updatedCartItems = existingCartItems.cart_items.filter((cartItem: CartItem) => cartItem.product_variant.id !== item.product_variant.id);
            Cookies.set('cart_items', JSON.stringify({ cart_items: updatedCartItems }));
            setCart(updatedCartItems);
            toast.success('Xóa sản phẩm thành công');
        }
        setLoading(false);
    }

    useEffect(() => {
        // Calculate total amount and loyalty points whenever cart changes
        const calculateTotals = () => {
            const total = cart.reduce((acc, item) => {
                if (item.product_variant.id !== undefined && selectedItems.has(item.product_variant.id)) { // Ensure item.id is defined
                    return acc + (Math.min(item.product_variant.DiscountedPrice ?? 0, item.product_variant.FlashSalePrice ?? 0) * (item.quantity || 0)); // Ensure quantity is a number
                }
                return acc; // Ensure to return acc when item is not selected
            }, 0);
            setTotalAmount(total);
            setLoyaltyPoints(total * 0.01); // 1% of total amount as loyalty points
        };

        calculateTotals();
    }, [cart, selectedItems]); 

    console.log(totalAmount, loyaltyPoints);



    const handleSelectItem = (itemId: number) => {
        setSelectedItems(prev => {
            const newSelectedItems = new Set(prev);
            if (newSelectedItems.has(itemId)) {
                newSelectedItems.delete(itemId); // Deselect if already selected
            } else {
                newSelectedItems.add(itemId); // Select if not selected
            }
            return newSelectedItems;
        });
    };

    const handleSelectAllChange = () => {
        if (cart.length === selectedItems.size) {
            setSelectedItems(new Set()); // Deselect all if all are selected
        } else {
            const allItemIds = new Set(cart.map(item => item.product_variant.id).filter((id): id is number => id !== undefined));
            setSelectedItems(allItemIds);
        }
    };


    return (
        <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center">
                <div className="py-5 h-[62px]">
                    <BreadcrumbNav
                        items={[{ name: 'Trang chủ', link: '/' }, { name: 'Giỏ hàng', link: '#' }]}
                    />
                </div>
            </div>
            <h1 className="text-4xl font-bold mb-6 text-center dark:text-white">Giỏ Hàng</h1>

            <Checkbox
    isSelected={cart.length > 0 && cart.length === selectedItems.size} // Check if all items are selected
    onChange={handleSelectAllChange} // Handle select all change
    className='pl-42 mb-4'
>
    Chọn tất cả
</Checkbox>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                <div className="lg:col-span-2">
                {loading ? <div className='w-full h-[400px] flex items-center justify-center relative'><Loading /></div> : (
                        cart.length > 0 ? (
                            cart.map((item: any) => (
                                <div className="bg-white dark:bg-transparent" key={item.product_variant.id} >
                                <div className="flex justify-between items-center border-b pb-4 mb-4">
                                    <div className="flex items-center">
                                        <Checkbox
                                            isSelected={selectedItems.has(item.product_variant.id)} // Check if item is selected
                                            onChange={() => handleSelectItem(item.product_variant.id)} // Handle selection change
                                            className="mr-4"
                                        />
                                        <img src={item.product_variant.image} alt={'âffff'} className="w-24 h-24 mr-4 rounded" />
                                        <div>
                                            <p className="text-xl font-semibold dark:text-white">{item.product_variant.name}</p>
                                            {/* <p className="text-sm text-gray-600">fssdf</p> */}
                                            <div className="flex items-center mt-2 dark:text-white">
                                                <button onClick={() => updateQuantity(item, item.quantity - 1)} className="px-3 py-1 border rounded">-</button>
                                                <span className="px-4">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item, item.quantity + 1)} className="px-3 py-1 border rounded">+</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right flex gap-2">
                                        <div>
                                            <span className="text-gray-500 text-sm">
                                                {Math.min(item.product_variant.DiscountedPrice, item.product_variant.FlashSalePrice).toLocaleString('vi-VN')} đ
                                            </span>
                                            <div className='text-2xl text-price font-bold'>
                                                {((Math.min(item.product_variant.DiscountedPrice, item.product_variant.FlashSalePrice)) * item.quantity).toLocaleString('vi-VN')} đ
                                            </div>
                                        </div>
                                        <div className='flex items-center justify-end' >
                                            <CloseIcon onClick={() => deleteItem(item)} className='hover:text-red-600 dark:text-white cursor-pointer' />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            )) // Ensure this closing parenthesis is correctly placed
                        ) : (
                        <div className='w-full h-[400px] flex flex-col items-center justify-center text-xl'>
                            <div className='mb-4'>
                                <img src="/images/cartnot.png" alt="" className='w-[220px] object-cover' />
                            </div>
                            <div className='text-4xl font-medium mb-4 dark:text-white'>Chưa có sản phẩm nào trong giỏ hàng</div>
                            <div>
                                <Link href={'/shop'}>
                                    <button className='bg-main p-2 rounded-lg text-white'>Quay trở lại cửa hàng</button>
                                </Link>
                            </div>
                        </div>
                    ))}



<div className='flex justify-between items-center'>
    {/* <div>
        <div className="flex justify-end">
            {selectedItems.size > 0 && ( // Only show if there are selected items
                <div className="text-red-600 cursor-pointer">
                    <DeleteIcon className='hover:text-red-600 cursor-pointer' />
                    <span>Xóa sản phẩm đã chọn</span>
                </div>
            )}
        </div>
    </div> */}
    {/* {cart.length > 0 ? (
        <div className="text-right font-semibold">
            Tổng Khối Lượng Giỏ Hàng: <span className="text-black">0.5Kg</span>
        </div>
    ) : null} */}
</div>
                </div>

                <div className='relative top-0'>
                    <div className="bg-white dark:bg-transparent p-6 rounded shadow-sm sticky top-[100px]">
                        <h2 className="text-2xl dark:text-white font-semibold mb-4">Cộng Giỏ Hàng</h2>


                        {/* <div className="mb-4">
                        <div className="flex flex-col w-full">
                            <VoucherSelector availableVouchers={availableVouchers} onVoucherSelected={handleVoucherSelected} />
                        </div>
                        <hr className="border-t-1 border-black mt-2" />
                    </div> */}

                        <div className="mb-4">
                            <p className="block text-lg font-medium dark:text-white">Thời gian giao hàng dự kiến</p>
                            <p className='dark:text-white'>1 - 2 ngày sau khi đặt hàng</p>
                            <hr className="border-t-1 border-black dark:border-white mt-2" />
                        </div>

                        <div className="py-4">
                            <div className="flex justify-between mb-2">
                                <span className='dark:text-white'>Tổng tiền</span>
                                <span className='dark:text-white'>{totalAmount.toLocaleString()} đ</span>
                            </div>
                            {/* <div className="flex justify-between mb-2">
                            <span>Khuyến mãi</span>
                            <span>{disscount.toLocaleString()} đ</span>
                        </div> */}
                            <div className="flex justify-between mb-2">
                                <span className='dark:text-white'>Số điểm tích lũy</span>
                                <span className='dark:text-white'>{loyaltyPoints.toLocaleString()} điểm</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg">
                                <span className='dark:text-white'>Tổng thanh toán</span>
                                <span className='dark:text-white text-2xl text-price'>{(totalAmount).toLocaleString()} đ</span>
                            </div>
                        </div>

                        {selectedItems.size > 0 ? (
                           <Link href={'/checkout'} onClick={handleCheckout}> 
                           <button className="w-full bg-yellow-500 text-white p-3 rounded-lg font-semibold hover:bg-yellow-600">Thanh toán</button>
                       </Link>
                        ) : (
                            <div className="w-full text-center">
                                <p className="bg-gray-200 p-2 rounded-lg">Vui lòng chọn ít nhất một sản phẩm <br /> để thanh toán</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Body_Cart;
