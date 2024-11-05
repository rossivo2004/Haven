'use client'

import apiConfig from "@/src/config/api";
import axios from "axios";
import Cookies from "js-cookie";
import { use, useEffect, useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { Order } from "@/src/interface";
import InfoIcon from '@mui/icons-material/Info';

export const OrderSession: React.FC = () => {
    const userId = Cookies.get('user_id'); // Get user ID from cookies
    const [order, setOrder] = useState<Order[]>([]);

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
                return <div className='bg-yellow-100 w-32 py-1 flex items-center justify-center rounded-lg border border-yellow-700'>Đang chờ</div>; // Pending
            case 'preparing':
                return <div className='bg-blue-100 w-32 py-1 flex items-center justify-center rounded-lg border border-blue-700'>Đang chuẩn bị</div>; // Preparing
            case 'transport':
                return <div className='bg-purple-100 w-32 py-1 flex items-center justify-center rounded-lg border border-purple-700'>Đang vận chuyển</div>; // Transport
            case 'complete':
                return <div className='bg-green-100 w-32 py-1 flex items-center justify-center rounded-lg border border-green-700'>Hoàn thành</div>; // Complete
            case 'canceled':
                return <div className='bg-red-100 w-32 py-1 flex items-center justify-center rounded-lg border border-red-700'>Hủy</div>; // Complete
            default:
                return 'Không xác định'; // Default text
        }
    };

    useEffect(() => {

        // Fetch order data for the user

        const fetchOrder = async () => {

            const response = await axios.get(`${apiConfig.order.showOrderUser}${userId}`);

            setOrder(response.data); // Update order state with fetched data

        };

        fetchOrder(); // Call the fetch function

    }, [userId])

    console.log(order);


    return ( // Use return statement to render JSX
        <div>
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
                            <TableCell>{item.invoice_code}</TableCell>
                            <TableCell>{new Date(item.updated_at).toLocaleDateString('en-GB')}</TableCell>
                            <TableCell><div className='flex justify-center w-full'>{getStatusText(item.status)}</div></TableCell>
                            <TableCell><a href={`/trackingorder/${item.invoice_code}`} target="_blank" rel="noopener noreferrer"><InfoIcon /></a></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}