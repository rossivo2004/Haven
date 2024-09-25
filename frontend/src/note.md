'use client';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Switch } from '@nextui-org/react';
import Link from 'next/link';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { setPoints } from '@/src/store/cartSlice'; // Assuming this updates the points in the store
import { CartItem } from '@/src/interface';
import axios from 'axios';
import BreadcrumbNav from '../Breadcrum';
import { Input, Textarea } from '@nextui-org/input';
import { Select, SelectItem } from '@nextui-org/react';
import CustomRadio from './CustomRadio'; // Extracted for simplicity
import { IUser } from '@/src/interface';

function BodyCheckout() {
    const dispatch = useDispatch();
    const [isMounted, setIsMounted] = useState(false);
    const [usePoints, setUsePoints] = useState(false);
    const cart = useSelector((state: { cart: { items: CartItem[] } }) => state.cart.items);
    const point = useSelector((state: { cart: { point: number } }) => state.cart.point);
    const [user, setUser] = useState<IUser | null>(null);
    const [sum, setSum] = useState<number>(0);
    const [ship, setShip] = useState<number>(0);
    const [discount, setDiscount] = useState<number>(0);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // Calculate total selected cart items' price
    const totalSelectedPrice = cart.reduce((acc, item) => {
        if (item.select) {
            return acc + item.salePrice * item.quantity;
        }
        return acc;
    }, 0);

    // Apply points as discount when switch is toggled
    useEffect(() => {
        if (usePoints && user) {
            const pointsValue = user.point; // Assuming 1 point = 1 currency unit
            const applicableDiscount = Math.min(pointsValue, totalSelectedPrice); // Cap discount at total price
            setDiscount(applicableDiscount);
        } else {
            setDiscount(0);
        }
    }, [usePoints, user, totalSelectedPrice]);

    useEffect(() => {
        setSum(totalSelectedPrice + ship - discount);
    }, [totalSelectedPrice, ship, discount]);

    return (
        <div className="max-w-screen-xl lg:mx-auto mx-4 px-4">
            <div className="py-5 h-[62px]">
                <BreadcrumbNav
                    items={[
                        { name: 'Trang chủ', link: '/' },
                        { name: 'Giỏ hàng', link: '/cart' },
                        { name: 'Checkout', link: '#' },
                    ]}
                />
            </div>
            <form className="max-w-7xl mx-auto p-6">
                <h1 className="text-4xl font-bold mb-6 text-center">Checkout</h1>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Checkout form */}
                    <div className="lg:col-span-2">
                        {/* Payment and shipping details here */}
                    </div>

                    <div className="lg:col-span-2">
                        <h2 className="text-2xl font-semibold mb-4">Tóm tắt đơn hàng</h2>
                        <div className='shadow-md border rounded-md p-6'>
                            {/* Cart items summary */}
                            <div className="py-4">
                                <div className="flex justify-between mb-2">
                                    <span>Tổng tiền</span>
                                    <span>{totalSelectedPrice.toLocaleString()} đ</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span>Phí vận chuyển</span>
                                    <span>{ship === 0 ? 'Miễn phí' : `${ship.toLocaleString()} đ`}</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span>Số điểm tích lũy</span>
                                    <span>{point}</span>
                                </div>
                                <div className='mb-2 flex justify-between items-center'>
                                    {user ? (
                                        <>
                                            <div className='flex items-center'>
                                                <MonetizationOnIcon className='mr-1' />Dùng <span className='mx-1 font-semibold'>{user.point}</span> điểm
                                            </div>
                                            <div>
                                                <Switch
                                                    checked={usePoints}
                                                    onChange={(e) => setUsePoints(e.target.checked)}
                                                    aria-label="Use points to reduce order total"
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <div>
                                            Vui lòng <Link href={'/login'} className='underline'>Đăng nhập</Link> để sử dụng điểm.
                                        </div>
                                    )}
                                </div>
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Tổng thanh toán</span>
                                    <span className='text-2xl text-price'>{sum.toLocaleString()} đ</span>
                                </div>
                            </div>
                            <Button className="w-full mt-4 bg-main font-semibold text-white">Đặt hàng</Button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default BodyCheckout;
