'use client'
import React, { useState, useEffect } from 'react';
import { Checkbox } from "@nextui-org/react";
import { useDispatch, useSelector } from 'react-redux';
import { CartItem } from '@/src/interface';
import DeleteIcon from '@mui/icons-material/Delete';
import BreadcrumbNav from '../Breadcrum';
import Link from 'next/link';
import { Chip } from "@nextui-org/react";
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@nextui-org/react';

import { ItemCart } from '@/src/interface';
import axios from 'axios';
import apiConfig from '@/src/config/api';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Body_Cart = () => {
    const userId = Cookies.get('user_id'); // Get user ID from cookies
    const [cart, setCart] = useState<ItemCart[]>([]);


    useEffect(() => {
        if (userId) {
            // Fetch user's cart from the API
            const fetchUserCart = async () => {
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

    
    const updateQuantity = async (item: ItemCart, newQuantity: number) => {
        // Ensure quantity does not go below 1
        if (newQuantity < 1) {
           toast.warning('Số lượng tối thiểu là 1');
            return; // Dừng hàm nếu số lượng không hợp lệ
        }

        if (userId) {
            // If user is logged in, update quantity via API
            try {
                await axios.put(`${apiConfig.cart.updateCartByUserId}${userId}/${item.product_variant.id}`, {
                    userId,
                    productId: item.product_variant.id,
                    quantity: newQuantity,
                }, { withCredentials: true });
                // Update local cart state after successful API call
                setCart(prevCart => 
                    prevCart.map(cartItem => 
                        cartItem.product_variant.id === item.product_variant.id 
                        ? { ...cartItem, quantity: newQuantity } 
                        : cartItem
                    )
                );
            } catch (error) {
                console.error('Error updating quantity:', error);
            }
        } else {
            // If not logged in, update quantity in cookies
            const existingCartItems = JSON.parse(Cookies.get('cart_items') || '{"cart_items": []}') as { cart_items: ItemCart[] }; // Specify type
            const updatedCartItems = existingCartItems.cart_items.map((cartItem: ItemCart) =>  // Add type annotation
                cartItem.product_variant.id === item.product_variant.id 
                ? { ...cartItem, quantity: newQuantity } 
                : cartItem
            );
            Cookies.set('cart_items', JSON.stringify({ cart_items: updatedCartItems }));
            setCart(updatedCartItems); // Update local cart state
        }
    };

    const deleteItem = async (item: ItemCart) => {
        if (userId) {
            await axios.delete(`${apiConfig.cart.deleteCartByUserId}${userId}/${item.product_variant.id}`, { withCredentials: true });
            setCart(prevCart => prevCart.filter(cartItem => cartItem.product_variant.id !== item.product_variant.id));
            toast.success('Xóa sản phẩm thành công');
        } else {
            const existingCartItems = JSON.parse(Cookies.get('cart_items') || '{"cart_items": []}');
            const updatedCartItems = existingCartItems.cart_items.filter((cartItem: ItemCart) => cartItem.product_variant.id !== item.product_variant.id);
            Cookies.set('cart_items', JSON.stringify({ cart_items: updatedCartItems }));
            setCart(updatedCartItems);
            toast.success('Xóa sản phẩm thành công');
        }
    }


    return (
        <div className="max-w-7xl mx-auto ">
            <div className="flex justify-between items-center">
                <div className="py-5 h-[62px]">
                    <BreadcrumbNav
                        items={[{ name: 'Trang chủ', link: '/' }, { name: 'Giỏ hàng', link: '#' }]}
                    />
                </div>
            </div>
            <h1 className="text-4xl font-bold mb-6 text-center">Giỏ Hàng</h1>

            <Checkbox
                // isSelected={cart.every(item => item.select)}
                // onChange={handleSelectAllChange}
                className='pl-42 mb-4'
            >
                Chọn tất cả
            </Checkbox>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    {cart.length > 0 ? (
                        cart.map((item : any) => (
                              <div className="bg-white" key={item.product_variant.id} >
                            <div className="flex justify-between items-center border-b pb-4 mb-4">
                                <div className="flex items-center">
                                    <Checkbox
                                        // isSelected={item.select}

                                        className="mr-4"
                                    />
                                    <img src={item.product_variant.image} alt={'âffff'} className="w-24 h-24 mr-4 rounded" />
                                    <div>
                                        <p className="text-xl font-semibold">{item.product_variant.name}</p>
                                        <p className="text-sm text-gray-600">fssdf</p>
                                        <div className="flex items-center mt-2">
            <button onClick={() => updateQuantity(item, item.quantity - 1)} className="px-3 py-1 border rounded">-</button>
            <span className="px-4">{item.quantity}</span>
            <button onClick={() => updateQuantity(item, item.quantity + 1)} className="px-3 py-1 border rounded">+</button>
        </div>
                                    </div>
                                </div>
                                <div className="text-right flex gap-2">
                                    <div>
                                        <span className="text-gray-500 text-sm">{item.product_variant.price.toLocaleString('vi-VN')} đ</span>
                                        <div className='text-2xl text-price font-bold'>
                                        {Math.min(item.product_variant.DiscountedPrice, item.product_variant.FlashSalePrice).toLocaleString('vi-VN')} đ
                                        </div>
                                    </div>
                                    <div className='flex items-center justify-end' >
                                        <CloseIcon onClick={() => deleteItem(item)} className='hover:text-red-600 cursor-pointer' />
                                    </div>
                                </div>
                            </div>
                        </div>
                        ))
                      

                    ) : (
                        <div className='w-full h-[400px] flex flex-col items-center justify-center text-xl'>
                            <div className='mb-4'>
                                <img src="/images/cartnot.png" alt="" className='w-[220px] object-cover' />
                            </div>
                            <div className='text-4xl font-medium mb-4'>Chưa có sản phẩm nào trong giỏ hàng</div>
                            <div>
                                <Link href={'/shop'}>
                                    <button className='bg-main p-2 rounded-lg text-white'>Quay trở lại cửa hàng</button>
                                </Link>
                            </div>
                        </div>
                    )}



                    <div className='flex justify-between items-center'>
                        <div>

                            <div className="flex justify-end">
                                <div className="text-red-600 cursor-pointer">
                                    <DeleteIcon className='hover:text-red-600 cursor-pointer' />
                                    <span>Xóa sản phẩm đã chọn</span>
                                </div>
                            </div>
                        </div>
                        {/* {cart.length > 0 ? (
                            <div className="text-right font-semibold">
                                Tổng Khối Lượng Giỏ Hàng: <span className="text-black">0.5Kg</span>
                            </div>
                        ) : null} */}
                    </div>
                </div>

                <div className='relative top-0'>
                    <div className="bg-white p-6 rounded shadow-sm sticky top-[100px]">
                        <h2 className="text-2xl font-semibold mb-4">Cộng Giỏ Hàng</h2>


                        {/* <div className="mb-4">
                        <div className="flex flex-col w-full">
                            <VoucherSelector availableVouchers={availableVouchers} onVoucherSelected={handleVoucherSelected} />
                        </div>
                        <hr className="border-t-1 border-black mt-2" />
                    </div> */}

                        <div className="mb-4">
                            <p className="block text-lg font-medium">Thời gian giao hàng dự kiến</p>
                            <p>1 - 2 ngày sau khi đặt hàng</p>
                            <hr className="border-t-1 border-black mt-2" />
                        </div>

                        <div className="py-4">
                            <div className="flex justify-between mb-2">
                                <span>Tổng tiền</span>
                                <span>50000 đ</span>
                            </div>
                            {/* <div className="flex justify-between mb-2">
                            <span>Khuyến mãi</span>
                            <span>{disscount.toLocaleString()} đ</span>
                        </div> */}
                            <div className="flex justify-between mb-2">
                                <span>Số điểm tích lũy</span>
                                <span>20000 điểm</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg">
                                <span>Tổng thanh toán</span>
                                <span className='text-2xl text-price'>555555 đ</span>
                            </div>
                        </div>

                        <Link href={'/checkout'}>
                            <button className="w-full bg-yellow-500 text-white p-3 rounded-lg font-semibold hover:bg-yellow-600">Thanh toán</button>
                        </Link>
                        <div className="w-full text-center">
                            <p className="bg-gray-200 p-2 rounded-lg">Vui lòng chọn ít nhất một sản phẩm <br /> để thanh toán</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Body_Cart;
