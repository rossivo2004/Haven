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
import { Switch } from "@nextui-org/react"
import Link from 'next/link';
import { IUser } from '@/src/interface';

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

interface ShipMethod {
    id: string;
    name: string;
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
                    "data-[selected=true]:border-primary lg:w-[300px]"
                ),
            }}
        >
            {children}
        </Radio>
    );
};

function BodyCheckout() {
    const dispatch = useDispatch();
    const [isMounted, setIsMounted] = useState(false);
    const [usePoints, setUsePoints] = useState(false);

    const cart = useSelector((state: { cart: { items: CartItem[] } }) => state.cart.items);
    const [cartData, setCartData] = useState<CartItem[]>([]);

    const [provinces, setProvinces] = useState<Province[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);
    const [shipMethod, setShipMethod] = useState<string>('');
    const [payMethod, setPayMethod] = useState<string>('');

    const [selectedProvince, setSelectedProvince] = useState<string>('');
    const [selectedDistrict, setSelectedDistrict] = useState<string>('');
    const [selectedWard, setSelectedWard] = useState<string>('');
    const point = useSelector((state: { cart: { point: number } }) => state.cart.point);
    const [pointMM, setPointMM] = useState<number>(0);
    const [ship, setShip] = useState<number>(0);
    const [sum, setSum] = useState<number>(0);
    const [vat, setVat] = useState<number>(0);
    const [discount, setDiscount] = useState<number>(0);
    const [user, setUser] = useState<IUser | null>(null);


    const [totalSelectedPrice, setTotalSelectedPrice] = useState<number>(0);

    const selectedItems = cart.filter(item => item.select);

    const priceDisscount = useSelector((state: { cart: { priceDisscount: number } }) => state.cart.priceDisscount);
    const totalSum = useSelector((state: { cart: { sum: number } }) => state.cart.sum);

// console.log(selectedItems);


    useEffect(() => {
        setIsMounted(true);
    }, []);

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
                    console.log(response.data.data);
                        
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
        setSum(totalSelectedPrice + ship - discount);
    }, [totalSelectedPrice, ship, discount]);

    // console.log(selectedProvince);
    // console.log(ship);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    useEffect(() => {
        if (usePoints && user) {
            const pointsValue: number = user?.point ?? 0; // Số điểm người dùng hiện có
            const maxDiscount = totalSelectedPrice * 0.5; // Giới hạn giảm giá là 50% giá trị đơn hàng
            const applicableDiscount = Math.min(pointsValue, maxDiscount); // Giảm giá tối đa là 50% hoặc số điểm người dùng có
            setDiscount(applicableDiscount);
        } else {
            setDiscount(0);
        }
    }, [usePoints, user, totalSelectedPrice]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevent default form submission behavior
    
        // Find the name for province, district, and ward
        const provinceName = provinces.find(province => province.id === selectedProvince)?.full_name || '';
        const districtName = districts.find(district => district.id === selectedDistrict)?.full_name || '';
        const wardName = wards.find(ward => ward.id === selectedWard)?.full_name || '';
    
        // Get selected shipping and payment methods
        const shippingMethod = (document.getElementById('ship') as HTMLSelectElement).value;
        const paymentMethod = (document.querySelector('input[name="pay"]:checked') as HTMLInputElement)?.value;
    
        // Calculate the total amount
        const totalAmount = sum;
    
        // Log the form data with names
        const formData = {
            fullName: (document.getElementById('full-name') as HTMLInputElement).value,
            phoneNumber: (document.getElementById('phone-user') as HTMLInputElement).value,
            email: (document.getElementById('email-user') as HTMLInputElement).value,
            address: (document.getElementById('address') as HTMLTextAreaElement).value,
            province: provinceName,
            district: districtName,
            ward: wardName,
            shippingMethod: shipMethod,
            paymentMethod: payMethod,
            poin: pointMM,
            totalAmount // Add the total amount here
        };
    
        console.log('Form Data:', formData);
    
        // Log the cart data
        console.log('Cart Data:', cartData);
    
        // Additional actions can be added here, like dispatching a form submission or API call
    }
    
    
    

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

            <div>
                {/* Main form without nesting another form */}
                <form className="max-w-7xl mx-auto" onSubmit={handleSubmit}>
                    <h1 className="text-4xl font-bold mb-6 text-center">Checkout</h1>
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        <div className="lg:col-span-2">
                            <h2 className="text-2xl font-semibold mb-4">Thanh Toán</h2>

                            <div className='flex flex-col gap-5'>
                                <div>
                                    <label htmlFor="full-name">Họ và tên người nhận</label>
                                    <Input required id='full-name' size='lg' variant='bordered' placeholder='Họ và tên người nhận' />
                                </div>
                                <div className='flex gap-5'>
                                    <div className='w-1/2'>
                                        <label htmlFor="phone-user">Số điện thoại</label>
                                        <Input required id='phone-user' size='lg' variant='bordered' placeholder='Số điện thoại' />
                                    </div>
                                    <div className='flex-1'>
                                        <label htmlFor="email-user">Email</label>
                                        <Input required id='email-user' size='lg' variant='bordered' placeholder='Email' />
                                    </div>
                                </div>

                                <div className='grid lg:grid-cols-3 grid-cols-1 gap-4'>
                                    <div>
                                        <div className=''>
                                            Tỉnh/Thành phố (<span className='text-red-600'>*</span>)
                                        </div>
                                        <Select
                                        isRequired
                                            placeholder='Tỉnh/Thành phố'
                                            aria-label="Tỉnh/Thành phố"
                                            size='lg'
                                            variant='bordered'
                                            value={selectedProvince}
                                            onChange={(e) => setSelectedProvince(e.target.value)}
                                        >
                                            {provinces.map((province) => (
                                                <SelectItem key={province.id} value={province.full_name}>
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
                                        isRequired
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
                                                    value={district.full_name}
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
                                        isRequired
                                            placeholder='Phường/Xã'
                                            aria-label="Phường/Xã"
                                            size='lg'
                                            variant='bordered'
                                            value={selectedWard}
                                            onChange={(e) => setSelectedWard(e.target.value)}
                                            isDisabled={!selectedDistrict} // Disable if no district is selected
                                        >
                                            {wards.map((ward) => (
                                                <SelectItem key={ward.id} value={ward.full_name}>
                                                    {ward.full_name}
                                                </SelectItem>
                                            )) as any}
                                        </Select>
                                    </div>
                                </div>


                                <div>
                                    <label htmlFor="addresss">Địa chỉ nhận hàng</label>
                                    <Textarea required id='address' disableAutosize disableAnimation classNames={{
                                        base: "",
                                        input: "resize-y min-h-[40px]",
                                    }} placeholder='Địa chỉ chi tiết' variant='bordered' />
                                </div>

                                {/* Shipping method */}
                                <div className="">
                                    <label htmlFor='ship' className="block">Phương thức vận chuyển</label>
                                    <Select onChange={(e) => setShipMethod(e.target.value)} id='ship' size='lg' className="w-full mb-4" isRequired placeholder='Phương thức vận chuyển' variant='bordered'>
                                        {
                                            DUMP_SHIPPING_METHOD.map((item, index) => (
                                                <SelectItem key={index} value={item.id}>{item.name}</SelectItem>
                                            ))
                                        }

                                    </Select>
                                </div>

                                {/* Payment method */}
                                <div className="mb-4 ww-full">
                                    <label htmlFor='pay' className="block font-bold text-lg">Hình thức thanh toán</label>
                                    <RadioGroup onChange={(e) => setPayMethod(e.target.value)} id='pay' orientation="horizontal" className='w-full' defaultValue="pay-cash">
                                        <CustomRadio value="pay-momo">
                                            <div className='flex items-center gap-5 h-14'>
                                                <div>
                                                    <img src="/images/momo.png" alt="Momo payment" className='w-10 h-10' />
                                                </div>
                                                <span>Ví điện tử Momo</span>
                                            </div>
                                        </CustomRadio>
                                        <CustomRadio value="pay-cash">
                                            <div className='flex items-center gap-5 h-14'>
                                                <div>
                                                    <MonetizationOnIcon />
                                                </div>
                                                <span>Thanh toán khi nhận hàng</span>
                                            </div>
                                        </CustomRadio>
                                        <CustomRadio value="pay-vnpay">
                                            <div className='flex items-center gap-5 h-14'>
                                                <div>
                                                    <img src="/images/VNPAY.png" alt="VNPay payment" className='w-10 h-10' />
                                                </div>
                                                <span>VN PAY</span>
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
                                        <li key={index} className="flex justify-between items-center border-b pb-4 mb-4 gap-2">
                                            <div className="flex items-start h-full">
                                                <img src={item.images[0]} alt={item.name} className="w-24 h-24 mr-4 rounded" />
                                                <div className='flex flex-col justify-center h-[96px] w-full'>
                                                    <p className="font-semibold">{item.name}</p>
                                                    <p className="text-sm text-gray-600"> x{item.quantity}</p>
                                                </div>
                                            </div>
                                            <div className="text-right w-24">
                                                <span className="text-red-500 font-bold">{item.salePrice.toLocaleString()} đ</span><br />
                                                <span className="text-xs text-gray-500 "><span className='line-through w-max'>{item.price.toLocaleString()}</span> đ</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                <div className="py-4">
                                    <div className="flex justify-between mb-2">
                                        <span>Tổng tiền</span>
                                        {/* Check if component has mounted to render the correct value */}
                                        <span>{isMounted ? totalSum.toLocaleString() : 0}</span>
                                    </div>

                                    <div className="flex justify-between mb-2">
                                        <span>Phí vận chuyển</span>
                                        <span>{isMounted ? (ship === 0 ? 'Miễn phí' : ship.toLocaleString()) : '...'}</span>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                        <span>Số điểm tích lũy</span>
                                        <span>{isMounted ? pointMM : 0}</span>
                                    </div>
                                    <div className='mb-2 flex justify-between items-center'>
                                        {user ? (
                                            <>
                                                <div className='flex items-center'>
                                                    Dùng <span className='mx-1 font-semibold'>{user.point}</span> điểm
                                                </div>
                                                <div>
                                                    <Switch
                                                        size='sm'
                                                        checked={usePoints}
                                                        onChange={(e) => setUsePoints(e.target.checked)}
                                                        aria-label="Use points to reduce order total"
                                                        className='mr-0'
                                                    />
                                                </div>
                                            </>
                                        ) : (
                                            <div>
                                                Vui lòng <Link href={'#'} className='underline'>Đăng nhập</Link> để sử dụng điểm.
                                            </div>
                                        )}

                                    </div>
                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Tổng thanh toán</span>
                                        <span className='text-2xl text-price'>{isMounted ? sum.toLocaleString() : 0}</span>
                                    </div>
                                </div>
                                <Button type='submit' className="w-full mt-4 bg-main font-semibold text-white">Đặt hàng</Button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default BodyCheckout;
