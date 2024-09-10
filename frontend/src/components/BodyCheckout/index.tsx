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
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { selectTotalItems, removeItem, updateQuantity, setSelectedItems, setPoints, toggleSelectItem } from '@/src/store/cartSlice';

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
    const dispatch = useDispatch();

    const cart = useSelector((state: { cart: { items: CartItem[] } }) => state.cart.items);
    const [cartData, setCartData] = useState<CartItem[]>([]);

    const [provinces, setProvinces] = useState<Province[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);
    const [selectedProvince, setSelectedProvince] = useState<string>('');
    const [selectedDistrict, setSelectedDistrict] = useState<string>('');
    const point = useSelector((state: { cart: { point: number } }) => state.cart.point);
    const [pointMM, setPointMM] = useState<number>(0);
    const [ship, setShip] = useState<number>(0);
    const [sum, setSum] = useState<number>(0);
    const [disscount, setDisscount] = useState<number>(0);


    const [totalSelectedPrice, setTotalSelectedPrice] = useState<number>(0);
    
    const selectedItems = cart.filter(item => item.select);

    const priceDisscount = useSelector((state: { cart: { priceDisscount: number } }) => state.cart.priceDisscount);
const totalSum = useSelector((state: { cart: { sum: number } }) => state.cart.sum);

    useEffect(() => {
        setCartData(selectedItems);
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

    useEffect(() => {
        const total = cart.reduce((acc: number, item: CartItem) => {
            if (item.select) {
                return acc + item.salePrice * item.quantity;
            }
            return acc;
        }, 0);

        const pointS = total * 0.01;
        const integerPoints = Math.floor(pointS); // Làm tròn số điểm tích lũy
        dispatch(setPoints(integerPoints));

        setTotalSelectedPrice(total);
        setPointMM(integerPoints)
    }, [cart, dispatch]);


    useEffect(() => {
        if (selectedProvince === '79') {
            setShip(0);
        } else if (selectedProvince === '') {
            setShip(0);
        } else {
            setShip(30000)
        }
        
    }, [selectedProvince]);


    useEffect(() => {
        setSum(totalSum + ship);
    }, [totalSelectedPrice, ship]);
    
    console.log(selectedProvince);
    console.log(ship);
    

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
                {/* Main form without nesting another form */}
                <form className="max-w-7xl mx-auto p-6">
                    <h1 className="text-4xl font-bold mb-6 text-center">Checkout</h1>
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        <div className="lg:col-span-2">
                            <h2 className="text-2xl font-semibold mb-4">Thanh Toán</h2>

                            <div className='flex flex-col gap-5'>
                                <div>
                                    <label htmlFor="">Họ và tên người nhận</label>
                                    <Input size='lg' variant='bordered' placeholder='Họ và tên người nhận' />
                                </div>
                                <div className='flex gap-5'>
                                    <div className='w-1/2'>
                                        <label htmlFor="">Số điện thoại</label>
                                        <Input size='lg' variant='bordered' placeholder='Số điện thoại' />
                                    </div>
                                    <div className='flex-1'>
                                        <label htmlFor="">Email</label>
                                        <Input size='lg' variant='bordered' placeholder='Email' />
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
                                <div className="">
                                    <label className="block">Phương thức vận chuyển</label>
                                    <Select size='lg' className="w-full mb-4" isRequired placeholder='Phương thức vận chuyển' variant='bordered'>
                                        {
                                            DUMP_SHIPPING_METHOD.map((item, index) => (
                                                <SelectItem key={index} value={item.id}>{item.name}</SelectItem>
                                            ))
                                        }

                                    </Select>
                                </div>

                                {/* Payment method */}
                                <div className="mb-4 ww-full">
                                    <label className="block">Hình thức thanh toán</label>
                                    <RadioGroup orientation="horizontal" className='w-full' defaultValue="pay-cash">
                                        <CustomRadio value="pay-momo">
                                            <div className='flex items-center gap-5'>
                                                <div>
                                                    <img src="/images/momo.png" alt="Momo payment" className='w-10 h-10' />
                                                </div>
                                                <span>Ví điện tử Momo</span>
                                            </div>
                                        </CustomRadio>
                                        <CustomRadio value="pay-cash">
                                            <div className='flex items-center gap-5'>
                                                <div>
                                                    <MonetizationOnIcon />
                                                </div>
                                                <span>Thanh toán khi nhận hàng</span>
                                            </div>
                                        </CustomRadio>
                                    </RadioGroup>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-2">
                            <h2 className="text-2xl font-semibold mb-4">Tóm tắt đơn hàng</h2>
                            {/* Cart items summary */}
                            <div className='shadow-md border rounded-md p-6'>
                                <ul>
                                    {cartData.map((item, index) => (
                                        <li key={index} className="flex justify-between items-center border-b pb-4 mb-4">
                                              <div className="flex items-start h-full">
                                            <img src={item.images[0]} alt={item.name} className="w-24 h-24 mr-4 rounded" />
                                            <div className='flex flex-col justify-between h-full'>
                                                <p className="font-semibold">{item.name}</p>
                                                <p className="text-sm text-gray-600"> x{item.quantity}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-red-500 font-bold">{item.price.toLocaleString()} đ</span><br />
                                            <span className="text-xs text-gray-500 "><span className='line-through'>{item.price.toLocaleString()}</span> đ đã giảm giá</span>
                                        </div>
                                        </li>
                                    ))}
                                </ul>
                                <div className="py-4">
                                <div className="flex justify-between mb-2">
                                    <span>Tổng tiền</span>
                                    <span>{totalSum.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span>Khuyến mãi</span>
                                    <span>{priceDisscount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span>Phí vận chuyển</span>
                                    <span>
    {ship === 0 ? 'Miễn phí' : ship.toLocaleString()}
</span>

                                </div>
                                <div className="flex justify-between mb-2">
                                    <span>Số điểm tích lũy</span>
                                    <span>{pointMM}</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Tổng thanh toán</span>
                                    <span>{sum.toLocaleString()}</span>
                                </div>
                            </div>
                                <Button className="w-full mt-4 bg-main font-semibold text-white">Đặt hàng</Button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default BodyCheckout;
