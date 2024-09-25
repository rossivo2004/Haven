
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';

function BodyTrackingorder() {
    return (
        <div className="flex lg:flex-row flex-col-reverse lg:mt-10 gap-5">
            <div className="lg:w-2/3 w-full ">
            <div className="flex lg:flex-row flex-col lg:items-center justify-between p-4 bg-gray-50 rounded-md shadow-sm mb-6">
  <div className="flex items-center space-x-4">
    <div>
      <h3 className="font-medium lg:text-2xl text-lg">Thông Tin Nhận Hàng</h3>
      <p className="text-sm text-gray-600">
        Nguyễn Hữu Tiến <span className="mx-2">|</span> 0901 22 33 44
      </p>
    </div>
  </div>
  <div className="flex items-center space-x-4 text-right">
    <p className="text-sm text-gray-600">
      388 J, P. An Khánh, Q. Ninh Kiều, TP. Cần Thơ
    </p>
  </div>
</div>


                <div className="p-6 border bg-gray-50 mb-6">
                    <h2 className="lg:text-2xl text-lg font-medium mb-6">Hóa Đơn Điện Tử</h2>
                    <div className="grid grid-cols-3 gap-y-4">
                        <div className="font-semibold text-gray-700">Tên công ty:</div>
                        <div className="col-span-2 text-right">Công ty trách nhiệm hữu hạn Hữu Tiến</div>
                        <div className="font-semibold text-gray-700">Mã số thuế:</div>
                        <div className="col-span-2 text-right">001122445533</div>
                        <div className="font-semibold text-gray-700">Email:</div>
                        <div className="col-span-2 text-right">Huutienofficials@gmail.com</div>
                        <div className="font-semibold text-gray-700">Tỉnh/Thành:</div>
                        <div className="col-span-2 text-right">Cần Thơ</div>
                        <div className="font-semibold text-gray-700">Quận/Huyện:</div>
                        <div className="col-span-2 text-right">Ninh Kiều</div>
                        <div className="font-semibold text-gray-700">Phường/Xã:</div>
                        <div className="col-span-2 text-right">Xuân Khánh</div>
                        <div className="font-semibold text-gray-700">Số nhà, đường:</div>
                        <div className="col-span-2 text-right">310 đường 30/4</div>
                    </div>
                </div>

                <div>
                    <div className="p-4 space-y-6">
                        {/* Product 1 */}
                        <div className="flex justify-between items-start">
                            {/* Product Image and Details */}
                            <div className="flex items-start gap-2">
                                <img src="/path-to-image-1.jpg" alt="Product 1" className="w-24 h-24 object-contain mr-4" />
                                <div>
                                    <div className="lg:text-xl text-base font-medium">Ba Chỉ Bò Nhập Khẩu Đông Lạnh Trust Farm (Khay 300g)</div>
                                    <div className="text-gray-600 text-sm">
                                        Mô tả sản phẩm 1, Mô tả sản phẩm 2, Mô tả sản phẩm 3, Mô tả sản phẩm 4.
                                    </div>
                                    <div className="text-gray-600 text-sm mt-2">Số lượng: 01</div>
                                </div>
                            </div>
                            {/* Product Price */}
                            <div className="text-right">
                                <div className="lg:text-xl text-base font-semibold">499.000 đ</div>
                                <div className="text-red-500 text-sm">-49.000 đ</div>
                                <div className="text-gray-500 text-sm">đã giảm giá</div>
                            </div>
                        </div>
                        {/* Product 2 */}
                        <div className="flex lg:flex-row flex-col justify-between lg:items-start items-end">
                            {/* Product Image and Details */}
                            <div className="flex lg:items-start">
                                <img src="/path-to-image-2.jpg" alt="Product 2" className="w-24 h-24 object-contain mr-4" />
                                <div>
                                    <div className="lg:text-xl text-base font-semibold">S2 XÚC XÍCH DINH DƯỠNG - IQ NGON (MỚI) - 210G</div>
                                    <div className="text-gray-600 text-sm">
                                        Mô tả sản phẩm 1, Mô tả sản phẩm 2, Mô tả sản phẩm 3, Mô tả sản phẩm 4.
                                    </div>
                                    <div className="text-gray-600 text-sm mt-2">Số lượng: 01</div>
                                </div>
                            </div>
                            {/* Product Price */}
                            <div className="lg:text-right text-left">
                            <div className="lg:text-xl text-base font-semibold">499.000 đ</div>
                                <div className="text-red-500 text-sm">-49.000 đ</div>
                                <div className="text-gray-500 text-sm">đã giảm giá</div>
                            </div>
                        </div>
                    </div>


                    <div>Tổng Khối Lượng Giỏ Hàng: <span className="font-bold">0.5Kg</span></div>
                </div>
            </div>

            <div className="flex-1">
                <div className="p-6 border bg-white rounded-lg">
                    {/* Title */}
                    <h2 className="text-center text-lg font-semibold mb-6">SHIPPING INFORMATION</h2>
                    {/* Order Status */}
                    <div className="mb-6">
                        <div className="text-sm font-medium mb-2">Tình trạng đơn hàng</div>
                        <ul className="steps steps-vertical lg:steps-horizontal">
                            <li className="step step-primary">Đơn hàng đã đặt</li>
                            <li className="step step-primary">Đã duyệt</li>
                            <li className="step">Đang giao hàng</li>
                            <li className="step">Giao hàng thành công</li>
                        </ul>
                        <hr className="border-gray-300" />
                    </div>
                    {/* Shipping Method */}
                    <div className="mb-6">
                        <div className="text-sm font-medium mb-2">Phương thức vận chuyển</div>
                        <div className="text-gray-600">GrabFood</div>
                        <hr className="border-gray-300 mt-2" />
                    </div>
                    {/* Payment Method */}
                    <div className="mb-6">
                        <div className="text-sm font-medium mb-2">Hình thức thanh toán</div>
                        <div className="text-gray-600">COD (Thanh toán khi nhận hàng)</div>
                        <hr className="border-gray-300 mt-2" />
                    </div>
                    {/* Estimated Delivery Time */}
                    <div className="mb-6">
                        <div className="text-sm font-medium mb-2">Thời gian giao hàng dự kiến</div>
                        <div className="text-gray-600">5 ngày làm việc</div>
                        <hr className="border-gray-300 mt-2" />
                    </div>
                    {/* Order Summary */}
                    <div className="space-y-2 mb-6">
                        <div className="flex justify-between text-gray-600">
                            <span>Tổng tiền</span>
                            <span>00,000,000</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Khuyến mãi</span>
                            <span>00,000,000</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Phí vận chuyển</span>
                            <span>00,000,000</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Số điểm tích lũy</span>
                            <span>50</span>
                        </div>
                        <div className="flex justify-between font-semibold">
                            <span>Tổng thanh toán</span>
                            <span>00,000,000</span>
                        </div>
                    </div>
                    {/* Confirmation Button */}
                    {/* <div className="text-center">
                        <button className="w-full bg-yellow-500 text-white font-semibold py-3 rounded-md">
                            Đã nhận được hàng
                        </button>
                    </div> */}
                </div>


            </div>
        </div>
    );
}

export default BodyTrackingorder;