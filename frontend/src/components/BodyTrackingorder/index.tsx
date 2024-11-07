'use client'
import apiConfig from "@/src/config/api";
import { Order, OrderTracking } from "@/src/interface";
import axios from "axios";
import { useParams } from "next/navigation";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import Loading from "../ui/Loading";
import Link from "next/link";
import Image from "next/image";

function BodyTrackingorder() {
    const { id } = useParams();
    const [order, setOrder] = useState<OrderTracking | null>(null);
    const [orderPayment_transpot, setOrderPayment_transpot] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const fetchOrder = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${apiConfig.order.showOrderDetailCode}${id}`); // Use axios.get
            setOrder(response.data.order);
            setOrderPayment_transpot(response.data.order.payment_transpot)

        } catch (error) {
            console.error("Error fetching order:", error);
        } finally {
            setIsLoading(false);
        }
    }
    useEffect(() => {
        fetchOrder();
    }, [])

    console.log(order);


    return (
            isLoading ? (
            <div className="flex justify-center items-center h-screen">
                <Loading />
            </div>
        ) : order ? (
            <div className="flex lg:flex-row flex-col-reverse lg:mt-10 gap-5">
                <div className="lg:w-3/5 w-full ">
                <div className="flex lg:flex-row flex-col lg:items-center justify-between p-4 bg-gray-50 dark:bg-transparent dark:text-white rounded-md shadow-sm mb-2">
                    <div className="flex items-center space-x-4">
                        <div>
                            <h3 className="font-medium lg:text-2xl text-lg">Thông Tin Nhận Hàng</h3>
                            <p className="text-sm text-gray-600 dark:text-white">
                                {order?.full_name} <span className="mx-2">|</span> {order?.phone}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4 text-right">
                        <p className="text-sm text-gray-600 dark:text-white">
                            {order?.address}, {order?.ward}, {order?.district}, {order?.province}
                        </p>
                    </div>
                </div>


                {/* <div className="p-6 border bg-gray-50 mb-6">
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
                </div> */}

                <div>

                    <div className="py-4 px-4 space-y-6 dark:text-white">
                        {order?.order_details.map((item) => (
                            <div>
                                <div className="mb-2 text-xl ">Bạn đang xem đơn hàng: <span className="font-semibold">{order.invoice_code}</span></div>
                                <div className="flex justify-between items-center" key={item.id}>
                                    {/* Product Image and Details */}
                                    <div className="flex items-center gap-2 justify-center">
                                        <img src={item.product_variant.image} alt="Product 1" className="w-24 h-24 object-cover mr-4" />
                                        <div>
                                            <div className="lg:text-xl text-base font-medium">{item.product_variant.name}</div>
                                            <div className="text-gray-600 text-sm mt-2 dark:text-white">Số lượng: {item?.quantity}</div>
                                        </div>
                                    </div>
                                    {/* Product Price */}
                                    <div className="text-right">
                                        <div className="lg:text-xl text-base font-semibold">{item?.price.toLocaleString()} đ</div>
                                    </div>
                                </div>
                            </div>
                        ))}


                    </div>
                </div>
            </div>

            <div className="flex-1">
                <div className="p-6 border bg-white dark:bg-transparent dark:text-white rounded-lg">
                    {/* Title */}
                    <h2 className="text-center text-lg font-semibold mb-6">SHIPPING INFORMATION</h2>
                    {/* Order Status */}
                    <div className="mb-6">
                        <div className="text-sm font-semibold mb-2">Tình trạng đơn hàng</div>
                        <ul className="steps steps-vertical lg:steps-horizontal">
                            <li className={`step ${order?.status === "pending" || order?.status === "preparing" || order?.status === "transport" || order?.status === "complete" || order?.status === "canceled" ? 'step-primary' : ''}`}>Đơn hàng đang chờ</li>
                            <li className={`step ${order?.status === "preparing" || order?.status === "transport" || order?.status === "complete" || order?.status === "canceled" ? 'step-primary' : ''}`}>Đã duyệt</li>
                            <li className={`step ${order?.status === "transport" || order?.status === "complete" || order?.status === "canceled" ? 'step-primary' : ''}`}>Đang giao hàng</li>
                            <li className={`step ${order?.status === "complete" || order?.status === "canceled" ? 'step-primary' : ''}`}>Giao hàng thành công</li>
                            <li className={`step ${order?.status === "canceled" ? 'step-primary' : ''}`}>Đã hủy</li>
                        </ul>
                        <hr className="border-gray-300" />
                    </div>
                    {/* Shipping Method */}
                    <div className="mb-6">
                        <div className="text-sm font-semibold mb-2">Phương thức vận chuyển</div>
                        <div className="text-gray-600 dark:text-white">
                            {orderPayment_transpot == 1 && "Grab Food"}
                            {orderPayment_transpot == 2 && "Giao hàng nhanh"}
                            {orderPayment_transpot == 3 && "Shopee Express"}
                            {orderPayment_transpot == 4 && "J&T Express"}
                        </div>
                        <hr className="border-gray-300 mt-2" />
                    </div>
                    {/* Payment Method */}
                    <div className="mb-6">
                        <div className="text-sm font-semibold mb-2">Hình thức thanh toán</div>
                        <div className="text-gray-600 dark:text-white">
                            {order?.payment_method === "1" ? "Thanh toán khi nhận hàng (COD)" :
                                order?.payment_method === "2" ? "Thanh toán trực tuyến" :
                                    "Chưa xác định"}
                        </div>
                        <hr className="border-gray-300 mt-2" />
                    </div>
                    {/* Estimated Delivery Time */}
                    <div className="mb-6">
                        <div className="text-sm font-semibold mb-2">Thời gian giao hàng dự kiến</div>
                        <div className="text-gray-600 dark:text-white">5 ngày làm việc</div>
                        <hr className="border-gray-300 mt-2" />
                    </div>
                    {/* Order Summary */}
                    <div className="space-y-2 mb-6">
                        {/* <div className="flex justify-between text-gray-600">
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
                        </div> */}
                        <div className="flex justify-between font-semibold">
                            <span>Tổng thanh toán</span>
                            <span>{(order?.total ?? 0).toLocaleString('vi-VN', { minimumFractionDigits: 0 })} đ</span>
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
    ) : (
        <div className="flex flex-col justify-center items-center h-full pt-[100px] pb-[200px] dark:text-white">
            <Image src='/images/order-not.png' alt="not found" width={300} height={300} />
            <p className="text-lg">Không có dữ liệu đơn hàng.</p>
            <Link href="/tracking" className="underline">Quay lại trang tra cứu</Link>
        </div>
    ));

}

export default BodyTrackingorder;