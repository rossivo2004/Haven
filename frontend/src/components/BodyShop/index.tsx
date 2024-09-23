'use client'
import './style.css'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Chip, Accordion, AccordionItem, CheckboxGroup, Checkbox, Modal, ModalContent, ModalHeader, ModalBody, Button, useDisclosure } from "@nextui-org/react";
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import BreadcrumbNav from '../Breadcrum';
import BoxProduct from '../BoxProduct';
import CustomPagination from '../Pagination';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import { DUMP_PRODUCTS } from '@/src/dump';
import { ProductProps } from '@/src/interface';
import { formatVND } from '@/src/utils';
import Menu from '../Test';
import { Dropdown, Link, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CloseIcon from '@mui/icons-material/Close';
import { Select, SelectItem } from "@nextui-org/react";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

function BodyShop() {
    const itemsPerPage = 12;
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [priceFilter, setPriceFilter] = useState<string[]>([]);
    const [cateFilter, setCateFilter] = useState<string[]>([]);

    const [filter, setFilter] = useState<string[]>([]);



    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const page = parseInt(params.get('page') || '1', 10);
        const prices = params.getAll('price');
        const categories = params.getAll('category');

        setCurrentPage(page);
        setPriceFilter(prices);
        setCateFilter(categories);
    }, []);

    useEffect(() => {
        // Combine priceFilter and cateFilter into one state
        const combinedFilter = [...priceFilter, ...cateFilter];
        setFilter(combinedFilter);

        const params = new URLSearchParams();
        if (priceFilter.length > 0) priceFilter.forEach(value => params.append('price', value));
        if (cateFilter.length > 0) cateFilter.forEach(value => params.append('category', value));

        params.set('page', currentPage.toString());
        router.push(`?${params.toString()}`, { scroll: false });
    }, [priceFilter, cateFilter, currentPage, router]);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const handlePriceFilterChange = (values: string[]) => {
        setPriceFilter(values);
        setCurrentPage(1);
    };

    const handleCategoryFilterChange = (values: string[]) => {
        setCateFilter(values);
        setCurrentPage(1);
    };

    const handleChipClose = (range: string) => {
        setPriceFilter((prevFilter) => prevFilter.filter((item) => item !== range));
        setCateFilter((prevFilter) => prevFilter.filter((item) => item !== range));
        setCurrentPage(1);
    };

    const filterByPrice = (product: ProductProps) => {
        if (priceFilter.length === 0) return true;

        const discountedPrice = product.price * (1 - product.discount / 100);

        return priceFilter.some((range) => {
            const [min, max] = range.split('-').map(Number);
            if (max) {
                return discountedPrice >= min && discountedPrice < max;
            }
            return discountedPrice >= min;
        });
    };

    const filterByCategory = (product: ProductProps) => {
        if (cateFilter.length === 0) return true;
        return cateFilter.includes(product.category.toLowerCase());
    };



    const filteredProducts = DUMP_PRODUCTS.filter(product => filterByPrice(product) && filterByCategory(product));
    const currentProducts = filteredProducts.slice(startIndex, endIndex);

    const { isOpen, onOpen, onOpenChange } = useDisclosure();


    const resetFilter = () => {
        setPriceFilter([]);
        setCateFilter([]);
        setFilter([]); // Reset unified filter as well
    };



    return (

        <div>
            <div className="py-5 h-[62px]">
                <BreadcrumbNav
                    items={[
                        { name: 'Trang chủ', link: '/' },
                        { name: 'Sản phẩm', link: '#' },
                    ]}
                />
            </div>


            <div className="flex w-full gap-5 flex-col lg:flex-row mb-10">
                <div className="w-1/4 lg:block hidden sticky top-0">
                    <Accordion selectionMode="multiple" className="px-0" defaultExpandedKeys={["category", "price", "brand"]}>
                        <AccordionItem key="category" indicator={<ChevronLeftIcon />} aria-label="category" className='font-semibold' title="Phân loại sản phẩm">
                            <CheckboxGroup value={cateFilter} onChange={handleCategoryFilterChange}>
                                <Checkbox className='font-medium' value="headphone">Headphone</Checkbox>
                                <Checkbox className='font-medium' value="tv">TV</Checkbox>
                                <Checkbox className='font-medium' value="laptop">Laptop</Checkbox>
                                <Checkbox className='font-medium' value="smartphone">Smart Phone</Checkbox>
                            </CheckboxGroup>
                        </AccordionItem>
                        <AccordionItem key="price" indicator={<ChevronLeftIcon />} aria-label="price" className='font-semibold' title="Giá sản phẩm" >
                            <CheckboxGroup value={priceFilter} onChange={handlePriceFilterChange}>
                                <Checkbox className='font-medium' value="0-99000">0 - 99.000</Checkbox>
                                <Checkbox className='font-medium' value="100000-199000">100.000 - 199.000</Checkbox>
                                <Checkbox className='font-medium' value="200000-299000">200.000 - 299.000</Checkbox>
                                <Checkbox className='font-medium' value="300000-399000">300.000 - 399.000</Checkbox>
                                <Checkbox className='font-medium' value="400000">400.000+</Checkbox>
                            </CheckboxGroup>
                        </AccordionItem>
                        <AccordionItem key="brand" indicator={<ChevronLeftIcon />} aria-label="brand" className='font-semibold' title="Thương hiệu sản phẩm" >
                            <CheckboxGroup value={priceFilter} onChange={handlePriceFilterChange}>
                                <Checkbox className='font-medium' value="0-99000">0 - 99.000</Checkbox>
                                <Checkbox className='font-medium' value="100000-199000">100.000 - 199.000</Checkbox>
                                <Checkbox className='font-medium' value="200000-299000">200.000 - 299.000</Checkbox>
                                <Checkbox className='font-medium' value="300000-399000">300.000 - 399.000</Checkbox>
                                <Checkbox className='font-medium' value="400000">400.000+</Checkbox>
                            </CheckboxGroup>
                        </AccordionItem>
                    </Accordion>



                    <div className='w-full h-[510px] bg-main rounded-lg mt-4 lg:block hidden overflow-hidden'>
                        <img src="/images/bn-12.png" alt="" className='w-full h-full object-cover' />
                    </div>
                </div>
                <div className="flex-1">
                    <div className="h-[80px] lg:h-[80px] lg:block flex lg:items-center flex-col lg:flex-row items-start">
                        <div className="mr-4 mb-2 flex lg:justify-between justify-end items-center w-full gap-2">
                            {filter.length > 0 || priceFilter.length > 0 ? (
                                <div className="flex-1 flex items-center">
                                    <div className="text-base font-normal flex items-center gap-2">
                                        <div>Bộ lọc đã chọn:</div>
                                        <div className="w-auto lg:h-20 hidden h-auto overflow-scroll hidden-scrollbar lg:flex gap-2 items-center" style={{ whiteSpace: 'nowrap' }}>

                                            {/* Price Filters */}
                                            {/* {priceFilter.map((filter) => {
                    const [min, max] = filter.split('-').map((value) => formatVND(parseFloat(value)));
                    return (
                      <Chip
                        key={filter}
                        onClose={() => handleChipClose(filter)}
                        variant="bordered"
                        className="text-base mr-2"
                      >
                        {max ? `${min} - ${max}` : `${min}+`}
                      </Chip>
                    );
                  })} */}

                                            {/* Category Filter Select */}
                                            {filter.length > 3 ? (
                                                <Dropdown>
                                                    <DropdownTrigger>
                                                        <Button variant="bordered" endContent={<KeyboardArrowDownIcon />}>
                                                            {`${filter.length} bộ lọc`}
                                                        </Button>
                                                    </DropdownTrigger>
                                                    <DropdownMenu aria-label="Selected Filters">
                                                        {filter.map((filterItem, index) => (
                                                            <DropdownItem key={index} onClick={() => handleChipClose(filterItem)}>

                                                                <div className="flex items-center justify-between">
                                                                    {filterItem}
                                                                    <CloseIcon fontSize="small" />
                                                                </div>
                                                            </DropdownItem>
                                                        ))}
                                                    </DropdownMenu>
                                                </Dropdown>
                                            ) : (
                                                filter.map((filterItem) => (
                                                    <div
                                                        key={filterItem}
                                                        className="text-base mr-2 flex items-center h-10 px-2 rounded-lg bg-gray-100"
                                                    >
                                                        <button
                                                            onClick={() => handleChipClose(filterItem)}
                                                            className="ml-2 hover:text-red-700"
                                                        >
                                                            {filterItem}
                                                            <CloseIcon fontSize="small" />
                                                        </button>
                                                    </div>
                                                ))
                                            )}


                                            <div className="lg:block hidden">
                                                <Button onClick={resetFilter} variant="bordered">
                                                    Xóa bộ lọc <CloseIcon />
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="w-auto lg:h-20 flex h-auto overflow-scroll hidden-scrollbar lg:hidden gap-2 items-center" style={{ whiteSpace: 'nowrap' }}>

                                            {/* Price Filters */}
                                            {/* {priceFilter.map((filter) => {
                    const [min, max] = filter.split('-').map((value) => formatVND(parseFloat(value)));
                    return (
                      <Chip
                        key={filter}
                        onClose={() => handleChipClose(filter)}
                        variant="bordered"
                        className="text-base mr-2"
                      >
                        {max ? `${min} - ${max}` : `${min}+`}
                      </Chip>
                    );
                  })} */}

                                            {/* Category Filter Select */}
                                            {filter.length > 1 ? (
                                                <Dropdown>
                                                    <DropdownTrigger>
                                                        <Button variant="bordered" endContent={<KeyboardArrowDownIcon />}>
                                                            {`${filter.length} bộ lọc`}
                                                        </Button>
                                                    </DropdownTrigger>
                                                    <DropdownMenu aria-label="Selected Filters">
                                                        {filter.map((filterItem, index) => (
                                                            <DropdownItem key={index} onClick={() => handleChipClose(filterItem)}>

                                                                <div className="flex items-center justify-between">
                                                                    {filterItem}
                                                                    <CloseIcon fontSize="small" />
                                                                </div>
                                                            </DropdownItem>
                                                        ))}
                                                    </DropdownMenu>
                                                </Dropdown>
                                            ) : (
                                                filter.map((filterItem) => (
                                                    <div
                                                        key={filterItem}
                                                        className="text-base mr-2 flex items-center h-10 px-2 rounded-lg bg-gray-100"
                                                    >
                                                        <button
                                                            onClick={() => handleChipClose(filterItem)}
                                                            className="ml-2 hover:text-red-700"
                                                        >
                                                            {filterItem}
                                                            <CloseIcon fontSize="small" />
                                                        </button>
                                                    </div>
                                                ))
                                            )}


                                            <div className="lg:block hidden">
                                                <Button onClick={resetFilter} variant="bordered">
                                                    Xóa bộ lọc <CloseIcon />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div></div>
                            )}

                            <div className="w-[160px] text-right">
                                <Dropdown>
                                    <DropdownTrigger>
                                        <Button variant="bordered" endContent={<KeyboardArrowDownIcon />}>
                                            Sắp xếp theo
                                        </Button>
                                    </DropdownTrigger>
                                    <DropdownMenu variant="faded" aria-label="Static Actions">
                                        <DropdownItem key="new">Giá thấp đến cao</DropdownItem>
                                        <DropdownItem key="copy">Giá cao đến thấp</DropdownItem>
                                        <DropdownItem key="edit">Khuyến mãi nhiều</DropdownItem>
                                        <DropdownItem key="edit">Sản phẩm bán chạy</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </div>

                            <div className="lg:hidden block">
                                <div className="flex items-center">
                                    <div>Lọc:</div>
                                    <Button onPress={onOpen} className="bg-transparent px-0 min-w-0">
                                        <FilterAltOutlinedIcon />
                                    </Button>
                                </div>

                                <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                                    <ModalContent className="z-50">
                                        {(onClose) => (
                                            <>
                                                <ModalHeader className="flex flex-col gap-1">Lọc</ModalHeader>
                                                <ModalBody>
                                                    <Accordion selectionMode="multiple" className="px-0" defaultExpandedKeys={["category", "price"]}>
                                                        <AccordionItem key="price" indicator={<ChevronLeftIcon />} aria-label="Price" title="Price">
                                                            <CheckboxGroup value={priceFilter} onChange={handlePriceFilterChange}>
                                                                <Checkbox value="0-99000">0 - 99.000</Checkbox>
                                                                <Checkbox value="100000-199000">100.000 - 199.000</Checkbox>
                                                                <Checkbox value="200000-299000">200.000 - 299.000</Checkbox>
                                                                <Checkbox value="300000-399000">300.000 - 399.000</Checkbox>
                                                                <Checkbox value="400000">400.000 +</Checkbox>
                                                            </CheckboxGroup>
                                                        </AccordionItem>
                                                        <AccordionItem key="category" indicator={<ChevronLeftIcon />} aria-label="Category" title="Category">
                                                            <CheckboxGroup value={cateFilter} onChange={handleCategoryFilterChange}>
                                                                <Checkbox value="headphone">Headphone</Checkbox>
                                                                <Checkbox value="tv">TV</Checkbox>
                                                                <Checkbox value="laptop">Laptop</Checkbox>
                                                                <Checkbox value="smartphone">Smart Phone</Checkbox>
                                                            </CheckboxGroup>
                                                        </AccordionItem>
                                                    </Accordion>
                                                </ModalBody>
                                            </>
                                        )}
                                    </ModalContent>
                                </Modal>
                            </div>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 grid-cols-2 gap-2">
                        {currentProducts.length > 0 ? (
                            currentProducts.map((product) => <BoxProduct key={product.id} product={product} />)
                        ) : (
                            <div className="flex items-center justify-center col-span-3">
                                Không tìm thấy sản phẩm nào phù hợp với yêu cầu của bạn.
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            <div className="flex justify-end w-full">
                <CustomPagination
                    totalItems={filteredProducts.length}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={(page: number) => setCurrentPage(page)}
                />
            </div>

        </div>
    );
}

export default BodyShop;
