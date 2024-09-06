'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Checkbox } from "@nextui-org/react";
import { useDispatch, useSelector } from 'react-redux';
import { selectTotalItems, removeItem, updateQuantity, setSelectedItems } from '@/src/store/cartSlice';
import { CartItem } from '@/src/interface';

const Body_Cart = () => {
    const dispatch = useDispatch();
    const cart = useSelector((state: { cart: { items: CartItem[] } }) => state.cart.items);
    const totalItems = useSelector(selectTotalItems);

    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [totalSelectedPrice, setTotalSelectedPrice] = useState<number>(0);
    const [isMounted, setIsMounted] = useState(false);

    const handleQuantityChange = (id: number, quantity: number) => {
        if (quantity > 0) {
            dispatch(updateQuantity({ id, quantity }));
        }
    };

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleCheckSelected = (id: number) => {
        setSelectedItems(prevSelected => {
            if (prevSelected.includes(id)) {
                // Bỏ chọn sản phẩm
                return prevSelected.filter(item => item !== id);
            } else {
                // Chọn sản phẩm
                return [...prevSelected, id];
            }
        });
    };

    // Hàm xử lý chọn hoặc bỏ chọn tất cả sản phẩm
    const handleSelectAll = () => {
        if (selectedItems.length === cart.length) {
            setSelectedItems([]); // Bỏ chọn tất cả
        } else {
            setSelectedItems(cart.map((item: any) => item.id)); // Chọn tất cả
        }
    };

    // Cập nhật tổng giá trị các sản phẩm được chọn
    useEffect(() => {
        const total = cart.reduce((acc: number, item: any) => {
            if (selectedItems.includes(item.id)) {
                return acc + item.price * item.quantity;
            }
            return acc;
        }, 0);
        setTotalSelectedPrice(total);
    }, [selectedItems, cart]);


    if (!isMounted) return null;

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-4xl font-bold mb-6 text-center">Giỏ Hàng</h1>
            <Checkbox
              isSelected={selectedItems.length === cart.length}
              onChange={handleSelectAll}
                className='pl-42'
            />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    {cart.map((item) => (
                        <div key={item.id} className="bg-white">
                            <div className="flex justify-between items-center border-b pb-4 mb-4">
                                <div className="flex items-center">
                                    <Checkbox
                                          isSelected={selectedItems.includes(item.id)}
                                          onChange={() => handleCheckSelected(item.id)}
                                        className="mr-4"
                                    />
                                    <img src={item.images[0]} alt={item.name} className="w-24 h-24 mr-4 rounded" />
                                    <div>
                                        <p className="font-semibold">{item.name}</p>
                                        {item.description && <p className="text-sm text-gray-600">{item.description}</p>}
                                        <div className="flex items-center mt-2">
                                            <button
                                                onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                                                className="px-3 py-1 border rounded">-</button>
                                            <span className="px-4">{item.quantity}</span>
                                            <button
                                                onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                                                className="px-3 py-1 border rounded">+</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-red-500 font-bold">{item.price.toLocaleString()} đ</span><br />
                                    {item.discount && (
                                        <span className="text-sm text-gray-500 line-through">{item.discount.toLocaleString()} đ đã giảm giá</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="text-right font-semibold">
                        Tổng Khối Lượng Giỏ Hàng: <span className="text-black">0.5Kg</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded shadow-sm">
                    <h2 className="text-2xl font-semibold mb-4">Thanh Toán</h2>

                    <div className="mb-4">
                        <div className="flex items-center justify-between">
                            <label className="block text-lg font-medium mr-4">Mã giảm giá</label>
                            <input
                                type="text"
                                className="flex-grow p-1 border border-gray-300 rounded placeholder-gray-500 focus:outline-none focus:border-black" placeholder="Chọn hoặc nhận mã" />
                        </div>
                        <hr className="border-t-1 border-black mt-2" />
                    </div>

                    <div className="mb-4">
                        <label className="block text-lg font-medium pb-2">Ghi chú đơn hàng</label>
                        <textarea className="w-full p-2 border rounded" placeholder="Nhập nội dung"></textarea>
                        <hr className="border-t-1 border-black mt-2" />
                    </div>

                    <div className="mb-4">
                        <p className="block text-lg font-medium">Thời gian giao hàng dự kiến</p>
                        <p>5 ngày làm việc</p>
                        <hr className="border-t-1 border-black mt-2" />
                    </div>

                    <div className="py-4">
                        <div className="flex justify-between mb-2">
                            <span>Tổng tiền</span>
                            <span>{totalSelectedPrice.toLocaleString()} đ</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span>Khuyến mãi</span>
                            <span>00,000,000</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span>Phí vận chuyển</span>
                            <span>00,000,000</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span>Số điểm tích lũy</span>
                            <span>50</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg">
                            <span>Tổng thanh toán</span>
                            <span>{totalSelectedPrice.toLocaleString()} đ</span>
                        </div>
                    </div>

                    <button className="w-full bg-yellow-500 text-white p-3 rounded mt-4 font-bold">
                        Tiếp tục
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Body_Cart;