// src/components/BodyShop.tsx
'use client';
import './style.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { Accordion, AccordionItem, CheckboxGroup, Checkbox, Modal, ModalContent, ModalHeader, ModalBody, Button, useDisclosure, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";

import BreadcrumbNav from '../Breadcrum';
import BoxProduct from '../BoxProduct';
import CustomPagination from '../Pagination';

import { SingleProduct } from '@/src/interface';

import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CloseIcon from '@mui/icons-material/Close';

import apiConfig from '@/src/config/api';
import axios from 'axios';

import { Variant, Brand, Category } from '@/src/interface';

import Loading from '../ui/Loading';

function BodyShop() {
    const itemsPerPage = 12;
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [priceFilter, setPriceFilter] = useState<string[]>([]);
    const [cateFilter, setCateFilter] = useState<string[]>([]);
    const [brandFilter, setBrandFilter] = useState<string[]>([]); // Update state for brand filter

    const [filter, setFilter] = useState<string[]>([]);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const [variants, setVariants] = useState<Variant[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [sortOrder, setSortOrder] = useState<string>(''); // Add state for sort order
    const [loading, setLoading] = useState<boolean>(false);

    const fetchProduct = async () => {
        setLoading(true); // Start loading
        try {
            const params = new URLSearchParams();
            cateFilter.forEach(category => params.append('category[]', category)); // Add selected categories to params
            brandFilter.forEach(brand => params.append('brand[]', brand)); // Add selected brands to params

            const response = await axios.get(`${apiConfig.products.getallproductvariants}?${params.toString()}`, { withCredentials: true });

            setVariants(response.data.productvariants.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false); // End loading
        }
    };

    const fetchCategory = async () => {
        try {
            const response = await axios.get(apiConfig.categories.getAll, { withCredentials: true });

            setCategories(response.data.categories.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
        }
    };

    const fecthBrand = async () => {
        try {
            const response = await axios.get(apiConfig.brands.getAll, { withCredentials: true });

            setBrands(response.data.brands.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
        }
    };

    useEffect(() => {
        fetchCategory();
        fecthBrand()
        fetchProduct()
    }, [filter])

    console.log(variants);


    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const page = parseInt(params.get('page') || '1', 10);
        const prices = params.getAll('price');
        const categories = params.getAll('category[]'); // Đảm bảo sử dụng đúng tên tham số

        setCurrentPage(page);
        setPriceFilter(prices);
        setCateFilter(categories);
        const sort = params.get('sort'); // Lấy tham số sort từ URL
        setSortOrder(sort || ''); // Khôi phục sortOrder từ URL
    }, []);


    useEffect(() => {
        const combinedFilter = [...priceFilter, ...cateFilter, ...brandFilter]; // Include brand filter
        setFilter(combinedFilter);

        const params = new URLSearchParams();
        if (priceFilter.length > 0) priceFilter.forEach(value => params.append('price', value));
        if (cateFilter.length > 0) cateFilter.forEach(value => params.append('category[]', value)); // Ensure correct parameter name
        if (brandFilter.length > 0) brandFilter.forEach(value => params.append('brand[]', value)); // Ensure correct parameter name

        // Only add sortOrder to URL if it's not empty
        if (sortOrder) params.set('sort', sortOrder);

        params.set('page', currentPage.toString());
        router.push(`?${params.toString()}`, { scroll: false });
    }, [priceFilter, cateFilter, brandFilter, currentPage, router, sortOrder]); // Add brandFilter to dependencies


    const handlePriceFilterChange = (values: string[]) => {
        setPriceFilter(values);
        setCurrentPage(1);
    };

    const handleCategoryFilterChange = (values: string[]) => {
        setCateFilter(values);
        setCurrentPage(1);
    };

    const handleBrandFilterChange = (values: string[]) => {
        setBrandFilter(values);
        setCurrentPage(1);
    };

    const handleChipClose = (filterItem: string) => {
        if (priceFilter.includes(filterItem)) {
            setPriceFilter(prev => prev.filter(item => item !== filterItem));
        } else {
            setCateFilter(prev => prev.filter(item => item !== filterItem));
        }
        setCurrentPage(1);
    };

    const resetFilter = () => {
        setPriceFilter([]);
        setCateFilter([]);
        setFilter([]); // Reset unified filter as well
    };

    const handleSort = (order: string) => {
        setSortOrder(order); // Set the sort order state
        if (order === 'low-to-high') {
            setVariants(prev => [...prev].sort((a, b) => a.price - b.price));
        } else if (order === 'high-to-low') {
            setVariants(prev => [...prev].sort((a, b) => b.price - a.price));
        }
    };



    // Slice for pagination

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

            <div className="flex w-full gap-5 flex-col lg:flex-row mb-10 sticky top-0">
                {/* Sidebar Filter */}
                <div className="w-full lg:w-1/4 hidden lg:block">
                    <Accordion
                        selectionMode="multiple"
                        className="px-0 sticky top-[130px]"
                        defaultExpandedKeys={["category", "price", "brand"]}
                    >
                        <AccordionItem
                            key="category"
                            indicator={<ChevronLeftIcon />}
                            aria-label="category"
                            title="Phân loại sản phẩm"
                        >
                            <CheckboxGroup value={cateFilter} onChange={handleCategoryFilterChange}>
                                {categories.map((item, index) => (
                                    <Checkbox className='font-medium' value={item.name}>{item.name}</Checkbox>
                                ))}
                            </CheckboxGroup>
                        </AccordionItem>

                        <AccordionItem
                            key="brand"
                            indicator={<ChevronLeftIcon />}
                            aria-label="brand"
                            title="Thương hiệu sản phẩm"
                        >
                            <CheckboxGroup value={brandFilter} onChange={handleBrandFilterChange}> {/* Update to use brandFilter */}
                                {brands.map((item, index) => (
                                    <Checkbox className='font-medium' value={item.name}>{item.name}</Checkbox>
                                ))}
                            </CheckboxGroup>
                        </AccordionItem>

                        {/* <AccordionItem
                            key="brands"
                            indicator={<ChevronLeftIcon />}
                            aria-label="brands"
                            title="Thương hiệu sản phẩm"
                        >
                            <CheckboxGroup value={priceFilter} onChange={handlePriceFilterChange}>
                                {brands.map((item, index) => (
                                    <Checkbox className='font-medium' value={item.tag}>{item.name}</Checkbox>
                                ))}
                            </CheckboxGroup>
                        </AccordionItem> */}
                    </Accordion>
                </div>


                {/* Product Listing */}
                <div className="flex-1 relative">
                    <div className="h-[80px] lg:h-[80px] lg:block flex lg:items-center flex-col lg:flex-row items-start sticky top-[120px] dark:bg-black bg-white z-20">
                        <div className="mr-4 mb-2 flex lg:justify-between justify-end items-center h-full w-full gap-2">
                            {filter.length > 0 || priceFilter.length > 0 ? (
                                <div className="flex-1 flex items-center">
                                    <div className="text-base font-normal flex items-center gap-2">
                                        <div className='dark:text-white'>Bộ lọc đã chọn:</div>
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
                                                <Dropdown className='dark:text-white'>
                                                    <DropdownTrigger>
                                                        <Button variant="bordered" endContent={<KeyboardArrowDownIcon />}>
                                                            {`${filter.length} bộ lọc`}
                                                        </Button>
                                                    </DropdownTrigger>
                                                    <DropdownMenu aria-label="Selected Filters" disallowEmptySelection closeOnSelect={false}>
                                                        {filter.map((filterItem, index) => (
                                                            <DropdownItem key={index} onClick={() => handleChipClose(filterItem)}>
                                                                <div className="flex items-center justify-between">
                                                                    {/* Update to show category name instead of ID */}
                                                                    {categories.find(category => category.id === filterItem)?.name || filterItem}
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
                                                            {/* Update to show category name instead of ID */}
                                                            {categories.find(category => category.id === filterItem)?.name || filterItem}
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

                            <div className="w-[160px] text-right dark:text-white">
                                <Dropdown>
                                    <DropdownTrigger>
                                        <Button variant="bordered" endContent={<KeyboardArrowDownIcon />}>
                                            Sắp xếp theo
                                        </Button>
                                    </DropdownTrigger>
                                    <DropdownMenu variant="faded" aria-label="Static Actions" className='dark:text-white'>
                                        <DropdownItem key="low-to-high" onClick={() => handleSort('low-to-high')}>Giá thấp đến cao</DropdownItem>
                                        <DropdownItem key="high-to-low" onClick={() => handleSort('high-to-low')}>Giá cao đến thấp</DropdownItem>
                                        <DropdownItem key="promotion">Khuyến mãi nhiều</DropdownItem>
                                        <DropdownItem key="best-seller">Sản phẩm bán chạy</DropdownItem>
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

                    {/* Product Grid */}
                    {loading ? (
                        <div className='h-[380px] flex justify-center items-center'>
                            <Loading />
                        </div> // Show loading indicator
                    ) : (
                        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-2 gap-4 mt-4">
                            {variants.map((product: Variant) => (
                                <BoxProduct key={String(product.product_id)} product={product} />
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    <div className="flex justify-end mt-8">
                        {/* <CustomPagination
                            currentPage={currentPage}
                            totalItems={flatProducts.length} // Update this to total items
                            itemsPerPage={itemsPerPage}
                            onPageChange={setCurrentPage}
                        /> */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BodyShop;
