'use client'
import BreadcrumbNav from '../Breadcrum';
import { Input } from '@nextui-org/input';
import { Textarea } from "@nextui-org/input";
import { RadioGroup, Radio, cn } from "@nextui-org/react";

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
                        <div className="lg:col-span-2">
                            <h2 className="text-2xl font-semibold mb-4">Thanh Toán</h2>
                            <div>
                                <form action="" className='flex flex-col gap-5'>
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
                                    <div>
                                        <label htmlFor="">Địa chỉ nhận hàng</label>
                                        <Textarea disableAutosize disableAnimation classNames={{
                                            base: "",
                                            input: "resize-y min-h-[40px]",
                                        }} placeholder='Địa chỉ chi tiết' variant='bordered' />
                                    </div>
                                    <div className="mb-10">
                                        <label className="block text-lg font-medium">Phương thức vận chuyển</label>
                                        <select className="w-full p-2">
                                            <option>GrabFood</option>
                                            <option>BeeFood</option>
                                            <option>ShoppeFood</option>
                                        </select>
                                        <hr className="border-t-1 border-black mt-2" />
                                    </div>

                                    <div className="mb-4 ww-full">
                                        <label className="block text-lg font-medium">Hình thức thanh toán</label>
                                        <RadioGroup orientation="horizontal" className='w-full' defaultValue="pay-cash">
                                            <CustomRadio value="pay-momo">
                                                <div className='flex items-center gap-5'>
                                                    <div>
                                                        <img src="/images/momo.png" alt="" className='w-10 h-10' />
                                                    </div>
                                                    <div>Momo</div>
                                                </div>
                                            </CustomRadio>
                                            <CustomRadio value="pay-cash">
                                                <div className='flex items-center gap-5'>
                                                    <div>
                                                        <img src="/images/cash.png" alt="" className='w-10 h-10 object-cover' />
                                                    </div>
                                                    <div>Tiền mặt</div>
                                                </div>
                                            </CustomRadio>
                                        </RadioGroup>
                                    </div>

                                </form>
                            </div>
                        </div>

                        {/* bên phải */}
                        <div className="lg:col-span-2 bg-white lg:p-6 rounded shadow-sm">
                            <div className="bg-white lg:p-4 rounded shadow-sm mb-4">
                                <div className="flex justify-between items-center border-b pb-4 mb-4">
                                    <div className="flex items-start">
                                        <img src="https://meatdeli.com.vn/upload/medialibrary/c40/c40dd79625dc3345e1807b58ad0ca5a6.png" alt="Product Image" className="w-24 h-24 mr-4 rounded" />
                                        <div>
                                            <p className="font-semibold">Ba Chỉ Bò Nhập Khẩu Đông Lạnh Trust Farm (Khay 300g)</p>
                                            <p className="text-sm text-gray-600">Mô tả sản phẩm 1, Mô tả sản phẩm 2, Mô tả sản phẩm 3, Mô tả sản phẩm 4.</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-red-500 font-bold">499.000 đ</span><br />
                                        <span className="text-sm text-gray-500 line-through">49.000 đ đã giảm giá</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center">
                                    <div className="flex items-start">
                                        <img src="https://product.hstatic.net/200000734847/product/3.21_63g_63daae7b23d6423592031a24e107d4c5_grande.png" alt="Product Image" className="w-24 h-24 mr-4 rounded" />
                                        <div>
                                            <p className="font-semibold">S2 XÚC XÍCH DINH DƯỠNG - IQ NGON (MỚI) - 210G</p>
                                            <p className="text-sm text-gray-600">Mô tả sản phẩm 1, Mô tả sản phẩm 2, Mô tả sản phẩm 3, Mô tả sản phẩm 4.</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-red-500 font-bold">499.000 đ</span><br />
                                        <span className="text-sm text-gray-500 line-through">49.000 đ đã giảm giá</span>
                                    </div>
                                </div>
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