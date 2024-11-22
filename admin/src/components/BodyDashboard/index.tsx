import React, { useEffect, useState } from 'react';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PersonIcon from '@mui/icons-material/Person';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import Chart_Price from '../Chart_Price';
import axios from 'axios';
import apiConfig from '@/configs/api';

import Inventory2Icon from '@mui/icons-material/Inventory2';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import Person2Icon from '@mui/icons-material/Person2';
import CreateHalfDoughnutChart from '../CirclePrice';
import StackedLineChart from '../StackedLineChart';

import { Skeleton } from "@nextui-org/react";



const BodyDashboard: React.FC = () => {
    const [staticss, setStaticss] = useState<any>([]);
    const [sumProduct, setSumProduct] = useState<any>([]);
    const [sumOrder, setSumOrder] = useState<any>([]);
    const [order, setOrder] = useState<any>([]);
    const [sumUser, setSumUser] = useState<any>([]);
    const [totalRevenue, setTotalRevenue] = useState<number>(0);
    const [previousMonthRevenue, setPreviousMonthRevenue] = useState<number>(0);
    const [monthCurrent, setMonthCurrent] = useState<{ month: string; revenue: number }[]>([]);
    const [monthPrevious, setMonthPrevious] = useState<{ month: string; revenue: number }[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [productMLL, setProductMLL] = useState<any>([]);
    const [productMLM, setProductMLM] = useState<any>([]);


    useEffect(() => {
        setLoading(true)
        axios.get(`${apiConfig.static.getProduct}`).then(res => {
            setSumProduct(res.data);
        });

        axios.get(`${apiConfig.static.getOrder}`).then(res => {
            setSumOrder(res.data);
            setOrder(res.data.monthly_orders);
        });

        axios.get(`${apiConfig.static.getUser}`).then(res => {
            setSumUser(res.data);
        });

        axios.get(`${apiConfig.static.getAll}`).then(res => {
            // setStaticss(res.data);
            const total = res.data.revenue.reduce((acc: number, item: any) => acc + parseFloat(item.revenue), 0);
            setTotalRevenue(total);
        });

        axios.get(`${apiConfig.static.getComparison}`).then(res => {
            setStaticss(res.data);
            setMonthCurrent(res.data.current_month_revenue);
            setMonthPrevious(res.data.previous_month_revenue);
        });

        axios.get(`${apiConfig.static.getMostLeast}`).then(res => {
            setProductMLM(res.data.products_by_month.most_sold);
            setProductMLL(res.data.products_by_month.least_sold);
        });
        setLoading(false)
    }, []);



    return (
        <div>
            <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-5 mb-6 ">
                <div className="bg-white p-4 rounded-lg flex items-center justify-start gap-4 h-[104px] shadow">
                    <div className="w-[60px] h-[60px] flex items-center justify-center rounded-full bg-pink-100 "><Inventory2Icon className='text-pink-700' /></div>
                    <div className='flex flex-col items-start justify-center'>
                        <h4 className="font-semibold text-[#555555] text-[22px]">{sumProduct.total_product_variant}</h4>
                        <p className=" text-[14px] text-[#333333]">Sản phẩm</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg flex items-center justify-start gap-4 h-[104px] shadow">
                    <div className="w-[60px] h-[60px] flex items-center justify-center rounded-full bg-blue-100 "><MonetizationOnIcon className='text-blue-700' /></div>
                    <div className='flex flex-col items-start justify-center'>
                        <h4 className="font-semibold text-[#555555] text-[22px]">{totalRevenue.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</h4>
                        <p className=" text-[14px] text-[#333333]">Doanh thu</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg flex items-center justify-start gap-4 h-[104px] shadow">
                    <div className="w-[60px] h-[60px] flex items-center justify-center rounded-full bg-orange-100 "><ShoppingBagIcon className='text-orange-700' /></div>
                    <div className='flex flex-col items-start justify-center'>
                        <h4 className="font-semibold text-[#555555] text-[22px]">{sumOrder.total_orders}</h4>
                        <p className=" text-[14px] text-[#333333]">Tổng đơn hàng</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg flex items-center justify-start gap-4 h-[104px] shadow">
                    <div className="w-[60px] h-[60px] flex items-center justify-center rounded-full bg-green-100 "><Person2Icon className='text-green-700' /></div>
                    <div className='flex flex-col items-start justify-center'>
                        <h4 className="font-semibold text-[#555555] text-[22px]">{sumUser.total_users}</h4>
                        <p className=" text-[14px] text-[#333333]">Người dùng</p>
                    </div>
                </div>
            </div>

            <div className='flex p-4 bg-white rounded-lg shadow gap-4 mb-6'>
                <div className='w-4/6 '><Chart_Price /></div>
                <div className='flex-1 flex flex-col items-center justify-center'>
                    <div className='w-[320px] h-[320px] mb-4'>
                        <CreateHalfDoughnutChart percentage={staticss} />
                    </div>
                    <div className='flex items-center justify-center gap-6'>
                        <div className='flex items-center justify-center gap-2'>
                            <div className='w-[40px] h-[40px] flex items-center justify-center rounded-lg bg-pink-100'>
                                <AttachMoneyIcon className='text-pink-700' />
                            </div>
                            <div className='flex flex-col items-start justify-center'>
                                <div className='text-[13px] text-[#333333]'>{monthCurrent[0]?.month}</div>
                                <div className='text-[16px] font-semibold text-[#555555]'>
                                    {monthCurrent[0]?.revenue.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                </div>
                            </div>
                        </div>
                        <div className='flex items-center justify-center gap-2'>
                            <div className='w-[40px] h-[40px] flex items-center justify-center rounded-lg bg-pink-100'>
                                <AttachMoneyIcon className='text-pink-700' />
                            </div>
                            <div className='flex flex-col items-start justify-center'>
                                <div className='text-[13px] text-[#333333]'>{monthPrevious[0]?.month}</div>
                                <div className='text-[16px] font-semibold text-[#555555]'>
                                    {monthPrevious[0]?.revenue.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='p-4 bg-white rounded-lg shadow mb-6'>
                <div className='text-[18px] font-bold text-[#333333] mb-2'>Thống kê đơn hàng</div>
                <StackedLineChart dataO={order} />
            </div>

            <div className='flex justify-center w-full gap-4 mb-[200px]'>
                <div className='w-1/2 p-4 bg-white rounded-lg shadow'>
                    <div className='text-[18px] font-bold text-[#333333] mb-2'>Sản phẩm nhiều lượt bán</div>
                    <div>
                        {productMLM.map((item: any) => (
                            <div key={item.product_variant_id} className='flex items-center justify-between w-full pl-2 mb-2'>
                                <div>{item.product_name}</div>
                                <div>{item.total_sold}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className='w-1/2 p-4 bg-white rounded-lg shadow'>
                    <div className='text-[18px] font-bold text-[#333333] mb-2'>Sản phẩm ít lượt bán</div>
                    <div>
                        {productMLL.map((item: any) => (
                            <div key={item.product_variant_id} className='flex items-center justify-between w-full pl-2 mb-2'>
                                <div>{item.product_name}</div>
                                <div>{item.total_sold}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>

    );
};

export default BodyDashboard;
