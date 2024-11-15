'use client';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BreadcrumbNav from '../Breadcrum';
import { Input, Textarea } from '@nextui-org/input';
import { RadioGroup, Radio, cn, Snippet, Spinner } from "@nextui-org/react";
import { Button, Select, SelectItem } from "@nextui-org/react";
import axios from 'axios';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
// import LocationSelector from '../SelectProvince';
import { DUMP_SHIPPING_METHOD } from '@/src/dump';
import { CartItem, User, Variant } from '@/src/interface';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
// import { selectTotalItems, removeItem, updateQuantity, setSelectedItems, setPoints, toggleSelectItem } from '@/src/store/cartSlice';
import { Switch } from "@nextui-org/react"
import Link from 'next/link';
import { IUser } from '@/src/interface';
import Cookies from 'js-cookie';
import apiConfig from '@/src/config/api';
import { fetchUserProfile } from '@/src/config/token';

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
    const [userId, setUserId] = useState<string | null>(null);
    const cartData = Cookies.get('checkout_data'); // Get user ID from cookies
    const [loading, setLoading] = useState<boolean>(false);


    const dispatch = useDispatch();
    const [isMounted, setIsMounted] = useState(false);
    const [usePoints, setUsePoints] = useState(false);

    const [product, setProduct] = useState<Variant[]>([]);

    const [provinces, setProvinces] = useState<Province[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);
    const [shipMethod, setShipMethod] = useState<string>('');
    const [payMethod, setPayMethod] = useState<string>("1");

    const [selectedProvince, setSelectedProvince] = useState<string>('');
    const [selectedDistrict, setSelectedDistrict] = useState<string>('');
    const [selectedWard, setSelectedWard] = useState<string>('');
    const [pointMM, setPointMM] = useState<number>(0);
    const [ship, setShip] = useState<number>(0);
    const [sum, setSum] = useState<number>(0);
    const [vat, setVat] = useState<number>(0);
    const [discount, setDiscount] = useState<number>(0);
    const [user, setUser] = useState<User | null>(null);



    const [checkoutItems, setCheckoutItems] = useState<any[]>([]); // State to hold checkout items
    const [totalAmount, setTotalAmount] = useState<number>(0);
    const [pointCart, setPointCart] = useState<number>(0);
    const [checkoutItemsId, setCheckoutItemsId] = useState<any[]>([]); // State to hold checkout items


    // const priceDisscount = useSelector((state: { cart: { priceDisscount: number } }) => state.cart.priceDisscount);
    // const totalSum = useSelector((state: { cart: { sum: number } }) => state.cart.sum);

    useEffect(() => {
        const getUserId = async () => {
            try {
                const userProfile = await fetchUserProfile(); // Fetch user profile using token
                setUserId(userProfile.id); // Set user ID from the fetched profile
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };

        getUserId(); // Call the function to get user ID
    }, []);

    console.log(userId);

    useEffect(() => {
        if (cartData) {
            const parsedData = JSON.parse(cartData); // Parse the checkout data
            setCheckoutItems(parsedData.selectedItems); // Set checkout items
            setTotalAmount(parsedData.totalAmount); // Set total amount
            setPointCart(parsedData.pointCart); // Set point cart
            const productVariants = parsedData.selectedItems.map((item: { id: number; quantity: number }) => ({
                id: item.id,
                quantity: item.quantity
            })); // Create an array of objects with id and quantity
    
            setCheckoutItemsId(productVariants); // Set checkout items ID
    
            // console.log('Product Variants:', productVariants); 
            // console.log(parsedData); 
            
        }
    }, [cartData]);

    // console.log(totalAmount);
    console.log(checkoutItemsId);
    


    useEffect(() => {

    }, [cartData])


    useEffect(() => {
        setIsMounted(true);
    }, []);


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
        if (selectedProvince === '79') {
            setShip(0);
        } else if (selectedProvince === '') {
            setShip(0);
        } else {
            setShip(30000)
        }

    }, [selectedProvince]);





    const fetchUser = async () => {
        if (!userId) return; // Skip fetching if userId is null

        try {
            const response = await axios.get(`${apiConfig.user.getUserById}${userId}`, { withCredentials: true });
            if (response.data) {
                setUser(response.data);

                setSelectedProvince(response.data.province);
                setSelectedDistrict(response.data.district);
                setSelectedWard(response.data.ward);
            } else {
                console.warn('No cart items found in response');
            }
        } catch (error) {
            console.error('Error fetching user cart:', error);
        }
    };
    useEffect(() => {
        fetchUser();
    }, [userId]);


    const [userName, setUserName] = useState<string | undefined>(user?.name);
    const [userPhone, setUserPhone] = useState<string | undefined>(user?.phone);
    const [userEmail, setUserEmail] = useState<string | undefined>(user?.email);
    const [userAddress, setUserAddress] = useState<string | undefined>(user?.address);

    useEffect(() => {
        if (user) {
            setUserName(user.name);
            setUserPhone(user.phone);
            setUserEmail(user.email);
            setUserAddress(user.address);
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevent default form submission behavior

        // Find the name for province, district, and ward
        const provinceName = provinces.find(province => province.id === selectedProvince)?.full_name || '';
        const districtName = districts.find(district => district.id === selectedDistrict)?.full_name || '';
        const wardName = wards.find(ward => ward.id === selectedWard)?.full_name || '';

        // Get selected shipping and payment methods
        const shippingMethod = (document.getElementById('ship') as HTMLSelectElement).value;
        const payment_method = (document.querySelector('input[name="pay"]:checked') as HTMLInputElement)?.value;

        // Calculate the total amount
        const totalAmount = sum;

        const formData = {
            user_id: userId, // User ID from cookies
            product_variant_id: checkoutItemsId, // Assuming this is an array of IDs
            invoice_code: `HAVEN-${Date.now()}`, // Generate a unique invoice code
            full_name: userName, // Use state instead of directly from user
            phone: userPhone, // Use state instead of directly from user
            email: userEmail, // Use state instead of directly from user
            total: totalAmount, // Total amount
            province: provinceName,
            district: districtName,
            ward: wardName,
            address: userAddress, // Use state instead of directly from user
            payment_transpot: shipMethod,
            payment_method: payMethod,
        };

        console.log('Order Data:', formData); // Log the order data

        try {
            setLoading(true);
            // Gọi API để tạo đơn hàng
            const orderResponse = await axios.post(apiConfig.order.createOrder, formData);
            const orderId = orderResponse.data.order.id; // Giả sử API trả về id của đơn hàng
            console.log(orderResponse);

            Cookies.remove('checkout_data');
            Cookies.remove('cart_items');
            if (userId) { 
                const point = await axios.post(apiConfig.order.deductPoints, { user_id: userId, used_points: discount }); // Pass user ID and points
            }

            // Kiểm tra phương thức thanh toán
            if (formData.payment_method == '2') { // Nếu payment_method = 2
                const pay = await axios.post(apiConfig.payment.createPayment, { order_id: orderId });
                console.log('Payment initiated for order ID:', orderId);
                console.log('Payment Response:', pay);
                window.location.href = pay.data.data; // Chuyển hướng đến trang thanh toán
            } else {
                // Redirect to thank you page for other payment methods
                window.location.href = '/thankorder';
            }

        } catch (error) {
            console.error('Error creating order or processing payment:', error);
        } finally {
            setLoading(false);
        }
    }

    // ... existing code ...

    useEffect(() => {
        const maxDiscount = totalAmount * 0.5; // Maximum discount is 50% of the total selected price
        const applicableDiscount = usePoints ? Math.min(user?.point ?? 0, maxDiscount) : 0; // Default to 0 if user?.point is undefined
        setDiscount(applicableDiscount);

        // Log values for debugging
        console.log('usePoints:', usePoints);
        console.log('User Points:', user?.point);
        console.log('Max Discount:', maxDiscount);
        console.log('Applicable Discount:', applicableDiscount);
    }, [totalAmount, usePoints, user, user?.point]);

    useEffect(() => {
        const calculateTotalSelectedPrice = () => {
            const total = checkoutItems.reduce((acc, item) => {
                // Kiểm tra giá trị của item.price và item.quantity
                const price = item.price || 0; // Nếu không có giá, mặc định là 0
                const quantity = item.quantity || 0; // Nếu không có số lượng, mặc định là 0
                return acc + price * quantity;
            }, 0);
            setSum(total); // Update the sum
        };

        calculateTotalSelectedPrice();
    }, [checkoutItems]);

    useEffect(() => {
        // Calculate the initial sum when the component mounts
        setSum(totalAmount + ship - discount);
    }, [totalAmount, ship, discount]); // Add dependencies to recalculate when they change
    // ... existing code ...

    console.log(sum);


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
                    <h1 className="text-4xl font-bold mb-6 text-center dark:text-white">Checkout</h1>
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        <div className="lg:col-span-2">
                            <h2 className="text-2xl font-semibold mb-4 dark:text-white">Thanh Toán</h2>

                            <div className='flex flex-col gap-5 dark:text-white'>
                                <div>
                                    <label htmlFor="full-name">Họ và tên người nhận</label>
                                    <Input required id='full-name' size='lg' value={userName} variant='bordered' placeholder='Họ và tên người nhận' onChange={(e) => setUserName(e.target.value)} />
                                </div>
                                <div className='flex gap-5'>
                                    <div className='w-1/2'>
                                        <label htmlFor="phone-user">Số điện thoại</label>
                                        <Input required id='phone-user' size='lg' variant='bordered' placeholder='Số điện thoại' value={userPhone} onChange={(e) => setUserPhone(e.target.value)} />
                                    </div>
                                    <div className='flex-1'>
                                        <label htmlFor="email-user">Email</label>
                                        <Input required id='email-user' size='lg' variant='bordered' placeholder='Email' value={userEmail} onChange={(e) => setUserEmail(e.target.value)} />
                                    </div>
                                </div>

                                <div className='grid lg:grid-cols-3 grid-cols-1 gap-4'>
                                        <div>
                                            <div className=''>
                                                Tỉnh/Thành phố (<span className='text-red-600'>*</span>)
                                            </div>
                                            <select
                                                className="bg-[#F4F4F5] w-full p-3 rounded-xl"
                                                // isRequired
                                                // placeholder='Tỉnh/Thành phố'
                                                aria-label="Tỉnh/Thành phố"
                                                // size='lg'
                                                // variant='bordered'
                                                value={selectedProvince}
                                                onChange={(e) => setSelectedProvince(e.target.value)}
                                            >
                                                {provinces.map((province) => (
                                                    <option key={province.id} value={province.id}>
                                                        {province.full_name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <div className=''>
                                                Quận/Huyện (<span className='text-red-600'>*</span>)
                                            </div>
                                            <select
                                                className="bg-[#F4F4F5] w-full p-3 rounded-xl"
                                                // isRequired
                                                required
                                                // placeholder='Quận/Huyện'
                                                aria-label="Quận/Huyện"
                                                // size='lg'
                                                // variant='bordered'
                                                value={selectedDistrict}
                                                onChange={(e) => setSelectedDistrict(e.target.value)}
                                                // isDisabled={!selectedProvince} // Disable if no province is selected
                                                disabled={!selectedProvince}
                                            >
                                                {districts.map((district) => (
                                                    <option key={district.id} value={district.id}>
                                                        {district.full_name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <div className=''>
                                                Phường/Xã (<span className='text-red-600'>*</span>)
                                            </div>
                                            <select
                                                className="bg-[#F4F4F5] w-full p-3 rounded-xl"
                                                // isRequired
                                                required
                                                // placeholder='Phường/Xã'
                                                aria-label="Phường/Xã"
                                                // size='lg'
                                                // variant='bordered'
                                                value={selectedWard}
                                                onChange={(e) => setSelectedWard(e.target.value)}
                                            // isDisabled={!selectedDistrict} // Disable if no district is selected
                                            // disabled={!selectedDistrict}
                                            >
                                                {wards.map((ward) => (
                                                    <option key={ward.id} value={ward.id}>
                                                        {ward.full_name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>


                                <div>
                                    <label htmlFor="addresss">Địa chỉ nhận hàng</label>
                                    <Textarea value={userAddress} required id='address' disableAutosize disableAnimation classNames={{
                                        base: "",
                                        input: "resize-y min-h-[40px]",
                                    }} placeholder='Địa chỉ chi tiết' variant='bordered' onChange={(e) => setUserAddress(e.target.value)} />
                                </div>

                                {/* Shipping method */}
                                <div className="">
                                    <label htmlFor='ship' className="block">Phương thức vận chuyển</label>
                                    <Select onChange={(e) => setShipMethod(e.target.value)} id='ship' size='lg' className="w-full mb-4" isRequired placeholder='Phương thức vận chuyển' variant='bordered'>
                                        {
                                            DUMP_SHIPPING_METHOD.map((item, index) => (
                                                <SelectItem key={index} value={item.id}>{item.name}</SelectItem> // Ensure value is set correctly
                                            ))
                                        }
                                    </Select>

                                </div>

                                {/* Payment method */}
                                <div className="mb-4 ww-full">
                                    <label htmlFor='pay' className="block font-bold text-lg">Hình thức thanh toán</label>
                                    <RadioGroup 
    onChange={(e) => setPayMethod(e.target.value)} 
    id='pay' 
    orientation="horizontal" 
    className='w-full' 
    defaultValue={payMethod || "1"} // Set default value to payMethod or "1"
>
    <CustomRadio value="1">
        <div className='flex items-center gap-5 h-14'>
            <div>
                <MonetizationOnIcon />
            </div>
            <span>Thanh toán khi nhận hàng</span>
        </div>
    </CustomRadio>
    <CustomRadio value="2">
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
                            <h2 className="text-2xl font-semibold mb-4 dark:text-white">Tóm tắt đơn hàng</h2>
                            {/* Cart items summary */}
                            <div className='shadow-md border rounded-md p-6'>
                                <ul>
                                    {checkoutItems.map((item, index) => (
                                        <li key={index} aria-label={`Item: ${item.name}, Quantity: ${item.quantity}`}>
                                            <div className='flex gap-4 justify-between items-center pb-2'>
                                                <div className='flex gap-4 items-center'>
                                                    <img src={item.image} alt={item.name} className="w-24 h-24" />
                                                    <p className='dark:text-white'>{item.name}</p>
                                                </div>
                                                <p className='dark:text-white'>Số lượng: {item.quantity}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                <div className="py-4 dark:text-white">
                                    <div className="flex justify-between mb-2">
                                        <span>Tổng tiền</span>
                                        {/* Check if component has mounted to render the correct value */}
                                        <span>{totalAmount.toLocaleString()}</span>
                                    </div>

                                    <div className="flex justify-between mb-2">
                                        <span>Phí vận chuyển</span>
                                        <span>{isMounted ? (ship === 0 ? 'Miễn phí' : ship.toLocaleString()) : '...'}</span>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                        <span>Số điểm tích lũy</span>
                                        <span>{pointCart}</span>
                                    </div>
                                    <div className='mb-2 flex justify-between items-center'>
                                        {user ? (
                                            <>
                                                <div className='flex items-center'>
                                                    Dùng <span className='mx-1 font-semibold'>{(user.point).toLocaleString()}</span> điểm
                                                </div>
                                                <div>
                                                    <Switch
                                                        size='sm'
                                                        checked={usePoints}
                                                        onChange={(e) => setUsePoints(e.target.checked)} // Toggle use of points
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
                                        <span className='text-2xl text-price'>{sum.toLocaleString()}</span>
                                    </div>
                                </div>
                                <Button disabled={loading} type='submit' className="w-full mt-4 bg-main font-semibold text-white">{loading ? <Spinner color='default' /> : 'Đặt hàng'}</Button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default BodyCheckout;
