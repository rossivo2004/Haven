"use client"

import Link from 'next/link'
import AppContainer from '../AppContainer/AppContainer'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { NAV_PROFILE } from '@/src/dump';
import RedeemIcon from '@mui/icons-material/Redeem';
import { Avatar, Divider, Image } from '@nextui-org/react'
import React, { Suspense, useEffect, useState } from 'react'
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import { INotify, TypeNotify } from "@/src/interface";
import AppTableList from '../AppTableList/AppTableList';

const NAV_NOTIFY: TypeNotify[] = [
    { name: "Thông báo chung", icon: <NotificationsNoneOutlinedIcon /> },
    { name: "Thông báo khuyến mãi", icon: <RedeemIcon /> },
    { name: "Thông báo đơn hàng", icon: <LocalShippingOutlinedIcon /> },
    { name: "Thông báo hệ thống", icon: <SettingsOutlinedIcon /> },
]

const NOTIFY: INotify[] = [
    { id: 1, dateReceive: "01/02/2023", type: NAV_NOTIFY[0], content: "Donec sed erat ut magna suscipit mattis. Aliquam erat volutpat.", seen: false },
    { id: 2, dateReceive: "02/02/2023", type: NAV_NOTIFY[1], content: "Donec sed erat ut magna suscipit mattis. Aliquam erat volutpat.", seen: false },
    { id: 3, dateReceive: "03/02/2023", type: NAV_NOTIFY[2], content: "Donec sed erat ut magna suscipit mattis. Aliquam erat volutpat.", seen: false },
    { id: 4, dateReceive: "01/02/2023", type: NAV_NOTIFY[3], content: "Donec sed erat ut magna suscipit mattis. Aliquam erat volutpat.", seen: true },
    { id: 5, dateReceive: "01/02/2023", type: NAV_NOTIFY[0], content: "Donec sed erat ut magna suscipit mattis. Aliquam erat volutpat.", seen: true },
    { id: 6, dateReceive: "01/02/2023", type: NAV_NOTIFY[0], content: "Donec sed erat ut magna suscipit mattis. Aliquam erat volutpat.", seen: false },
    { id: 7, dateReceive: "01/02/2023", type: NAV_NOTIFY[0], content: "Donec sed erat ut magna suscipit mattis. Aliquam erat volutpat.", seen: false },
    { id: 8, dateReceive: "01/02/2023", type: NAV_NOTIFY[0], content: "Donec sed erat ut magna suscipit mattis. Aliquam erat volutpat.", seen: false },
    { id: 9, dateReceive: "01/02/2023", type: NAV_NOTIFY[0], content: "Donec sed erat ut magna suscipit mattis. Aliquam erat volutpat.", seen: false },
    { id: 10, dateReceive: "01/02/2023", type: NAV_NOTIFY[0], content: "Donec sed erat ut magna suscipit mattis. Aliquam erat volutpat.", seen: false },
    { id: 11, dateReceive: "01/02/2023", type: NAV_NOTIFY[0], content: "Donec sed erat ut magna suscipit mattis. Aliquam erat volutpat.", seen: false },
]

const NotifySession = () => {
    const [notify, setNotify] = useState<INotify[]>(NOTIFY)
    const [currentPage, setCurrentPage] = React.useState(1);
    const [currentTab, setCurrentTab] = useState(NAV_NOTIFY[0].name)

    const sizePage = 5;
    const start = sizePage * (currentPage - 1);
    const end = sizePage * currentPage - 1;

    useEffect(() => {
    }, [notify])

    const handleSeen = (id: number) => {
        const updateNotify = notify.map((notify => notify.id === id ? { ...notify, seen: true } : notify))
        setNotify(updateNotify)
    }

    const handleDelete = (id: number, event: React.MouseEvent) => {
        event.stopPropagation(); // Prevent the event from propagating to parent elements
        const updatedNotify = notify.filter(notification => notification.id !== id);
        setNotify(updatedNotify);
    };

    const onClickTab = (tabName: string) => {
        setCurrentTab(tabName)
        const filter = NOTIFY.filter(notify => notify.type.name === tabName)
        setNotify(filter)
    }

    return (
        <Suspense>
            <AppContainer>
                <div className="flex flex-row text-black sm:text-base text-sm gap-10">
                    {/* <div className="hidden sm:flex flex-col gap-5 w-[350px]">
                        <div className="grid grid-cols-[auto_1fr]">
                            <div className="row-span-2 mr-3">
                                <Avatar
                                    src="/images/8951e533806bc54e0828a60a67c4c731.png"
                                    alt="avatar"
                                    size="lg"
                                />
                            </div>
                            <div className="text-sm">Tài khoản của</div>
                            <div className="capitalize font-medium">Nguyễn hữu tiến</div>
                        </div>

                        <div className="flex flex-col gap-1">
                            {NAV_PROFILE.map((nav, index) => (
                                <div
                                    className={`flex flex-row gap-5 py-3 ${index < NAV_PROFILE.length - 1
                                        ? "border-b border-b-black"
                                        : ""
                                        }`}
                                    key={index}
                                >
                                    <div>{nav.startContent}</div>
                                    <div>{nav.name}</div>
                                </div>
                            ))}
                        </div>
                    </div> */}

                    <div className="flex flex-col w-full gap-7">
                        <div className="flex flex-row items-center w-full relative">
                            <div className="absolute top-0 left-0 flex sm:hidden">
                            <Link href={'/profile'}>
              <ArrowBackIcon />
              </Link>
                            </div>
                            <div className="flex flex-1 justify-center sm:justify-start text-lg sm:text-4xl font-medium pb-[1vw] capitalize">
                                Thông báo
                            </div>
                        </div>

                        {/* Children */}
                        <div className="flex flex-col gap-10 text-sm pb-10">
                            <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-5 justify-between items-center">
                                {NAV_NOTIFY.map((nav, index) => (
                                    <div onClick={() => onClickTab(nav.name)} className='cursor-pointer flex flex-row gap-3 items-center justify-between group' key={index}>
                                        <div className={`flex flex-row justify-between gap-3 group-hover:text-[#FFC535] ${currentTab === nav.name ? "text-[#FFC535]" : ""}`}>
                                            {nav.icon}
                                            <div>{nav.name}</div>
                                        </div>
                                        <div className='group-hover:text-[#FFC535] sm:hidden flex items-center'>
                                            <KeyboardArrowRightOutlinedIcon fontSize="small" />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <AppTableList
                                tableList={(
                                    <div className="flex flex-col shadow-[0_0_10px_5px_rgba(0,0,0,0.1)]">
                                        {notify && notify.length > 0 ? notify.slice(start, end + 1).map((notify, index) => (
                                            <div onClick={() => handleSeen(notify.id)} className={`grid grid-cols-[auto_auto] xl:grid-cols-[auto_auto_auto] border-b border-b-black p-4 md:py-6 md:px-8 gap-5 ${notify.seen ? "opacity-50" : "opacity-100"}`} key={index}>
                                                <div className='col-span-auto flex flex-row gap-1 font-bold tracking-widest order-1 justify-self-start'>{notify.dateReceive}</div>

                                                <div className='flex flex-row gap-5 items-center order-3 xl:order-2 col-span-2 xl:col-span-1'>
                                                    <div className='order-3'>{notify.type.icon}</div>
                                                    <div className='order-4'>{notify.content}</div>
                                                </div>

                                                <div className='flex flex-row items-center gap-3 order-2 xl:order-3 justify-self-end'>
                                                    <div className='text-[#FFC535] text-nowrap'>Đánh dấu đã đọc</div>
                                                    <Divider orientation='vertical' className="bg-black" />
                                                    <div className='text-[#DC3333] cursor-pointer' onClick={(e) => handleDelete(notify.id, e)}>Xóa</div>
                                                </div>
                                            </div>
                                        )) : <EmptyNotify />}

                                    </div>
                                )}
                                sizePage={sizePage}
                                dataLength={notify.length}
                                positionPagination="end"
                                onChange={setCurrentPage}
                            />

                        </div>
                    </div>
                </div>
            </AppContainer>
        </Suspense>
    )
}

export default NotifySession

const EmptyNotify = () => {
    return (
        <div className='flex flex-col justify-center items-center p-[5vw] w-full gap-5'>
            <Image src='/images/amico.png' alt='empty-notify' className="lg:w-[250px] sm:w-[200px] w-[180px]" />
            <div className='sm:text-xl'>Hiện tại bạn chưa có thông báo nào!</div>
        </div>
    )
}