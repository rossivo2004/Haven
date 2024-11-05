'use client';
import React, { useState } from 'react';
import BreadcrumbNav from '../Breadcrum';
import { Input } from '@nextui-org/input';
import { Button } from '@nextui-org/button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import apiConfig from '@/src/config/api';
import { Spinner } from '@nextui-org/react';

function BodyTracking() {
    const [trackingCode, setTrackingCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleTracking = async (e: React.FormEvent) => { // Make the function async
        e.preventDefault();

        if (!trackingCode.trim()) {
            toast.error('Vui lòng nhập mã đơn hàng');
            return;
        }

        try {
            setIsLoading(true); // Show loading animation
            const response = await axios.get(`${apiConfig.order.showOrderDetailCode}${trackingCode}`); // Call the API
            // console.log(response.data);
            
            window.location.href = `/trackingorder/${response.data.order.invoice_code}`;
        } catch (error) {
            toast.error('Có lỗi xảy ra khi lấy thông tin đơn hàng'); // Error handling
            console.error(error);
        } finally {
            setIsLoading(false); // Hide loading animation
        }
    };

    return (
        <div className='mb-20'>
            <div className="py-5 h-[62px]">
                <BreadcrumbNav
                    items={[
                        { name: 'Trang chủ', link: '/' },
                        { name: 'Tra cứu đơn hàng', link: '#' },
                    ]}
                />
            </div>

            <div className='w-full h-[400px] flex lg:flex-row flex-col gap-10 lg:mt-10'>
                <div className='lg:w-1/3 w-full flex flex-col justify-center'>
                    <div className='text-4xl font-semibold mb-4'>Tra cứu đơn hàng</div>
                    <div>
                        <form onSubmit={handleTracking}>
                            <div className='mb-2'>
                                <label htmlFor="trackingCode" className='text-xl mb-2'>Mã đơn hàng</label>
                                <Input 
                                    id="trackingCode" 
                                    placeholder='Nhập mã đơn hàng' 
                                    className='w-full' 
                                    value={trackingCode}
                                    onChange={(e) => setTrackingCode(e.target.value)}
                                />
                            </div>
                            <Button type='submit' className="w-full bg-yellow-500 text-white p-3 rounded mt-4 font-bold">
                            {isLoading ? <Spinner /> : "Tra cứu"}</Button>
                        </form>
                    </div>
                </div>
                <div className='flex-1 h-full flex items-end'>
                    <img 
                        alt='Order tracking illustration' 
                        src={`/images/codifyformatter.jpg`} 
                        className='w-full h-full object-contain' 
                    />
                </div>
            </div>

            <ToastContainer />
        </div>
    );
}

export default BodyTracking;
