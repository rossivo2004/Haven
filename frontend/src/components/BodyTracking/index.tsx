'use client';
import React, { useState } from 'react';
import BreadcrumbNav from '../Breadcrum';
import { Input } from '@nextui-org/input';
import { Button } from '@nextui-org/button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function BodyTracking() {
    const [trackingCode, setTrackingCode] = useState('');

    const handleTracking = (e: React.FormEvent) => {
        e.preventDefault();

        if (!trackingCode.trim()) {
            toast.error('Vui lòng nhập mã đơn hàng');
            return;
        }

        // Implement your tracking logic here
        toast.success('Đang tra cứu đơn hàng...');

        // Example: Call an API to track the order
        // fetch(`/api/track-order?code=${trackingCode}`)
        //     .then(response => response.json())
        //     .then(data => {
        //         if (data.success) {
        //             toast.success('Đơn hàng của bạn đang được xử lý');
        //         } else {
        //             toast.error('Mã đơn hàng không hợp lệ');
        //         }
        //     })
        //     .catch(error => {
        //         toast.error('Có lỗi xảy ra. Vui lòng thử lại sau');
        //     });
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
                            <div className='mb-6'>
                                <label htmlFor="trackingCode" className='text-xl mb-2'>Mã đơn hàng</label>
                                <Input 
                                    id="trackingCode" 
                                    placeholder='Nhập mã đơn hàng' 
                                    className='w-full' 
                                    value={trackingCode}
                                    onChange={(e) => setTrackingCode(e.target.value)}
                                />
                            </div>
                            <Button className="w-full bg-yellow-500 text-white p-3 rounded mt-4 font-bold">
                            Tra cứu</Button>
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
