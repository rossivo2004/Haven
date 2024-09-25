// "use client";

// import Link from "next/link";
// import React, { Suspense, useEffect, useState } from "react";
// import AppContainer from "../AppContainer/AppContainer";
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import SearchIcon from '@mui/icons-material/Search';
// import { NAV_PROFILE } from '@/src/dump';
// import { formatVND } from "@/src/utils";
// import {
//     Autocomplete,
//     Avatar,
//     Button,
//     Divider,
//     AutocompleteItem,
//     Input,
// } from "@nextui-org/react";
// import { useProducts } from '@/src/hooks/product';


// import { IOrders } from "@/src/interface";
// import AppTableList from "../AppTableList/AppTableList";
// import { useSearchParams } from "next/navigation";

// const OrderSession = () => {
//     const [orders, setOrders] = useState<IOrders[]>([]);
//     const [codeOrders, setCodeOrders] = useState<IOrders[]>([]);
//     const [value, setValue] = React.useState<string>("");
//     const [selectedKey, setSelectedKey] = React.useState<React.Key | null>(null);
//     const [key, setKey] = useState(""); // key search

//     const currentPage = useSearchParams().get("page") || 1
//     const sizePage = 5;
//     const start = sizePage * (Number(currentPage) - 1);
//     const end = sizePage * Number(currentPage) - 1;

//     const { flatProducts } = useProducts(); // Use updated hook without filters

//     // console.log('currentPage', currentPage)

//     useEffect(() => {
//         setOrders(DUMP_ORDERS);
//     }, []);

//     useEffect(() => { }, [currentPage])

//     // Search with code order
//     const onSelectionChange = (key: React.Key | null) => {
//         if (key !== null) {
//             setSelectedKey(key);

//             // Tìm order dựa trên code đã chọn
//             const filter = DUMP_ORDERS.filter((order) => order.code === key);
//             setOrders(filter);
//         }
//     };

//     const onInputChange = (value: string) => {
//         setValue(value);

//         // tránh phân biệt chữ hoa chữ thường, chuyển đổi thành chữ thường hết
//         const lowercaseValue = value.toLowerCase();
//         const filter = DUMP_ORDERS.filter((order) =>
//             order.code?.toLocaleLowerCase().includes(lowercaseValue)
//         );

//         setCodeOrders(filter);
//     };

//     // Search with key input
//     const onChangeSearch = (key: any) => {
//         setKey(key.target.value);
//     };

//     const onClickSearch = () => {
//         // Dùng key để tìm code order hoặc tên sản phẩm
//         const filter = DUMP_ORDERS.filter(
//             (order) =>
//                 order.code?.toLocaleLowerCase().includes(key.toLocaleLowerCase()) ||
//                 order.products.some((product) =>
//                     product.product.name
//                         .toLocaleLowerCase()
//                         .includes(key.toLocaleLowerCase())
//                 )
//         );
//         setOrders(filter);
//     };

//     const onEnterSearch = (event: any) => {
//         if (event.key === "Enter") {
//             onClickSearch()
//         }
//     }

//     return (
//         <AppContainer>
//             <div
//                 className="flex flex-row text-black sm:text-base text-sm gap-10"
//                 id="scroll-back-pagination"
//             >
//                 <div className="flex flex-col w-full gap-7">
//                     <div className="flex flex-row items-center w-full relative">
//                         <div className="absolute top-0 left-0 flex sm:hidden">
//                         <Link href={'/profile'}>
//               <ArrowBackIcon />
//               </Link>
//                         </div>
//                         <div className="flex flex-1 justify-center sm:justify-start text-lg sm:text-4xl font-medium pb-[1vw] capitalize">
//                             Quản lý đơn hàng
//                         </div>
//                     </div>

//                     {/* Children */}
//                     <div className="flex flex-col gap-5 text-sm pb-10">
//                         {/* Filter */}
//                         <div className="grid grid-cols-2 gap-3 items-center">
//                             <Input
//                                 variant="bordered"
//                                 placeholder="Nhập từ khóa tìm kiếm"
//                                 size="lg"
//                                 startContent={<SearchIcon />}
//                                 className="col-span-2 md:col-span-1"
//                                 onChange={onChangeSearch}
//                                 onKeyDown={onEnterSearch}
//                                 isClearable
//                             />
//                             <div className="flex flex-row gap-3 items-center col-span-2 md:col-span-1">
//                                 <Autocomplete
//                                     defaultItems={codeOrders}
//                                     allowsCustomValue={true}
//                                     onInputChange={onInputChange}
//                                     onSelectionChange={onSelectionChange}
//                                     label="Mã đơn hàng"
//                                     size="sm"
//                                     variant="bordered"
//                                 >
//                                     {(item) => (
//                                         <AutocompleteItem key={item.code || ""}>
//                                             {item.code}
//                                         </AutocompleteItem>
//                                     )}
//                                 </Autocomplete>
//                                 <Button
//                                     color="warning"
//                                     className="text-white"
//                                     size="lg"
//                                     onClick={onClickSearch}
//                                 >
//                                     Tìm kiếm
//                                 </Button>
//                             </div>
//                         </div>

//                         {/* Danh sách */}
//                         <AppTableList
//                             tableList={
//                                 <div className="flex flex-col sm:gap-5 gap-3">
//                                     {orders && orders.length > 0 ? (
//                                         orders.slice(start, end + 1).map((order, index) => {
//                                             const { code, products, status, totalPayment } = order;
//                                             const quantity = products.reduce((total, product) => {
//                                                 return total + product.quantity;
//                                             }, 0);
//                                             const price = products.reduce((total, product) => {
//                                                 return total + product.product.price;
//                                             }, 0);
//                                             const discount = products.reduce((total, product) => {
//                                                 return (
//                                                     total +
//                                                     (product.product.price *
//                                                         (product.product.discount || 0)) /
//                                                     100
//                                                 );
//                                             }, 0);

//                                             return (
//                                                 <div
//                                                     className="text-[#707070] flex flex-col gap-4 py-3 px-5 rounded shadow-[0_0_5px_5px_rgba(0,0,0,0.1)] hover:shadow-[0_0_5px_3px_rgba(0,0,0,0.2)] shadow-transition"
//                                                     key={index}
//                                                 >
//                                                     <div className="grid grid-cols-2">
//                                                         <div className="text-base sm:text-xl">{code}</div>
//                                                         <div className="text-base sm:text-xl justify-self-end">
//                                                             {formatVND(Number(price))}
//                                                         </div>
//                                                         <div className="opacity-80 ">
//                                                             Quantity: {quantity}
//                                                         </div>
//                                                         <div className="opacity-80 justify-self-end ">
//                                                             - {formatVND(Number(discount))}
//                                                         </div>
//                                                     </div>

//                                                     <Divider className="bg-black" />

//                                                     <div className="grid lg:grid-cols-[auto_1fr] gap-3  lg:gap-7 items-center">
//                                                         <div className="lg:justify-self-end text-base sm:text-xl lg:order-2">
//                                                             Tổng tiền:{" "}
//                                                             {formatVND(Number(totalPayment - 1231))}
//                                                         </div>

//                                                         <div className="flex flex-row gap-3 lg:order-1">
//                                                             <Button
//                                                                 variant="bordered"
//                                                                 className="w-full lg:w-[220px] border-black font-bold rounded"
//                                                             >
//                                                                 Mua lại
//                                                             </Button>
//                                                             <Button
//                                                                 color="warning"
//                                                                 className="w-full lg:w-[220px] text-white rounded"
//                                                             >
//                                                                 Xem chi tiết
//                                                             </Button>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             );
//                                         })
//                                     ) : (
//                                         <EmptyOrders />
//                                     )}
//                                 </div>
//                             }
//                             dataLength={orders.length}
//                             sizePage={sizePage}
//                             positionPagination="end"
//                         />
//                     </div>
//                 </div>
//             </div>
//         </AppContainer>
//     );
// };

// export default OrderSession;

// const EmptyOrders = () => {
//     return (
//         <div className="text-xs h-[300px] sm:text-xl text-nowrap bg-white rounded-3xl flex justify-center items-center shadow-md my-auto border border-gray-300">
//             Không có đơn hàng nào.
//         </div>
//     );
// };
