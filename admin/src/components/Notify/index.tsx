'use client'

import { useEffect, useState } from "react";

import { Badge, Switch } from "@nextui-org/react";

import NotificationsIcon from '@mui/icons-material/Notifications';
import { Popover, PopoverTrigger, PopoverContent, Button } from "@nextui-org/react";
import CloseIcon from '@mui/icons-material/Close';
import axios from "axios";

import apiConfig from "@/configs/api";

function Notify() {

    const [isInvisible, setIsInvisible] = useState(false);

    const [order, setOrder] = useState([]);

    const [unread, setUnread] = useState(0);


    const fetchOrder = async () => {

        const response = await axios.get(apiConfig.order.getAll, { withCredentials: true });

        setOrder(response.data);
    }

    const fetchUnread = async () => {
        const response = await axios.get(apiConfig.ordernotify.unread, { withCredentials: true });
        setUnread(response.data.notify);
    }

    useEffect(() => {
        fetchUnread();
        fetchOrder();

    }, []);

    const timeAgo = (dateString: string) => {

        const now = new Date();
        const orderDate = new Date(dateString);
        const diffInSeconds = Math.floor((now.getTime() - orderDate.getTime()) / 1000);

        

        if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;

        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;

        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;

        return `${Math.floor(diffInSeconds / 86400)} days ago`;

    };

    const sortedOrders = order.sort((a: any, b: any) => {
        return a.is_read - b.is_read; // Sort by is_read: 0 first, then 1
    });

    const markAsRead = async (orderId: number) => {
        await axios.post(`${apiConfig.ordernotify.markAsRead}${orderId}`, {}, { withCredentials: true });
        fetchUnread();
        fetchOrder();
    };

    return (
        <div>

            <Popover placement="bottom-end" showArrow={true}>

                <PopoverTrigger>
                    <div>

                        <Badge color="danger" content={unread} isInvisible={isInvisible} shape="circle">
                            <NotificationsIcon className="fill-current" />

                        </Badge>

                    </div>

                </PopoverTrigger>
                <PopoverContent>

                    <div className="px-1 py-2">
                        <div className="text-small font-bold mb-2">Thông báo</div>
                        <div className="text-tiny flex flex-col gap-2">

                            {sortedOrders.map((item: any) => (
                                <div key={item.id} className={`flex p-2 rounded-lg justify-between items-center gap-4 ${item.is_read === 0 ? 'bg-gray-100' : 'bg-white'}`}>
                                    <div className="flex flex-col">
                                        <div className="text-sm">Đơn hàng <span className="font-bold">{item.invoice_code}</span> vừa được tạo </div>
                                        <div className="text-xs font-medium text-gray-500">{timeAgo(item.created_at)}</div>
                                    </div>
                                    <div onClick={() => markAsRead(item.id)}>
                                        <CloseIcon />
                                    </div>
                                </div>
                            ))}

                        </div>

                    </div>

                </PopoverContent>

            </Popover>
        </div>

    );

}

export default Notify;
