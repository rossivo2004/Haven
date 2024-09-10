'use client';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BreadcrumbNav from '../Breadcrum';
import { Input, Textarea } from '@nextui-org/input';
import { RadioGroup, Radio, cn } from "@nextui-org/react";
import { Button, Select, SelectItem } from "@nextui-org/react";
import axios from 'axios';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import LocationSelector from '../SelectProvince';
import { DUMP_SHIPPING_METHOD } from '@/src/dump';
import { CartItem } from '@/src/interface';

interface Province {
    id: string;
    full_name: string;
}

interface District {
    id: string;
    full_name: string;
}

interface Ward {
    id: string;
    full_name: string;
}

const CustomRadio = (props: any) => {
    const { children, ...otherProps } = props;

    return (
        <Radio
            {...otherProps}
            classNames={{
                base: cn(
                    "inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between",
                    "flex-row-reverse min-w-[290px] cursor-pointer rounded-lg gap-4 p-4 border-2 border-transparent",
                    "data-[selected=true]:border-primary"
                ),
            }}
        >
            {children}
        </Radio>
    );
};

function BodyCheckout() {
    const cart = useSelector((state: { cart: { items: CartItem[] } }) => state.cart.items);
    const [cartData, setCartData] = useState<CartItem[]>([]);

    const [provinces, setProvinces] = useState<Province[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);
    const [selectedProvince, setSelectedProvince] = useState<string>('');
    const [selectedDistrict, setSelectedDistrict] = useState<string>('');

    useEffect(() => {
        setCartData(cart);
    }, [cart]);

    useEffect(() => {
        // Fetch provinces
        axios.get('https://esgoo.net/api-tinhthanh/1/0.htm')
            .then(response => {
                if (response.data.error === 0) {
                    setProvinces(response.data.data);
                }
            })
            .catch(error => console.error('Error fetching provinces:', error));
    }, []);

    useEffect(() => {
        if (selectedProvince) {
            // Fetch districts when province changes
            axios.get(`https://esgoo.net/api-tinhthanh/2/${selectedProvince}.htm`)
                .then(response => {
                    if (response.data.error === 0) {
                        setDistricts(response.data.data);
                        setWards([]); // Clear wards when district changes
                        setSelectedDistrict(''); // Reset selected district
                    }
                })
                .catch(error => console.error('Error fetching districts:', error));
        }
    }, [selectedProvince]);

    useEffect(() => {
        if (selectedDistrict) {
            // Fetch wards when district changes
            axios.get(`https://esgoo.net/api-tinhthanh/3/${selectedDistrict}.htm`)
                .then(response => {
                    if (response.data.error === 0) {
                        setWards(response.data.data);
                    }
                })
                .catch(error => console.error('Error fetching wards:', error));
        }
    }, [selectedDistrict]);

    return (
        <div className="max-w-screen-xl lg:mx-auto mx-4">
            <div className="py-5 h-[62px]">
                <BreadcrumbNav
                    items={[
                        { name: 'Trang chủ', link: '/' },
                        { name: 'Giỏ hàng', link: '/cart' },
                        { name: 'Checkout', link: '#' },
                    ]}
                />
            </div>

            <div>
                <div className="max-w-7xl mx-auto p-6">
                    <h1 className="text-4xl font-bold mb-6 text-center">Checkout</h1>
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        <form className="lg:col-span-2">
                            <h2 className="text-2xl font-semibold mb-4">Thanh Toán</h2>
                            <form className='flex flex-col gap-5'>
                                <div>
                                    <label htmlFor="">Họ và tên người nhận</label>
                                    <Input variant='bordered' placeholder='Họ và tên người nhận' />
                                </div>
                                <div className='flex gap-5'>
                                    <div className='w-1/2'>
                                        <label htmlFor="">Số điện thoại</label>
                                        <Input variant='bordered' placeholder='Số điện thoại' />
                                    </div>
                                    <div className='flex-1'>
                                        <label htmlFor="">Email</label>
                                        <Input variant='bordered' placeholder='Email' />
                                    </div>
                                </div>

                                <div className='grid lg:grid-cols-3 grid-cols-1 gap-4'>
                                    <div>
                                        <div className=''>
                                            Tỉnh/Thành phố (<span className='text-red-600'>*</span>)
                                        </div>
                                        <Select
                                            placeholder='Tỉnh/Thành phố'
                                            aria-label="Tỉnh/Thành phố"
                                            size='lg'
                                            variant='bordered'
                                            value={selectedProvince}
                                            onChange={(e) => setSelectedProvince(e.target.value)}
                                        >
                                            <SelectItem key="0" value="">Tỉnh Thành</SelectItem>
                                            {provinces.map((province) => (
                                                <SelectItem key={province.id} value={province.id}>
                                                    {province.full_name}
                                                </SelectItem>
                                            )) as any}
                                        </Select>
                                    </div>

                                    <div>
                                        <div className=''>
                                            Quận/Huyện (<span className='text-red-600'>*</span>)
                                        </div>
                                        <Select
                                            placeholder='Quận/Huyện'
                                            aria-label="Quận/Huyện"
                                            size='lg'
                                            variant='bordered'
                                            value={selectedDistrict}
                                            onChange={(e) => setSelectedDistrict(e.target.value)}
                                            isDisabled={!selectedProvince} // Disable if no province is selected
                                        >
                                            <SelectItem key="0" value="">Quận Huyện</SelectItem>
                                            {districts.map((district) => (
                                                <SelectItem
                                                    key={district.id}
                                                    value={district.id}
                                                >
                                                    {district.full_name}
                                                </SelectItem>
                                            )) as any}

                                        </Select>
                                    </div>

                                    <div>
                                        <div className=''>
                                            Phường/Xã (<span className='text-red-600'>*</span>)
                                        </div>
                                        <Select
                                            placeholder='Phường/Xã'
                                            aria-label="Phường/Xã"
                                            size='lg'
                                            variant='bordered'
                                            value={selectedDistrict}
                                            onChange={(e) => setSelectedDistrict(e.target.value)}
                                            isDisabled={!selectedDistrict} // Disable if no district is selected
                                        >
                                            <SelectItem key="0" value="">Phường Xã</SelectItem>
                                            {wards.map((ward) => (
                                                <SelectItem key={ward.id} value={ward.id}>
                                                    {ward.full_name}
                                                </SelectItem>
                                            )) as any}
                                        </Select>
                                    </div>
                                </div>


                                <div>
                                    <label htmlFor="">Địa chỉ nhận hàng</label>
                                    <Textarea disableAutosize disableAnimation classNames={{
                                        base: "",
                                        input: "resize-y min-h-[40px]",
                                    }} placeholder='Địa chỉ chi tiết' variant='bordered' />
                                </div>

                                {/* Shipping method */}
                                <div className="mb-10">
                                    <label className="block">Phương thức vận chuyển</label>
                                    <Select size='lg' className="w-full mb-4" isRequired placeholder='Phương thức vận chuyển' variant='bordered'>
                                        {
                                            DUMP_SHIPPING_METHOD.map((item, index) => (
                                                <SelectItem key={index} value={item.id}>{item.name}</SelectItem>
                                            ))
                                        }

                                    </Select>
                                    <hr className="border-t-1 border-black mt-2" />
                                </div>

                                {/* Payment method */}
                                <div className="mb-4 ww-full">
                                    <label className="block text-lg font-medium">Hình thức thanh toán</label>
                                    <RadioGroup orientation="horizontal" className='w-full' defaultValue="pay-cash">
                                        <CustomRadio value="pay-momo">
                                            <div className='flex items-center gap-5'>
                                                <div>
                                                    <img src="/images/momo.png" alt="Momo payment" className='w-10 h-10' />
                                                </div>
                                                <div>Momo</div>
                                            </div>
                                        </CustomRadio>
                                        <CustomRadio value="pay-cash">
                                            <div className='flex items-center gap-5'>
                                                <div>
                                                    <img src="/images/cash.png" alt="Cash payment" className='w-10 h-10 object-cover' />
                                                </div>
                                                <div>Tiền mặt</div>
                                            </div>
                                        </CustomRadio>
                                    </RadioGroup>
                                </div>
                            </form>
                        </form>

                        {/* bên phải */}
                        <div className="lg:col-span-2 bg-white lg:p-6 rounded shadow-sm">
                            <div className="bg-white lg:p-4 rounded shadow-sm mb-4">
                                {cart.map((item, index) => (
                                    <div key={item.id} className="flex justify-between items-center border-b pb-4 mb-4">
                                        <div className="flex items-start">
                                            <img src={item.images[0]} alt={item.name} className="w-24 h-24 mr-4 rounded" />
                                            <div>
                                                <p className="font-semibold">{item.name}</p>
                                                <p className="text-sm text-gray-600">{item.description}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-red-500 font-bold">{item.price.toLocaleString()} đ</span><br />
                                            <span className="text-sm text-gray-500 line-through">{item.price.toLocaleString()} đ đã giảm giá</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="text-right font-semibold mb-10">
                                Tổng Khối Lượng Giỏ Hàng: <span className="text-black">0.5Kg</span>
                            </div>

                            <div className="py-4">
                                <div className="flex justify-between mb-2">
                                    <span>Tổng tiền</span>
                                    <span>00,000,000</span>
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
                                    <span>00,000,000</span>
                                </div>
                            </div>
                        </div>

                        <div className='lg:col-span-2'>
                            <button className="w-full bg-yellow-500 text-white p-3 rounded mt-4 font-bold">
                                Tiếp tục
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BodyCheckout;
