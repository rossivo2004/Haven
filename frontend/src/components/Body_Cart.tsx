import React from 'react';
import { Button } from "@/components/ui/button"
const Body_Cart = () => {
    return (
        <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-4xl font-bold mb-6 text-center">Giỏ Hàng</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* bên trái*/}
                <div className="lg:col-span-2">
                    <div className="bg-gray-100 p-4 rounded shadow-sm mb-4">
                        <h2 className="text-lg font-semibold mb-2">Thông Tin Nhận Hàng</h2>
                        <p className="font-medium">Nguyễn Hữu Tiến | 0901 22 33 44</p>
                        <p>388 J, P. An Khánh, Q. Ninh Kiều, TP. Cần Thơ</p>
                    </div>

                    <div className="bg-white p-4 rounded shadow-sm mb-4">
                        <div className="flex justify-between items-center border-b pb-4 mb-4">
                            <div className="flex items-start">
                                <img src="https://meatdeli.com.vn/upload/medialibrary/c40/c40dd79625dc3345e1807b58ad0ca5a6.png" alt="Product Image" className="w-24 h-24 mr-4 rounded" />
                                <div>
                                    <p className="font-semibold">Ba Chỉ Bò Nhập Khẩu Đông Lạnh Trust Farm (Khay 300g)</p>
                                    <p className="text-sm text-gray-600">Mô tả sản phẩm 1, Mô tả sản phẩm 2, Mô tả sản phẩm 3, Mô tả sản phẩm 4.</p>
                                    <div className="flex items-center mt-2">
                                        <button className="px-3 py-1 border rounded">-</button>
                                        <span className="px-4">01</span>
                                        <button className="px-3 py-1 border rounded">+</button>
                                    </div>
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
                                    <div className="flex items-center mt-2">
                                        <button className="px-3 py-1 border rounded">-</button>
                                        <span className="px-4">01</span>
                                        <button className="px-3 py-1 border rounded">+</button>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-red-500 font-bold">499.000 đ</span><br />
                                <span className="text-sm text-gray-500 line-through">49.000 đ đã giảm giá</span>
                            </div>
                        </div>
                    </div>

                    <div className="text-right font-semibold">
                        Tổng Khối Lượng Giỏ Hàng: <span className="text-black">0.5Kg</span>
                    </div>
                </div>

                {/* bên phải */}
                <div className="bg-white p-6 rounded shadow-sm">
                    <h2 className="text-2xl font-semibold mb-4">Thanh Toán</h2>

                    <div className="mb-4">
                        <label className="block text-lg font-medium">Phương thức vận chuyển</label>
                        <select className="w-full p-2">
                            <option>GrabFood</option>
                            <option>BeeFood</option>
                            <option>ShoppeFood</option>
                        </select>
                        <hr className="border-t-1 border-black mt-2" />
                    </div>

                    <div className="mb-4">
                        <label className="block text-lg font-medium">Hình thức thanh toán</label>
                        <select className="w-full p-2">
                            <option>COD (Thanh toán khi nhận hàng)</option>
                            <option>COD (Thanh Toán MoMo)</option>
                            <option>Lựa chọn khác</option>
                        </select>
                        <hr className="border-t-1 border-black mt-2" />
                    </div>

                    <div className="mb-4">
                        <div>
                            <label className="inline-flex items-center">
                                <input type="radio" name="delivery" className="form-radio" />
                                <span className="block text-lg font-medium ml-2 ">Nhận tại cửa hàng</span>
                            </label>
                            <hr className="border-t-1 border-black mt-2 mb-2" />
                        </div>
                        <div>
                            <label className="inline-flex items-center">
                                <input type="radio" name="delivery" className="form-radio" />
                                <span className="block text-lg font-medium ml-2">Xuất hóa đơn công ty</span>
                            </label>
                            <hr className="border-t-1 border-black mt-2" />
                        </div>
                    </div>

                    <div className="mb-4">
                        <div className="flex items-center justify-between">
                            <label className="block text-lg font-medium mr-4">Mã giảm giá</label>
                            <input
                                type="text"
                                className="flex-grow p-1 border border-gray-300 rounded placeholder-gray-500 focus:outline-none focus:border-black" placeholder="Chọn hoặc nhận mã"/>
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

                    <Button className="w-full bg-yellow-500 text-white p-3 rounded mt-4 font-bold">
                        Xác nhận đơn hàng
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Body_Cart;
