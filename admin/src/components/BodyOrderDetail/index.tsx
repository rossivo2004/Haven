'use client'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import BreadcrumbNav from "../Breadcrumb/Breadcrumb";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Order } from "@/interface";
import axios from "axios";
import apiConfig from "@/configs/api";

function renderStatus(status: string) {
    switch (status) {
        case 'pending':
            return <div className='text-yellow-700 flex items-center justify-center rounded-lg'>Đang chờ</div>; // Pending
        case 'preparing':
            return <div className='text-blue-700 flex items-center justify-center rounded-lg '>Đang chuẩn bị</div>; // Preparing
        case 'transport':
            return <div className='text-purple-700 flex items-center justify-center rounded-lg'>Đang vận chuyển</div>; // Transport
        case 'complete':
            return <div className='text-green-700 flex items-center justify-center rounded-lg '>Hoàn thành</div>; // Complete
        case 'canceled':
            return <div className='text-red-700 flex items-center justify-center rounded-lg'>Hủy</div>; // Canceled
        default:
            return 'Không xác định'; // Default text
    }
}

function BodyOrderDetail() {
    const { id } = useParams(); // get id product
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchOrderDetail = async () => { // Wrapped in an async function
            setLoading(true);
            try {
                const response = await axios.get(`${apiConfig.order.showOrderDetailCode}${id}`);
                setOrder(response.data.order); // Set single order object
            } catch (error) {
                console.log("Lỗi");
                setOrder(null);
            } finally {
                setLoading(false);
            }
        };
        fetchOrderDetail(); // Call the async function
    }, [id]);

    console.log(order);
    

    return (
        <div>
            <div className="flex justify-between items-center">
                <div className="py-5 h-[62px]">
                    <BreadcrumbNav
                        items={[
                            { name: 'Trang chủ', link: '/' },
                            { name: 'Đơn hàng', link: '/admin/orders' },
                            { name: `#${order?.invoice_code}`, link: '#' }
                        ]}
                    />
                </div>
            </div>

            <div className="mb-6 text-2xl font-medium">
                Chi tiết hóa đơn
            </div>

            {order === null ? (
                 <div className="pb-5 flex items-center justify-center w-full h-[400px]">
                Đơn hàng không tồn tại
             </div>
         ) : (
            <div className="pb-5">
                <div className="flex gap-5 mb-4">
                    <div className="flex-1 shd-1 rounded-lg p-4">
                        <div className="mb-4 text-lg font-medium">Thông tin khách hàng</div>
                        <div>
                            <div>Khách hàng: <span className="font-semibold">{order.full_name}</span></div>
                            <div>Địa chỉ: <span className="font-semibold">{order.address}, {order.ward}, {order.district}, {order.province}</span></div>
                        </div>
                    </div>
                    <div className="flex-1 shd-1 rounded-lg p-4">
                        <div className="mb-4 text-lg font-medium">Thông tin liên hệ</div>
                        <div>
                            <div>Số điện thoại: <span className="font-semibold">{order.phone}</span></div>
                            <div>Email: <span className="font-semibold">{order.email}</span></div>
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border-2 border-gray-200">
                    <div className="border-b-2 p-4 flex justify-between">
                        <div className="font-medium">Đơn hàng <span className="text-blue-500">#{order?.invoice_code}</span></div>
                        <div className="flex gap-5 font-medium">
                            <div>Ngày đặt <span className="text-blue-500">{new Date(order.created_at).toLocaleDateString('en-GB')}</span></div>
                            <div>{renderStatus(order.status)}</div>
                            <div>{order.payment_status === 'unpaid' ? <div className="text-red-600">Chưa thanh toán</div> : <div className="text-green-600">Đã thanh toán</div>}</div>
                        </div>
                    </div>
                    <div className="p-4">
                        <Table aria-label="Example static collection table">
                            <TableHeader>
                                <TableColumn>Tên sản phẩm</TableColumn>
                                <TableColumn>Đơn giá</TableColumn>
                                <TableColumn>Số lượng</TableColumn>
                                <TableColumn>Thành tiền</TableColumn>
                            </TableHeader>
                            <TableBody>
                                {order.order_details.map((detail) => (
                                    <TableRow key={detail.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="h-10 w-10 rounded-lg overflow-hidden">
                                                    <img src={detail.product_variant.image} alt="" className="w-full h-full object-cover"/>
                                                </div>
                                                <div>{detail.product_variant.name} VND</div>
                                            </div>
                                        </TableCell>
                                        <TableCell><div>{detail.price.toLocaleString()} VND</div></TableCell>
                                        <TableCell>{detail.quantity}</TableCell>
                                        <TableCell>{(detail.price * detail.quantity).toLocaleString()} VND</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="text-end px-4 pb-4 text-lg">
                        Tổng tiền: <span className=" font-medium">
                            {order.order_details.reduce((total, detail) => total + (detail.price * detail.quantity), 0).toLocaleString()}
                        </span>
                    </div>
                    <div className="text-end px-4 pb-4 text-lg">
                        Phí vận chuyển: <span className=" font-medium">
                            {Number(order.total) - order.order_details.reduce((total, detail) => total + (detail.price * detail.quantity), 0) === 0 
                                ? 'Miễn phí vận chuyển' 
                                : (Number(order.total) - order.order_details.reduce((total, detail) => total + (detail.price * detail.quantity), 0)).toLocaleString() + ' VND'}
                        </span>
                    </div>
                            <div className="text-end px-4 pb-4 text-xl">Tổng thanh toán: <span className=" font-medium text-red-500 text-[22px]">{order.total.toLocaleString()} VND</span></div>
                </div>
            </div>
             )}
        </div>
    );
}

export default BodyOrderDetail;