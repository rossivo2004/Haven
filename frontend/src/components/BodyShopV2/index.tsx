// 'use client'
// import './style.css'

// import { useState, useEffect, useMemo } from 'react';
// import { useRouter } from 'next/navigation';
// import { Chip, Accordion, AccordionItem, CheckboxGroup, Checkbox, Modal, ModalContent, ModalHeader, ModalBody, Button, useDisclosure, ModalFooter } from "@nextui-org/react";
// import { Dropdown, Link, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
// import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
// import BreadcrumbNav from '../Breadcrum';
// import BoxProduct from '../BoxProduct';
// import CustomPagination from '../Pagination';
// import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
// import { DUMP_PRODUCTS } from '@/src/dump';
// import { ProductProps } from '@/src/interface';
// import { SingleProduct } from '@/src/interface';
// import { formatVND } from '@/src/utils';
// import Menu from '../Test';
// import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
// import type { Selection } from "@nextui-org/react";
// import { useProducts } from '@/src/hooks/product';

// import { CustomCheckbox } from './components/CustomCheckbox';

// function BodyShopV2() {
//     const itemsPerPage = 12;
//     const router = useRouter();
//     const [currentPage, setCurrentPage] = useState<number>(1);
//     const [priceFilter, setPriceFilter] = useState<string[]>([]);
//     const [cateFilter, setCateFilter] = useState<string[]>([]);
//     const [groupSelected, setGroupSelected] = useState<string[]>([]);
//     const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set(["text"]));
//     const { flatProducts } = useProducts(); // Use updated hook without filters

//     const selectedValue = useMemo(
//         () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
//         [selectedKeys]
//     );

//     useEffect(() => {
//         const params = new URLSearchParams(window.location.search);
//         const page = parseInt(params.get('page') || '1', 10);
//         const prices = params.getAll('price');
//         const categories = params.getAll('category');

//         setCurrentPage(page);
//         setPriceFilter(prices);
//         setCateFilter(categories);
//     }, []);

//     useEffect(() => {
//         const params = new URLSearchParams();
//         if (priceFilter.length > 0) priceFilter.forEach(value => params.append('price', value));
//         if (cateFilter.length > 0) cateFilter.forEach(value => params.append('category', value));

//         params.set('page', currentPage.toString());
//         router.push(`?${params.toString()}`, { scroll: false });

//     }, [priceFilter, cateFilter, currentPage, router]);

//     const startIndex = (currentPage - 1) * itemsPerPage;
//     const endIndex = startIndex + itemsPerPage;

//     const handlePriceFilterChange = (values: string[]) => {
//         setPriceFilter(values);
//         setCurrentPage(1);
//     };

//     const handleCategoryFilterChange = (values: string[]) => {
//         setCateFilter(values);
//         setCurrentPage(1);
//     };

//     const handleChipClose = (range: string) => {
//         setPriceFilter((prevFilter) => prevFilter.filter((item) => item !== range));
//         setCateFilter((prevFilter) => prevFilter.filter((item) => item !== range));
//         setCurrentPage(1);
//     };

//     const filterByPrice = (product: SingleProduct) => {
//         if (priceFilter.length === 0) return true;

//         const discountedPrice = product.price * (1 - product.discount / 100);

//         return priceFilter.some((range) => {
//             const [min, max] = range.split('-').map(Number);
//             if (max) {
//                 return discountedPrice >= min && discountedPrice < max;
//             }
//             return discountedPrice >= min;
//         });
//     };

//     const filterByCategory = (product: SingleProduct) => {
//         if (cateFilter.length === 0) return true;
//         return cateFilter.includes(product.category.toLowerCase());
//     };

//     const filteredProducts = flatProducts.filter(product => filterByPrice(product) && filterByCategory(product));
//     const currentProducts = filteredProducts.slice(startIndex, endIndex);

//     const { isOpen, onOpen, onOpenChange } = useDisclosure();


//     const resetFilter = () => {
//         setPriceFilter([]);
//         setCateFilter([]);
//     };



//     return (

//         <div>
//             <div className="py-5 h-[62px]">
//                 <BreadcrumbNav
//                     items={[
//                         { name: 'Trang chủ', link: '/' },
//                         { name: 'Sản phẩm', link: '#' },
//                     ]}
//                 />
//             </div>
//             {/* <div className="py-5 h-[170px] lg:h-[120px] lg:block flex lg:items-center flex-col lg:flex-row items-start">
//                 <div className="mr-4 mb-2 flex justify-between items-center w-full">
//                     <div className='text-base font-normal'>
//                         Bộ lọc đã chọn
//                     </div>
//                     <div className='lg:block hidden'>
//                         <Button onClick={resetFilter}>Xóa bộ lọc</Button>
//                     </div>
//                     <div className='lg:hidden block'>
//                         <div className='flex items-center'>
//                             <div>
//                                 Lọc:
//                             </div>
//                             <Button onPress={onOpen} className='bg-transparent px-0 min-w-0'>
//                                 <FilterAltOutlinedIcon />
//                             </Button>

//                         </div>

//                         <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
//                             <ModalContent className='z-50'>
//                                 {(onClose) => (
//                                     <>
//                                         <ModalHeader className="flex flex-col gap-1">Lọc</ModalHeader>
//                                         <ModalBody>
//                                             <Accordion selectionMode="multiple" className="px-0" defaultExpandedKeys={["category", "price"]}>
//                                                 <AccordionItem key="price" indicator={<ArrowLeftIcon />} aria-label="Price" title="Price">
//                                                     <CheckboxGroup value={priceFilter} onChange={handlePriceFilterChange}>
//                                                         <Checkbox value="0-99000">0 - 99.000</Checkbox>
//                                                         <Checkbox value="100000-199000">100.000 - 199.000</Checkbox>
//                                                         <Checkbox value="200000-299000">200.000 - 299.000</Checkbox>
//                                                         <Checkbox value="300000-399000">300.000 - 399.000</Checkbox>
//                                                         <Checkbox value="400000">400.000 +</Checkbox>
//                                                     </CheckboxGroup>
//                                                 </AccordionItem>
//                                                 <AccordionItem key="category" indicator={<ArrowLeftIcon />} aria-label="Category" title="Category">
//                                                     <CheckboxGroup value={cateFilter} onChange={handleCategoryFilterChange}>
//                                                         <Checkbox value="headphone">Headphone</Checkbox>
//                                                         <Checkbox value="tv">TV</Checkbox>
//                                                         <Checkbox value="laptop">Laptop</Checkbox>
//                                                         <Checkbox value="smartphone">Smart Phone</Checkbox>
//                                                     </CheckboxGroup>
//                                                 </AccordionItem>
//                                             </Accordion>
//                                         </ModalBody>
//                                     </>
//                                 )}
//                             </ModalContent>
//                         </Modal>
//                     </div>
//                 </div>
//                 <div className='w-full lg:h-20 h-auto overflow-scroll hidden-scrollbar' style={{ whiteSpace: 'nowrap' }}>
//                     {priceFilter.map((filter) => {
//                         const [min, max] = filter.split('-').map(value => formatVND(parseFloat(value)));

//                         return (
//                             <Chip
//                                 key={filter} // Thêm thuộc tính key
//                                 onClose={() => handleChipClose(filter)}
//                                 variant="bordered"
//                                 className="text-base mr-2"
//                             >
//                                 {max ? `${min} - ${max}` : `${min}+`}
//                             </Chip>
//                         );
//                     })}

//                     {cateFilter.map((filter) => (
//                         <Chip
//                             key={filter} // Thêm thuộc tính key
//                             onClose={() => handleChipClose(filter)}
//                             variant="bordered"
//                             className="text-base mr-2"
//                         >
//                             {filter}
//                         </Chip>
//                     ))}
//                 </div>

//             </div> */}



//             <div className="flex w-full gap-5 flex-col lg:flex-row mb-10">
//                 <div className="w-1/4 lg:block hidden">
//                     <Accordion selectionMode="multiple" className="px-0" defaultExpandedKeys={["category", "price", "brand"]}>
//                         <AccordionItem key="category" indicator={<ArrowLeftIcon />} aria-label="category" className='font-semibold' title="Phân loại sản phẩm">
//                             <CheckboxGroup value={cateFilter} onChange={handleCategoryFilterChange}>
//                                 <Checkbox className='font-medium' value="headphone">Headphone</Checkbox>
//                                 <Checkbox className='font-medium' value="tv">TV</Checkbox>
//                                 <Checkbox className='font-medium' value="laptop">Laptop</Checkbox>
//                                 <Checkbox className='font-medium' value="smartphone">Smart Phone</Checkbox>
//                             </CheckboxGroup>
//                         </AccordionItem>
//                         <AccordionItem key="price" indicator={<ArrowLeftIcon />} aria-label="price" className='font-semibold' title="Giá sản phẩm" >
//                             <CheckboxGroup value={priceFilter} onChange={handlePriceFilterChange}>
//                                 <Checkbox className='font-medium' value="0-99000">0 - 99.000</Checkbox>
//                                 <Checkbox className='font-medium' value="100000-199000">100.000 - 199.000</Checkbox>
//                                 <Checkbox className='font-medium' value="200000-299000">200.000 - 299.000</Checkbox>
//                                 <Checkbox className='font-medium' value="300000-399000">300.000 - 399.000</Checkbox>
//                                 <Checkbox className='font-medium' value="400000">400.000+</Checkbox>
//                             </CheckboxGroup>
//                         </AccordionItem>
//                         <AccordionItem key="price" indicator={<ArrowLeftIcon />} aria-label="brand" className='font-semibold' title="Thương hiệu sản phẩm" >
//                             <CheckboxGroup value={priceFilter} onChange={handlePriceFilterChange}>
//                                 <Checkbox className='font-medium' value="0-99000">0 - 99.000</Checkbox>
//                                 <Checkbox className='font-medium' value="100000-199000">100.000 - 199.000</Checkbox>
//                                 <Checkbox className='font-medium' value="200000-299000">200.000 - 299.000</Checkbox>
//                                 <Checkbox className='font-medium' value="300000-399000">300.000 - 399.000</Checkbox>
//                                 <Checkbox className='font-medium' value="400000">400.000+</Checkbox>
//                             </CheckboxGroup>
//                         </AccordionItem>
//                     </Accordion>

//                     <div className='w-full h-[510px] bg-main rounded-lg mt-4 lg:block hidden overflow-hidden'>
//                         <img src="/images/bn-12.png" alt="" className='w-full h-full object-cover' />
//                     </div>
//                 </div>
//                 <div className='flex-1'>
//                     <div className='flex justify-between'>
//                         <div className='h-[50px] rounded-lg mb-4 flex items-center gap-2'>
//                             <>
//                                 <Button onPress={onOpen}
//                                     startContent={<FilterAltOutlinedIcon />}
//                                     variant='bordered'
//                                 >
//                                     Bộ lọc
//                                 </Button>
//                                 <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
//                                     <ModalContent>
//                                         {(onClose) => (
//                                             <>
//                                                 <ModalHeader className="flex flex-col gap-1">Bộ lọc nâng cao</ModalHeader>
//                                                 <ModalBody>
//                                                     <div className='mb-4'>
//                                                         <div className='font-semibold mb-1 text-lg'>Loại: </div>
//                                                         <CheckboxGroup
//                                                             className="gap-1"
//                                                             orientation="horizontal"
//                                                             value={groupSelected}
//                                                             onChange={(value) => setGroupSelected(value)}
//                                                         >
//                                                             <CustomCheckbox value="wifi">Wifi</CustomCheckbox>
//                                                             <CustomCheckbox value="tv">TV</CustomCheckbox>
//                                                             <CustomCheckbox value="kitchen">Kitchen</CustomCheckbox>
//                                                             <CustomCheckbox value="parking">Parking</CustomCheckbox>
//                                                             <CustomCheckbox value="pool">Pool</CustomCheckbox>
//                                                             <CustomCheckbox value="gym">Gym</CustomCheckbox>
//                                                         </CheckboxGroup>
//                                                     </div>
//                                                     <div className='mb-4'>
//                                                         <div className='font-semibold mb-1 text-lg'>Loại: </div>
//                                                         <CheckboxGroup
//                                                             className="gap-1"
//                                                             orientation="horizontal"
//                                                             value={groupSelected}
//                                                             onChange={(value) => setGroupSelected(value)}
//                                                         >
//                                                             <CustomCheckbox value="wifi">Wifi</CustomCheckbox>
//                                                             <CustomCheckbox value="tv">TV</CustomCheckbox>
//                                                             <CustomCheckbox value="kitchen">Kitchen</CustomCheckbox>
//                                                             <CustomCheckbox value="parking">Parking</CustomCheckbox>
//                                                             <CustomCheckbox value="pool">Pool</CustomCheckbox>
//                                                             <CustomCheckbox value="gym">Gym</CustomCheckbox>
//                                                         </CheckboxGroup>
//                                                     </div>
//                                                     <div className='mb-4'>
//                                                         <div className='font-semibold mb-1 text-lg'>Loại: </div>
//                                                         <CheckboxGroup
//                                                             className="gap-1"
//                                                             orientation="horizontal"
//                                                             value={groupSelected}
//                                                             onChange={(value) => setGroupSelected(value)}
//                                                         >
//                                                             <CustomCheckbox value="wifi">Wifi</CustomCheckbox>
//                                                             <CustomCheckbox value="tv">TV</CustomCheckbox>
//                                                             <CustomCheckbox value="kitchen">Kitchen</CustomCheckbox>
//                                                             <CustomCheckbox value="parking">Parking</CustomCheckbox>
//                                                             <CustomCheckbox value="pool">Pool</CustomCheckbox>
//                                                             <CustomCheckbox value="gym">Gym</CustomCheckbox>
//                                                         </CheckboxGroup>
//                                                     </div>
//                                                 </ModalBody>
//                                                 <ModalFooter>
//                                                     <Button color="danger" variant="light">
//                                                         Chọn lại
//                                                     </Button>
//                                                     <Button color="primary">
//                                                         Áp dụng
//                                                     </Button>
//                                                 </ModalFooter>
//                                             </>
//                                         )}
//                                     </ModalContent>

//                                 </Modal>

//                             </>

//                             <div>
//                                 <Dropdown>
//                                     <DropdownTrigger>
//                                         <Button
//                                             variant="bordered"
//                                             endContent={<ArrowDropDownIcon />}
//                                         >
//                                             Open Menu
//                                         </Button>
//                                     </DropdownTrigger>
//                                     <DropdownMenu variant="faded" aria-label="Static Actions">
//                                         <DropdownItem key="new">New file</DropdownItem>
//                                         <DropdownItem key="copy">Copy link</DropdownItem>
//                                         <DropdownItem key="edit">Edit file</DropdownItem>
//                                         <DropdownItem key="delete" className="text-danger" color="danger">
//                                             Delete file
//                                         </DropdownItem>
//                                     </DropdownMenu>
//                                 </Dropdown>
//                             </div>
//                             <div>
//                                 <Dropdown>
//                                     <DropdownTrigger>
//                                         <Button
//                                             variant="bordered"
//                                             endContent={<ArrowDropDownIcon />}
//                                         >
//                                             Open Menu
//                                         </Button>
//                                     </DropdownTrigger>
//                                     <DropdownMenu variant="faded" aria-label="Static Actions">
//                                         <DropdownItem key="new">New file</DropdownItem>
//                                         <DropdownItem key="copy">Copy link</DropdownItem>
//                                         <DropdownItem key="edit">Edit file</DropdownItem>
//                                         <DropdownItem key="delete" className="text-danger" color="danger">
//                                             Delete file
//                                         </DropdownItem>
//                                     </DropdownMenu>
//                                 </Dropdown>
//                             </div>
//                             <div>
//                                 <Dropdown>
//                                     <DropdownTrigger>
//                                         <Button
//                                             variant="bordered"
//                                             className="capitalize"
//                                             endContent={<ArrowDropDownIcon />}
//                                         >
//                                             {/* {selectedValue} */}
//                                             Open Menu
//                                         </Button>
//                                     </DropdownTrigger>
//                                     <DropdownMenu
//                                         aria-label="Multiple selection example"
//                                         variant="flat"
//                                         closeOnSelect={false}
//                                         disallowEmptySelection
//                                         selectionMode="multiple"
//                                         selectedKeys={selectedKeys}
//                                         onSelectionChange={setSelectedKeys}
//                                     >
//                                         <DropdownItem key="text">Text</DropdownItem>
//                                         <DropdownItem key="number">Number</DropdownItem>
//                                         <DropdownItem key="date">Date</DropdownItem>
//                                         <DropdownItem key="single_date">Single Date</DropdownItem>
//                                         <DropdownItem key="iteration">Iteration</DropdownItem>
//                                     </DropdownMenu>
//                                 </Dropdown>
//                             </div>
//                         </div>
//                         <div>
//                             <Dropdown>
//                                 <DropdownTrigger>
//                                     <Button
//                                         variant="bordered"
//                                         endContent={<ArrowDropDownIcon />}
//                                     >
//                                         Sắp xếp theo
//                                     </Button>
//                                 </DropdownTrigger>
//                                 <DropdownMenu variant="faded" aria-label="Static Actions">
//                                     <DropdownItem key="new">Giá thấp đến cao</DropdownItem>
//                                     <DropdownItem key="copy">Giá cao đến thấp</DropdownItem>
//                                     <DropdownItem key="edit">Khuyến mãi nhiều</DropdownItem>
//                                     <DropdownItem key="edit">Sản phẩm bán chạy</DropdownItem>

//                                 </DropdownMenu>
//                             </Dropdown>
//                         </div>
//                     </div>

//                     <div className="flex-1 grid lg:grid-cols-3 grid-cols-2 gap-2">
//                         {currentProducts.length > 0 ? (
//                             currentProducts.map((product) => (
//                                 <BoxProduct key={product.id} product={product} />
//                             ))
//                         ) : (
//                             <div className="flex items-center justify-center col-span-3 ">
//                                 Không tìm thấy sản phẩm nào phù hợp với yêu cầu của bạn.
//                             </div>
//                         )}

//                     </div>
//                 </div>
//             </div>
//             <div className="flex justify-end w-full">
//                 <CustomPagination
//                     totalItems={filteredProducts.length}
//                     itemsPerPage={itemsPerPage}
//                     currentPage={currentPage}
//                     onPageChange={(page: number) => setCurrentPage(page)}
//                 />
//             </div>

//             <Menu />
//         </div>
//     );
// }

// export default BodyShopV2;
