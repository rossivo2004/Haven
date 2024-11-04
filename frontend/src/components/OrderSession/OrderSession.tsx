'use client'

import apiConfig from "@/src/config/api";
import axios from "axios";
import Cookies from "js-cookie";
import { use, useEffect, useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { Order } from "@/src/interface";

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
                return 'Đang chờ'; // Pending
            case 'preparing':
                return 'Đang chuẩn bị'; // Preparing
            case 'transport':
                return 'Đang vận chuyển'; // Transport
            case 'complete':
                return 'Hoàn thành'; // Complete
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
                    <TableColumn>Trạng thái</TableColumn>
                </TableHeader>
                <TableBody>
                    {order.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell>{item.invoice_code}</TableCell>
                            <TableCell>{new Date(item.updated_at).toLocaleDateString('en-GB')}</TableCell>
                            <TableCell style={getStatusColor(item.status)}>{getStatusText(item.status)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}