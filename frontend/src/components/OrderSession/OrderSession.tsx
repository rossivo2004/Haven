'use client'

import apiConfig from "@/src/config/api";
import axios from "axios";
import Cookies from "js-cookie";
import { use, useEffect, useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { Order } from "@/src/interface";
import InfoIcon from '@mui/icons-material/Info';
import CancelIcon from '@mui/icons-material/Cancel';
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { fetchUserProfile } from "@/src/config/token";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from "next/link";
export const OrderSession: React.FC = () => {
    const [userId, setUserId] = useState<string | null>(null);
    const [order, setOrder] = useState<Order[]>([]);

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

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return { color: 'orange' }; // Color for pending
            case 'preparing':
                return { color: 'blue' }; // Color for preparing
            case 'transport':
                return { color: 'purple' }; // Color for transport
            case 'complete':
                return { color: 'green' }; // Color for complete
            default:
                return { color: 'black' }; // Default color
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'pending':
                return <div className='bg-yellow-100 font-semibold text-yellow-700 w-32 py-1 flex items-center justify-center rounded-lg border border-yellow-700'>Đang chờ</div>; // Pending
            case 'preparing':
                return <div className='bg-blue-100 font-semibold text-blue-700 w-32 py-1 flex items-center justify-center rounded-lg border border-blue-700'>Đang chuẩn bị</div>; // Preparing
            case 'transport':
                return <div className='bg-purple-100 font-semibold text-purple-700 w-32 py-1 flex items-center justify-center rounded-lg border border-purple-700'>Đang vận chuyển</div>; // Transport
            case 'complete':
                return <div className='bg-green-100 font-semibold text-green-700 w-32 py-1 flex items-center justify-center rounded-lg border border-green-700'>Hoàn thành</div>; // Complete
            case 'canceled':
                return <div className='bg-red-100 font-semibold text-red-700 w-32 py-1 flex items-center justify-center rounded-lg border border-red-700'>Hủy</div>; // Complete
            default:
                return 'Không xác định'; // Default text
        }
    };

    const fetchOrder = async () => {

        const response = await axios.get(`${apiConfig.order.showOrderUser}${userId}`);

        setOrder(response.data); // Update order state with fetched data

    };
    useEffect(() => {

        // Fetch order data for the user


        fetchOrder(); // Call the fetch function

    }, [userId])

    const cancelOrder = (idOrrder: number) => {
        confirmAlert({
            title: "Hủy đơn hàng",
            message: "Bạn có chắc muốn hủy đơn hàng?",
            buttons: [
                {
                    label: "Yes",
                    onClick: async () => { // Thay đổi thành async để sử dụng await
                        try {
                            const response = await axios.post(`${apiConfig.order.cancelOrder}${idOrrder}`); // Thêm await để chờ phản hồi
                            if (response.status === 400) { // Kiểm tra nếu phản hồi trả về 400
                                toast.error("Lỗi: Không thể hủy đơn hàng"); // Thông báo lỗi
                                return; // Dừng thực hiện nếu có lỗi
                            }
                            toast.success("Hủy đơn thành công"); // Sửa thông báo thành công
                            fetchOrder()
                        } catch (error) {
                            toast.error("Lỗi khi hủy đơn hàng"); // Cập nhật thông báo lỗi
                        }
                    },
                },
                {
                    label: "No",
                },
            ],
        });
    };

    // console.log(order);


    return ( // Use return statement to render JSX
        <div>
             <div className="flex flex-row items-center w-full relative">
                        <div className="absolute top-0 left-0 flex sm:hidden">
                            <Link href={'/profile'}>
                                <ArrowBackIcon />
                            </Link>
                        </div>
                        <div className="flex flex-1 justify-center sm:justify-start text-lg sm:text-4xl font-medium pb-[1vw] capitalize">
                            Quản lí đơn hàng
                        </div>
                    </div>
            {order.length === 0 ? ( // Check if there are no orders
                <div className="text-center py-4 pt-28">Chưa có đơn hàng</div> // Message for no orders
            ) : (
                <Table removeWrapper aria-label="Example static collection table">
                    <TableHeader>
                        <TableColumn>Mã đơn hàng</TableColumn>
                        <TableColumn>Ngày đặt</TableColumn>
                        <TableColumn><div className='flex justify-center w-full'>Trạng thái</div></TableColumn>
                        <TableColumn> </TableColumn>
                    </TableHeader>
                    <TableBody>
                        {order.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell><div className='dark:text-white'>{item.invoice_code}</div></TableCell>
                                <TableCell><div className='dark:text-white'>{new Date(item.updated_at).toLocaleDateString('en-GB')}</div></TableCell>
                                <TableCell><div className='flex justify-center w-full'><div className=''>{getStatusText(item.status)}</div></div></TableCell>
                                <TableCell><div className="flex gap-2 justify-end">
                                    {/* Conditionally render the CancelIcon based on order status */}
                                    {item.status !== 'canceled' && item.status !== 'complete' && item.status !== 'transport' && (
                                        <div className="cursor-pointer text-red-600">
                                            <CancelIcon onClick={() => cancelOrder(Number(item.id))}/>
                                        </div>
                                    )}
                                    <a href={`/trackingorder/${item.invoice_code}`} target="_blank" rel="noopener noreferrer"><InfoIcon /></a>
                                </div></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    );
}