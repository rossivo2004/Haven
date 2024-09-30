'use client'
import React, { useState, useEffect } from 'react';
import { Checkbox } from "@nextui-org/react";
import { useDispatch, useSelector } from 'react-redux';
import { selectTotalItems, removeItem, updateQuantity, setPoints, selectAllItems, toggleSelectItem, setSum, setPriceDisscount } from '@/src/store/cartSlice';
import { CartItem } from '@/src/interface';
import DeleteIcon from '@mui/icons-material/Delete';
import BreadcrumbNav from '../Breadcrum';
import Link from 'next/link';
import { Chip } from "@nextui-org/react";
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@nextui-org/react';

const Body_Cart = () => {
    const dispatch = useDispatch();
    const cart = useSelector((state: { cart: { items: CartItem[] } }) => state.cart.items);
    const totalItems = useSelector(selectTotalItems);
    const point = useSelector((state: { cart: { point: number } }) => state.cart.point);

    const [totalSelectedPrice, setTotalSelectedPrice] = useState<number>(0);
    // const [disscount, setDisscount] = useState<number>(0);
    const [totalAfterDiscount, setTotalAfterDiscount] = useState<number>(0);
    const [isMounted, setIsMounted] = useState(false);

    const handleQuantityChange = (id: number, quantity: number) => {
        if (quantity > 0) {
            dispatch(updateQuantity({ id, quantity }));
        }
    };

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        const total = cart.reduce((acc: number, item: CartItem) => {
            if (item.select) {
                return acc + item.salePrice * item.quantity;
            }
            return acc;
        }, 0);

        const pointS = total * 0.01;
        const integerPoints = Math.floor(pointS);
        dispatch(setPoints(integerPoints));

        setTotalSelectedPrice(total);
        setTotalAfterDiscount(total);
        dispatch(setSum(total)); // Update sum in Redux state
    }, [cart, dispatch]);

    const handleSelectAllChange = () => {
        const allSelected = !cart.every(item => item.select);
        dispatch(selectAllItems(allSelected));
    };

    // const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);

    // const handleVoucherSelected = (voucher: Voucher | null) => {
    //     setSelectedVoucher(voucher);
    //     if (voucher) {
    //         // Calculate discount
    //         const discountAmount = (totalSelectedPrice * voucher.discount) / 100;
    //         const newTotalAfterDiscount = totalSelectedPrice - discountAmount;
    
    //         // Set component state
    //         setTotalAfterDiscount(newTotalAfterDiscount);
    //         setDisscount(discountAmount);
    
    //         // Update Redux state
    //         dispatch(setPriceDisscount(discountAmount));
    //         dispatch(setSum(newTotalAfterDiscount)); // Update total sum after discount
    //     } else {
    //         // Reset discount if no voucher is selected
    //         setTotalAfterDiscount(totalSelectedPrice);
    //         setDisscount(0);
    
    //         // Reset Redux state
    //         dispatch(setPriceDisscount(0));
    //         dispatch(setSum(totalSelectedPrice)); // Reset sum to original total
    //     }
    // };
    

    if (!isMounted) return null;

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
            {cart.length > 0 ? (
                <Checkbox
                    isSelected={cart.every(item => item.select)}
                    onChange={handleSelectAllChange}
                    className='pl-42 mb-4'
                >
                    Chọn tất cả
                </Checkbox>
            ) : null}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    {cart.length > 0 ? (
                        cart.map((item) => (
                            <div key={item.id} className="bg-white">
                                <div className="flex justify-between items-center border-b pb-4 mb-4">
                                    <div className="flex items-center">
                                        <Checkbox
                                            isSelected={item.select}
                                            onChange={() => dispatch(toggleSelectItem(item.id))}
                                            className="mr-4"
                                        />
                                        <img src={item.images[0]} alt={item.name} className="w-24 h-24 mr-4 rounded" />
                                        <div>
                                            <p className="text-xl font-semibold">{item.name}</p>
                                            {item.description && <p className="text-sm text-gray-600">{item.description}</p>}
                                            <div className="flex items-center mt-2">
                                                <button
                                                    onClick={() => item.quantity > 1 && handleQuantityChange(item.id, item.quantity - 1)}
                                                    className="px-3 py-1 border rounded">-</button>
                                                <span className="px-4">{item.quantity}</span>
                                                <button
                                                    onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                                                    className="px-3 py-1 border rounded">+</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right flex gap-2">
                                        <div>
                                        <span className="text-gray-500 text-sm">{item.salePrice.toLocaleString()} đ</span>
<div className='text-2xl text-price font-bold'>{(item.salePrice * item.quantity).toLocaleString()} đ</div>
                                        </div>
                                        <div className='flex items-center justify-end' onClick={() => dispatch(removeItem(item.id))}>
                                            <CloseIcon className='hover:text-red-600 cursor-pointer' />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className='w-full h-[400px] flex flex-col items-center justify-center text-xl'>
                            <div className='mb-4'>
                                <img src="/images/cartnot.png" alt="" className='w-[220px] object-cover'/>
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
                            {cart.some(item => item.select) && (
                                <div className="flex justify-end">
                                    <div onClick={() => cart.forEach(item => item.select && dispatch(removeItem(item.id)))} className="text-red-600 cursor-pointer">
                                        <DeleteIcon className='hover:text-red-600 cursor-pointer' />
                                        <span>Xóa sản phẩm đã chọn</span>
                                    </div>
                                </div>
                            )}
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
                            <span>{totalSelectedPrice.toLocaleString()} đ</span>
                        </div>
                        {/* <div className="flex justify-between mb-2">
                            <span>Khuyến mãi</span>
                            <span>{disscount.toLocaleString()} đ</span>
                        </div> */}
                        <div className="flex justify-between mb-2">
                            <span>Số điểm tích lũy</span>
                            <span>{point} điểm</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg">
                            <span>Tổng thanh toán</span>
                            <span className='text-2xl text-price'>{totalAfterDiscount.toLocaleString()} đ</span>
                        </div>
                    </div>

                    {cart.some(item => item.select) ? (
                        <Link href={'/checkout'}>
                            <button className="w-full bg-yellow-500 text-white p-3 rounded-lg font-semibold hover:bg-yellow-600">Thanh toán</button>
                        </Link>
                    ) : (
                        <div className="w-full text-center">
                            <p className="bg-gray-200 p-2 rounded-lg">Vui lòng chọn ít nhất một sản phẩm <br/> để thanh toán</p>
                        </div>
                    )}
                </div>
</div>
            </div>
        </div>
    );
};

export default Body_Cart;
