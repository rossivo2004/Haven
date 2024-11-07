// src/components/BodyShop.tsx
'use client';
import './style.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

import { Accordion, AccordionItem, CheckboxGroup, Checkbox, Modal, ModalContent, ModalHeader, ModalBody, Button, useDisclosure, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { Slider } from '@mui/material'

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
    const initialDisplayCount = 6; // Set initial display count to 6
    const [displayCount, setDisplayCount] = useState<number>(initialDisplayCount); // State for number of products to display
    const router = useRouter();
    // const [currentPage, setCurrentPage] = useState<number>(1);
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

    const [priceRange, setPriceRange] = useState<number[]>([0, 1000000]);

    const fetchProduct = useCallback(async () => {
        setLoading(true); // Start loading
        try {
            const params = new URLSearchParams();
            cateFilter.forEach(category => params.append('category[]', category)); // Add selected categories to params
            brandFilter.forEach(brand => params.append('brand[]', brand)); // Add selected brands to params
            params.append('priceRanges[]', `${priceRange[0]}-${priceRange[1]}`); // Add price range to params

            const response = await axios.get(`${apiConfig.products.getallproductvariants}?${params.toString()}`, { withCredentials: true });

            setVariants(response.data.productvariants.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false); // End loading
        }
    }, [cateFilter, brandFilter, priceRange]);

    const fetchCategory = async () => {
        try {
            const response = await axios.get(apiConfig.categories.getAll, { withCredentials: true });
            setCategories(response.data.categories.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchBrand = async () => {
        try {
            const response = await axios.get(apiConfig.brands.getAll, { withCredentials: true });
            setBrands(response.data.brands.data);
        } catch (error) {
            console.error('Error fetching brands:', error);
        }
    };

    useEffect(() => {
        fetchCategory();
        fetchBrand();
        fetchProduct();
    }, [filter]);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const prices = params.getAll('price');
        const categories = params.getAll('category[]');
        const brands = params.getAll('brand[]'); // Get brand parameters from URL

        setPriceFilter(prices);
        setCateFilter(categories);
        setBrandFilter(brands); // Update state for brand filter
        const sort = params.get('sort');
        setSortOrder(sort || '');

        // Set priceRange based on URL parameters if available
        const priceRangeParam = prices.length > 0 ? prices[0].split('-').map(Number) : [0, 1000000];
        setPriceRange(priceRangeParam);
    }, []);

    useEffect(() => {
        const combinedFilter = [...priceFilter, ...cateFilter, ...brandFilter]; // Include price filter
        setFilter(combinedFilter);

        const params = new URLSearchParams();
        if (priceFilter.length > 0) priceFilter.forEach(value => params.append('price', value)); // Add price filter to params
        if (cateFilter.length > 0) cateFilter.forEach(value => params.append('category[]', value)); // Ensure correct parameter name
        if (brandFilter.length > 0) brandFilter.forEach(value => params.append('brand[]', value)); // Ensure correct parameter name

        // Only add sortOrder to URL if it's not empty
        if (sortOrder) params.set('sort', sortOrder);

        // params.set('page', currentPage.toString());
        router.push(`?${params.toString()}`, { scroll: false });

        fetchProduct(); // Fetch products after updating filters and sorting
    }, [priceFilter, cateFilter, brandFilter, router, sortOrder]);

    const handlePriceFilterChange = (values: string[]) => {
        setPriceFilter(values);
        // setCurrentPage(1);
    };

    const handleCategoryFilterChange = (values: string[]) => {
        setCateFilter(values);
        // setCurrentPage(1);
    };

    const handleBrandFilterChange = (values: string[]) => {
        setBrandFilter(values);
        // setCurrentPage(1);
    };

    const handleChipClose = (filterItem: string) => {
        if (priceFilter.includes(filterItem)) {
            setPriceFilter(prev => prev.filter(item => item !== filterItem));
        } else if (cateFilter.includes(filterItem)) {
            setCateFilter(prev => prev.filter(item => item !== filterItem));
        } else {
            setBrandFilter(prev => prev.filter(item => item !== filterItem));
        }
        // setCurrentPage(1);
    };

    const resetFilter = () => {
        setPriceFilter([]);
        setCateFilter([]);
        setBrandFilter([]); // Ensure brand filter is also reset
        setFilter([]); // Reset unified filter as well
    };

    function handleSort(order: string) {
        setSortOrder(order); // Set the sort order state
        if (order === 'low-to-high') {
            setVariants(prev => [...prev].sort((a, b) => Math.min(a.DiscountedPrice || 0, a.FlashSalePrice || 0) - Math.min(b.DiscountedPrice || 0, b.FlashSalePrice || 0)));
        } else if (order === 'high-to-low') {
            setVariants(prev => [...prev].sort((a, b) => Math.min(b.DiscountedPrice || 0, b.FlashSalePrice || 0) - Math.min(a.DiscountedPrice || 0, a.FlashSalePrice || 0)));
        }
    }

    const handlePriceRangeChange = (event: Event, value: number | number[], activeThumb: number) => {
        if (Array.isArray(value)) {
            setPriceRange(value);
        }
        // setCurrentPage(1); // Reset to first page on filter change
    };

    const handleLoadMore = () => {
        setDisplayCount(prevCount => prevCount + itemsPerPage); // Increase the display count
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
                                    <Checkbox className='font-medium' value={item.name} key={index}>{item.name}</Checkbox>
                                ))}
                            </CheckboxGroup>
                        </AccordionItem>

                        <AccordionItem
                            key="brand"
                            indicator={<ChevronLeftIcon />}
                            aria-label="brand"
                            title="Thương hiệu sản phẩm"
                        >
                            <CheckboxGroup value={brandFilter} onChange={handleBrandFilterChange}>
                                {brands.map((item, index) => (
                                    <Checkbox className='font-medium' value={item.name} key={index}>{item.name}</Checkbox>
                                ))}
                            </CheckboxGroup>
                        </AccordionItem>

                        <AccordionItem
                            key="price"
                            indicator={<ChevronLeftIcon />}
                            aria-label="price"
                            title="Lọc theo giá"
                        >
                            <div className="my-4">
                                {/* <div className="text-lg dark:text-white">Lọc theo giá:</div> */}
                                <Slider
                                    value={priceRange}
                                    onChange={handlePriceRangeChange}
                                    valueLabelDisplay="auto"
                                    min={0}
                                    max={500000}
                                    step={10000}
                                />
                                <div className="flex justify-between mb-2 dark:text-white">
                                    <span className='dark:text-white'>{priceRange[0].toLocaleString()}đ</span>
                                    <span className='dark:text-white'>{priceRange[1].toLocaleString()}đ</span>
                                </div>
                                <Button onClick={() => handlePriceFilterChange([`${priceRange[0]}-${priceRange[1]}`])} variant="bordered">
                                    Áp dụng bộ lọc
                                </Button>
                            </div>
                        </AccordionItem>
                    </Accordion>
                </div>

                {/* Product Listing */}
                <div className="flex-1 relative">
                    <div className="h-[80px] lg:h-[80px] lg:block flex lg:items-center flex-col lg:flex-row items-start sticky lg:top-[120px] top-[0px] dark:bg-black bg-white z-20">
                        <div className="mr-4 mb-2 flex lg:justify-between justify-end items-center h-full w-full gap-2">
                            {filter.length > 0 || priceFilter.length > 0 ? (
                                <div className="flex-1 flex items-center">
                                    <div className="text-base font-normal flex items-center gap-2">
                                        <div className='dark:text-white'>Bộ lọc đã chọn:</div>
                                        {([...Array.from(new Set([...priceFilter, ...filter]))].length > 3) ? (
                                            <Dropdown>
                                                <DropdownTrigger>
                                                    <Button variant="bordered">
                                                        {`+${([...Array.from(new Set([...priceFilter, ...filter]))].length)} bộ lọc`}
                                                    </Button>
                                                </DropdownTrigger>
                                                <DropdownMenu variant="faded" aria-label="More Filters" className='dark:text-white'>
                                                    {[...Array.from(new Set([...priceFilter, ...filter]))].map((filterItem) => (
                                                        <DropdownItem key={filterItem} onClick={() => handleChipClose(filterItem)}>
                                                            {filterItem} <CloseIcon fontSize="small" />
                                                        </DropdownItem>
                                                    ))}
                                                </DropdownMenu>
                                            </Dropdown>
                                        ) : (
                                            <div className="w-auto lg:h-20 hidden h-auto overflow-scroll hidden-scrollbar lg:flex gap-2 items-center" style={{ whiteSpace: 'nowrap' }}>
                                                {/* Display selected filters as chips */}
                                                {[...Array.from(new Set([...priceFilter, ...filter]))].map((filterItem) => (
                                                    <div key={filterItem} className="text-base mr-2 flex items-center h-10 px-2 rounded-lg bg-gray-100">
                                                        <button onClick={() => handleChipClose(filterItem)} className="ml-2 hover:text-red-700">
                                                            {filterItem} {/* Display selected filter */}
                                                            <CloseIcon fontSize="small" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        <div className="lg:block hidden">
                                            <Button onClick={resetFilter} variant="bordered">
                                                Xóa bộ lọc <CloseIcon />
                                            </Button>
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
                                    <Checkbox className='font-medium' value={item.name} key={index}>{item.name}</Checkbox>
                                ))}
                            </CheckboxGroup>
                        </AccordionItem>

                        <AccordionItem
                            key="brand"
                            indicator={<ChevronLeftIcon />}
                            aria-label="brand"
                            title="Thương hiệu sản phẩm"
                        >
                            <CheckboxGroup value={brandFilter} onChange={handleBrandFilterChange}>
                                {brands.map((item, index) => (
                                    <Checkbox className='font-medium' value={item.name} key={index}>{item.name}</Checkbox>
                                ))}
                            </CheckboxGroup>
                        </AccordionItem>

                        <AccordionItem
                            key="price"
                            indicator={<ChevronLeftIcon />}
                            aria-label="price"
                            title="Lọc theo giá"
                        >
                            <div className="my-4">
                                <div className="text-lg">Lọc theo giá:</div>
                                <Slider
                                    value={priceRange}
                                    onChange={handlePriceRangeChange}
                                    valueLabelDisplay="auto"
                                    min={0}
                                    max={500000}
                                    step={10000}
                                />
                                <div className="flex justify-between mb-2">
                                    <span>{priceRange[0].toLocaleString()}đ</span>
                                    <span>{priceRange[1].toLocaleString()}đ</span>
                                </div>
                                <Button onClick={() => handlePriceFilterChange([`${priceRange[0]}-${priceRange[1]}`])} variant="bordered">
                                    Áp dụng bộ lọc
                                </Button>
                            </div>
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
                        </div>
                    ) : variants.length === 0 ? (
                        <div className='h-[380px] flex justify-center items-center'>
                            <p className='text-lg'>Không có sản phẩm</p>
                        </div>
                    ) : (
                        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-2 gap-4 mt-4">
                            {variants.slice(0, displayCount).map((product: Variant, index: number) => (
                                <BoxProduct key={`${product.product_id}-${index}`} product={product} />
                            ))}
                        </div>
                    )}

                    {/* Load More Button */}
                    {displayCount < variants.length && (
                        <div className="flex justify-center mt-4">
                            <Button onClick={handleLoadMore} variant="bordered">
                                Xem thêm
                            </Button>
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