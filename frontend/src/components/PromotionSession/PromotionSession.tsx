// "use client"

// import Link from 'next/link'
// import AppContainer from '../AppContainer/AppContainer'
// import AppTableList from '../AppTableList/AppTableList'
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import { NAV_PROFILE } from '@/src/dump';
// import PROMOTIONS
// import { Avatar, Button, Image } from '@nextui-org/react'
// import { usePathname, useRouter, useSearchParams } from 'next/navigation'
// import React, { Suspense, useCallback, useEffect, useState } from 'react'

// const NAV_PROMOTION = ["Tất cả", "Tiki", "Nhà bán", "Ưu đãi thanh toán", "Hết hiệu lực"]

// const PromotionSession = () => {
//     const [promotion, setPromotion] = useState(PROMOTIONS)
//     const [currentPage, setCurrentPage] = React.useState(1);
//     const [currentTab, setCurrentTab] = useState(NAV_PROMOTION[0])

//     const searchParams = useSearchParams()
//     const paramsPage = searchParams.get("page")
//     const pathname = usePathname()
//     const router = useRouter()
//     const sizePage = 5;
//     const start = sizePage * (currentPage - 1);
//     const end = sizePage * currentPage - 1;

//     useEffect(() => {
//         setCurrentPage(Number(paramsPage ?? 1))
//         setCurrentTab(searchParams.get('tab') || NAV_PROMOTION[0])
//     }, [paramsPage])

//     const createParams = useCallback(
//         (name: string, value: string) => {
//             const params = new URLSearchParams(searchParams.toString())
//             params.set(name, value)
//             return params.toString()
//         },
//         [searchParams]
//     )

//     const onClickTab = (tabName: string) => {
//         setCurrentTab(tabName)
//         router.push(pathname + '?' + createParams("tab", tabName))
//     }

//     return (
//         <Suspense>
//             <AppContainer>
//                 <div className="flex flex-row text-black sm:text-base text-sm gap-10">
//                     {/* <div className="hidden sm:flex flex-col gap-5 w-[350px]">
//                         <div className="grid grid-cols-[auto_1fr]">
//                             <div className="row-span-2 mr-3">
//                                 <Avatar
//                                     src="/images/8951e533806bc54e0828a60a67c4c731.png"
//                                     alt="avatar"
//                                     size="lg"
//                                 />
//                             </div>
//                             <div className="text-sm">Tài khoản của</div>
//                             <div className="capitalize font-medium">Nguyễn hữu tiến</div>
//                         </div>

//                         <div className="flex flex-col gap-1">
//                             {NAV_PROFILE.map((nav, index) => (
//                                 <div
//                                     className={`flex flex-row gap-5 py-3 ${index < NAV_PROFILE.length - 1
//                                         ? "border-b border-b-black"
//                                         : ""
//                                         }`}
//                                     key={index}
//                                 >
//                                     <div>{nav.startContent}</div>
//                                     <div>{nav.name}</div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div> */}

//                     <div className="flex flex-col w-full gap-7">
//                         <div className="flex flex-row items-center w-full relative">
//                             <div className="absolute top-0 left-0 flex sm:hidden">
//                                 <Link href={'/profile'}>
//                                     <ArrowBackIcon />
//                                 </Link>
//                             </div>
//                             <div className="flex flex-1 justify-center sm:justify-start text-lg sm:text-4xl font-medium pb-[1vw] capitalize">
//                                 Mã giảm giá
//                             </div>
//                         </div>

//                         {/* Children */}
//                         <div className="flex flex-col gap-10 text-sm pb-10">
//                             <div className="flex flex-row gap-5 justify-between items-center overflow-auto">
//                                 {NAV_PROMOTION.map((nav, index) => (
//                                     <div onClick={() => onClickTab(nav)} className='cursor-pointer flex flex-row gap-3 items-center justify-between group' key={index}>
//                                         <div className={`sm:text-lg text-nowrap flex flex-row justify-between gap-3 group-hover:text-[#FFC535] ${currentTab === nav ? "text-[#FFC535]" : ""}`}>
//                                             {nav}
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>

//                             <AppTableList
//                                 tableList={(
//                                     <div className="flex flex-col shadow-[0_0_10px_5px_rgba(0,0,0,0.1)] p-5 gap-3">
//                                         {promotion && promotion.length > 0 ? promotion.slice(start, end + 1).map((promotion, index) => (
//                                             <div className='flex flex-row justify-between items-center gap-5' key={index}>
//                                                 <div className='flex flex-row gap-2' >
//                                                     <div className='bg-gray-500'><Image src='' alt='promotion' /></div>
//                                                     <div className='flex flex-col gap-3'>
//                                                         <div className='font-bold'>Giảm {promotion.discount}</div>
//                                                         <div>Cho đơn hàng từ {promotion.forOrderTo}</div>
//                                                         <div>HSD {promotion.endDate}</div>
//                                                     </div>
//                                                 </div>
//                                                 <Button className='bg-[#FFC535] text-white rounded md:w-[220px] md:h-[50px] w-auto h-[45px]'>
//                                                     Lưu
//                                                 </Button>
//                                             </div>
//                                         )) : <EmptyPromotion />}
//                                     </div>
//                                 )}
//                                 sizePage={sizePage}
//                                 dataLength={promotion.length}
//                                 positionPagination="end"
//                                 onChange={setCurrentPage}
//                             />

//                         </div>
//                     </div>
//                 </div>
//             </AppContainer>
//         </Suspense>
//     )
// }

// export default PromotionSession

// const EmptyPromotion = () => {
//     return (
//         <div className='flex flex-col justify-center items-center p-[5vw] w-full gap-5'>
//             <Image src='/images/amico.png' alt='empty-notify' className="lg:w-[250px] sm:w-[200px] w-[180px]" />
//             <div className='sm:text-xl'>Hiện tại bạn chưa có mã giảm giá nào!</div>
//         </div>
//     )
// }