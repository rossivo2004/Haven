'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Brand, Category, Product, ProductVa } from '@/interface';
import { toast } from "react-toastify";
import { Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, image } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/react";
import { Textarea } from "@nextui-org/input";
import apiConfig from "@/configs/api";
import { Spinner } from "@nextui-org/react"; // Optional: if you want a spinner
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@nextui-org/table";
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import Image from 'next/image';
import { Pagination } from "@nextui-org/react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

import { EditIcon } from "./EditIcon";
import { DeleteIcon } from "./DeleteIcon";
import { EyeIcon } from "./EyeIcon";

interface Variant {
    name: string;
    price: string;
    stock: string;
    variantValue: string;
    discount: string;
    image: File[];
}

const CreateProduct = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [variants, setVariants] = useState<Variant[]>([]);

    const [pagination, setPagination] = useState({
        last_page: 1,  // Default value for total pages
        current_page: 1 // Default value for current page
    });
    const [products, setProducts] = useState<Product[]>([]);
    const [productsVa, setProductsVa] = useState<ProductVa[]>([]);
    const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const { isOpen, onOpen, onClose } = useDisclosure(); // Modal control
    const [showVariantForm, setShowVariantForm] = useState(false); // Control variant form visibility
    const [loading, setLoading] = useState(false); // Loading state
    const [loadingProducts, setLoadingProducts] = useState(false); // Loading state for products

    // Error state for main product fields
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleAddVariant = () => {
        setVariants([...variants, { name: '', price: '', stock: '', variantValue: '', discount: '', image: [] }]);
        setShowVariantForm(true);  // Show the variant form when adding a variant
    };

    const handleChangeVariant = (index: number, field: keyof Variant, value: any) => {
        const updatedVariants = variants.map((variant, i) => {
            if (i === index) {
                if (field === 'image' && value instanceof FileList) {
                    return { ...variant, [field]: Array.from(value) };
                }
                return { ...variant, [field]: value };
            }
            return variant;
        });
        setVariants(updatedVariants);
    };

    const handleDelete = (Id: number) => {
        const productToDelete = products.find(product => product.id === Id);

        if (!productToDelete) {
            toast.error('Không tìm thấy sản phẩm để xóa');
            return;
        }

        confirmAlert({
            title: 'Xóa phân loại',
            message: `Bạn có muốn xóa phân loại ${productToDelete.name}?`,
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        setLoading(true);
                        try {
                            await axios.delete(`${apiConfig.products.deletePr}${Id}`);
                            fetchProducts(); // Refresh categories after deletion
                            toast.success('Xóa sản phẩm thành công');


                        } catch (error) {
                            console.error('Error deleting category:', error);
                            toast.error('Error deleting category');
                        } finally {
                            setLoading(false);
                        }
                    }
                },
                {
                    label: 'No',
                }
            ]
        });
    };

    // Validation function
    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        const mainProductName = (document.getElementById('name_product') as HTMLInputElement)?.value;
        const mainProductDescription = (document.getElementById('description') as HTMLTextAreaElement)?.value;
        const mainProductImages = (document.getElementById('image') as HTMLInputElement)?.files;

        // Main product validation
        if (!mainProductName) newErrors.name_product = "Product name is required.";
        if (!mainProductDescription) newErrors.description = "Product description is required.";
        if (!mainProductImages || mainProductImages.length === 0) newErrors.image = "At least one product image is required.";

        // Variant validation
        variants.forEach((variant, index) => {
            if (!variant.name) newErrors[`name_${index}`] = "Variant name is required.";
            if (!variant.price) newErrors[`price_${index}`] = "Price is required.";
            if (!variant.stock) newErrors[`stock_${index}`] = "Stock is required.";
            if (!variant.variantValue) newErrors[`variantValue_${index}`] = "Variant value is required.";
            if (variant.image.length === 0) newErrors[`image_${index}`] = "At least one image for this variant is required."; // Check for variant image
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Return true if no errors
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validate the form
        if (!validateForm()) return; // Exit if validation fails

        setLoading(true); // Start loading

        const formElement = e.currentTarget as HTMLFormElement;
        const formData = new FormData(formElement);

        const mainImages = (formElement.querySelector('#image') as HTMLInputElement).files;
        if (mainImages) {
            Array.from(mainImages).forEach((image) => {
                formData.append('images[]', image);
            });
        }

        variants.forEach((variant, index) => {
            if (variant.image.length > 0) {
                variant.image.forEach((image) => {
                    formData.append(`variants[${index}][image][]`, image);
                });
            }
            formData.append(`variants[${index}][name]`, variant.name);
            formData.append(`variants[${index}][price]`, variant.price);
            formData.append(`variants[${index}][stock]`, variant.stock);
            formData.append(`variants[${index}][variant_value]`, variant.variantValue);
            formData.append(`variants[${index}][discount]`, variant.discount);
        });

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/product/store', formData, {
                headers: { accept: 'application/json' },
            });
            console.log('Response:', response.data);
            toast.success('Thêm sản phẩm thành công');
            setShowVariantForm(false)
            setVariants([])
            onClose();

        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('Thêm sản phẩm thất bại');
        } finally {
            setLoading(false); // Stop loading
        }
    };

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        setLoading(true); // Start loading

        const formElement = e.currentTarget as HTMLFormElement;
        const formData = new FormData(formElement);

        const mainImages = (formElement.querySelector('#image') as HTMLInputElement).files;
        if (mainImages) {
            Array.from(mainImages).forEach((image) => {
                formData.append('images[]', image);
            });
        }

        variants.forEach((variant, index) => {
            if (variant.image.length > 0) {
                variant.image.forEach((image) => {
                    formData.append(`variants[${index}][image][]`, image);
                });
            }
            formData.append(`variants[${index}][name]`, variant.name);
            formData.append(`variants[${index}][price]`, variant.price);
            formData.append(`variants[${index}][stock]`, variant.stock);
            formData.append(`variants[${index}][variant_value]`, variant.variantValue);
            formData.append(`variants[${index}][discount]`, variant.discount);
        });

        try {
            const response = await axios.put('http://127.0.0.1:8000/api/product/update/', formData, {
                headers: { accept: 'application/json' },
            });
            console.log('Response:', response.data);
            toast.success('Thêm sản phẩm thành công');
            setShowVariantForm(false)
            setVariants([])
            onClose();

        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('Thêm sản phẩm thất bại');
        } finally {
            setLoading(false); // Stop loading
        }
    }

    const fetchCategories = async () => {
        try {
            const response = await axios.get(apiConfig.categories.getAll, { withCredentials: true });
            setCategories(response.data.categories.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
        }
    };

    const fetchBrands = async () => {
        try {
            const response = await axios.get(apiConfig.brands.getAll, { withCredentials: true });
            setBrands(response.data.brands.data);
        } catch (error) {
            console.error('Error fetching brands:', error);
        } finally {
        }
    };

    const fetchProducts = async (page = 1) => {
        setLoadingProducts(true); // Start loading
        try {
            const response = await axios.get(`${apiConfig.products.getAll}?page=${page}`, { withCredentials: true });
            setProducts(response.data.products.data);
            setPagination(response.data.products); // Update pagination data
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoadingProducts(false); // Stop loading
        }
    };

    const fetchProductsVa = async (id: number) => {
        // setLoadingProducts(true); // Start loading
        try {
            const response = await axios.get(`${apiConfig.products.getproductvariants}${id}`, { withCredentials: true });
            setProductsVa(response.data.productVariants.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            // setLoadingProducts(false); // Stop loading
        }
    };

    const fetchPagination = async () => {
        try {
            const response = await axios.get(apiConfig.products.getAll, { withCredentials: true });
            setPagination(response.data.products);
        } catch (error) {
            console.error('Error fetching brands:', error);
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchBrands();
        fetchProducts();
        fetchPagination();
    }, []);

    const clo = () => {
        onClose();
        setVariants([])

    }

    const handleOpenEditProductModal = (product: Product) => {
        setSelectedProduct(product); // Store the entire selected product
        setIsAddCategoryModalOpen(true); // Open the modal
    };

    const handleCloseEditProductModal = () => {
        setIsAddCategoryModalOpen(false);
        setSelectedProduct(null); // Clear selected product when closing the modal
    };

    useEffect(() => {
        if (selectedProduct) {
            fetchProductsVa(selectedProduct.id); // Now it's guaranteed to be a number
        }
    }, [selectedProduct]);

  

console.log(productsVa);


    return (
        <div className="p-4">
            {/* {loading && <Spinner />} */}
            <div className='flex justify-between mb-4'>
                <div className='font-semibold text-xl'>
                    Thêm sản phẩm
                </div>
                <div className='flex items-center gap-2'>
                    <Button color="primary" onPress={onOpen}>
                        Create Product
                    </Button>
                    {/* <div>
                        aaaa
                    </div> */}
                </div>
            </div>


            <Modal isOpen={isOpen} onClose={clo} closeButton size='5xl'>
                <ModalContent>
                    <ModalHeader>Create Product</ModalHeader>
                    <ModalBody className='!max-h-[70vh] overflow-y-auto'>
                        <form onSubmit={handleSubmit} encType="multipart/form-data">
                            <div>
                                <h1 className="text-xl font-semibold mb-4">Main Product</h1>
                                <div className="mb-4">
                                    <label htmlFor="name_product" className="block text-sm font-medium text-gray-700">
                                        Name Product
                                    </label>
                                    <Input
                                        type="text"
                                        id="name_product"
                                        name="name_product"
                                        required
                                        placeholder='Tên sản phẩm'
                                        className={errors.name_product ? 'border-red-500' : ''}
                                    />
                                    {errors.name_product && <p className="text-red-500 text-sm">{errors.name_product}</p>}
                                </div>

                                <div className='flex gap-5'>
                                    {/* Categories */}
                                    <div className="mb-4 flex-1">
                                        <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">
                                            Category ID
                                        </label>
                                        <Select
                                            aria-label="Chọn một tùy chọn"
                                            name="category_id"
                                            required
                                            placeholder='Phân loại sản phẩm'
                                        >
                                            {categories.length > 0 ? (
                                                categories.map((category) => (
                                                    <SelectItem key={category.id} value={category.id}>
                                                        {category.name}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <SelectItem key={""} value="">No categories available</SelectItem>
                                            )}
                                        </Select>
                                    </div>

                                    {/* Brands */}
                                    <div className="mb-4 flex-1">
                                        <label htmlFor="brand_id" className="block text-sm font-medium text-gray-700">
                                            Brand ID
                                        </label>
                                        <Select
                                            aria-label="Chọn một tùy chọn"
                                            name="brand_id"
                                            required
                                            placeholder='Thương hiệu sản phẩm'
                                        >
                                            {brands.length > 0 ? (
                                                brands.map((brand) => (
                                                    <SelectItem key={brand.id} value={brand.id}>
                                                        {brand.name}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <SelectItem key={""} value="">No brands available</SelectItem>
                                            )}
                                        </Select>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                        Description
                                    </label>
                                    <Textarea
                                        placeholder='Mô tả sản phẩm'
                                        id="description"
                                        name="description"
                                        rows={3}
                                        className={errors.description ? 'border-red-500' : ''}
                                    ></Textarea>
                                    {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                                </div>

                                <div>

                                </div>

                                <div className="mb-4">
                                    <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                                        Upload Image
                                    </label>
                                    <Input
                                        type="file"
                                        id="image"
                                        name="image[]"
                                        multiple
                                        required
                                        className={errors.image ? 'border-red-500' : ''}
                                    />
                                    {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}
                                </div>
                            </div>

                            <div id="variants" className="mb-8">
                                <h4 className="text-lg font-semibold mb-4">Add Variants</h4>

                                {!showVariantForm && (
                                    <button
                                        type="button"
                                        onClick={handleAddVariant}
                                        className="bg-indigo-600 text-white rounded-md px-4 py-2"
                                    >
                                        Add Variant
                                    </button>
                                )}

                                {showVariantForm && variants.map((variant, index) => (
                                    <div className="mb-4 border-b pb-4" key={index}>
                                        <div className="mb-4">
                                            <label htmlFor={`name_${index}`} className="block text-sm font-medium text-gray-700">
                                                Name Product Variant
                                            </label>
                                            <Input
                                                placeholder='Tên sản phẩm'
                                                type="text"
                                                id={`name_${index}`}
                                                name={`name[${index}]`}
                                                value={variant.name}
                                                onChange={(e) => handleChangeVariant(index, 'name', e.target.value)}
                                                required
                                                className={errors[`name_${index}`] ? 'border-red-500' : ''}
                                            />
                                            {errors[`name_${index}`] && <p className="text-red-500 text-sm">{errors[`name_${index}`]}</p>}
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor={`price_${index}`} className="block text-sm font-medium text-gray-700">
                                                Price
                                            </label>
                                            <Input
                                                placeholder='Giá sản phẩm'
                                                type="number"
                                                id={`price_${index}`}
                                                name={`price[${index}]`}
                                                value={variant.price}
                                                onChange={(e) => handleChangeVariant(index, 'price', e.target.value)}
                                                required
                                                className={errors[`price_${index}`] ? 'border-red-500' : ''}
                                            />
                                            {errors[`price_${index}`] && <p className="text-red-500 text-sm">{errors[`price_${index}`]}</p>}
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor={`stock_${index}`} className="block text-sm font-medium text-gray-700">
                                                Stock
                                            </label>
                                            <Input
                                                placeholder='Số lượng'
                                                type="number"
                                                id={`stock_${index}`}
                                                name={`stock[${index}]`}
                                                value={variant.stock}
                                                onChange={(e) => handleChangeVariant(index, 'stock', e.target.value)}
                                                required
                                                className={errors[`stock_${index}`] ? 'border-red-500' : ''}
                                            />
                                            {errors[`stock_${index}`] && <p className="text-red-500 text-sm">{errors[`stock_${index}`]}</p>}
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor={`variantValue_${index}`} className="block text-sm font-medium text-gray-700">
                                                Variant Value
                                            </label>
                                            <Input
                                                placeholder='Giá trị biến thể'
                                                type="text"
                                                id={`variantValue_${index}`}
                                                name={`variant_value[${index}]`}
                                                value={variant.variantValue}
                                                onChange={(e) => handleChangeVariant(index, 'variantValue', e.target.value)}
                                                required
                                                className={errors[`variantValue_${index}`] ? 'border-red-500' : ''}
                                            />
                                            {errors[`variantValue_${index}`] && <p className="text-red-500 text-sm">{errors[`variantValue_${index}`]}</p>}
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor={`discount_${index}`} className="block text-sm font-medium text-gray-700">
                                                Discount
                                            </label>
                                            <Input
                                                placeholder='Giảm giá (%)'
                                                type="number"
                                                id={`discount_${index}`}
                                                name={`discount[${index}]`}
                                                value={variant.discount}
                                                onChange={(e) => handleChangeVariant(index, 'discount', e.target.value)}
                                                className={errors[`discount_${index}`] ? 'border-red-500' : ''}
                                            />
                                            {errors[`discount_${index}`] && <p className="text-red-500 text-sm">{errors[`discount_${index}`]}</p>}
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor={`image_${index}`} className="block text-sm font-medium text-gray-700">
                                                Upload Variant Image
                                            </label>
                                            <Input
                                                type="file"
                                                id={`image_${index}`}
                                                name={`image[${index}]`}
                                                multiple
                                                onChange={(e) => {
                                                    const files = e.target.files;
                                                    if (files) {
                                                        handleChangeVariant(index, 'image', files);
                                                    }
                                                }}
                                            />
                                            {errors[`image_${index}`] && <p className="text-red-500 text-sm">{errors[`image_${index}`]}</p>} {/* Error message for variant image */}
                                        </div>
                                    </div>
                                ))}

                                {showVariantForm && (
                                    <button
                                        type="button"
                                        onClick={handleAddVariant}
                                        className="bg-indigo-600 text-white rounded-md px-4 py-2"
                                    >
                                        Add Another Variant
                                    </button>
                                )}
                            </div>
                            <div className='flex gap-2 justify-end'>
                                <Button color="danger" onClick={clo}>
                                    Close
                                </Button>
                                <Button color="primary" type='submit'>Lưu</Button>
                            </div>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>
            {loading && (
                <div className="fixed z-[9999] inset-0 bg-gray-800 bg-opacity-75 flex gap-3 justify-center items-center w-screen h-screen ">
                    <Spinner size="lg" color="white" />
                    <p className="text-white text-lg">Đang xử lý...</p>
                </div>
            )}

            <div>
                <Tabs aria-label="Options">
                    <Tab key="SanphamChinh" title="Sản phẩm chính">
                        <Card>
                            {loadingProducts ? ( // Conditional rendering of the spinner
                                <div className="flex justify-center items-center h-32">
                                    <Spinner size="lg" color="primary" />
                                    <p className="ml-2 text-lg">Loading products...</p>
                                </div>
                            ) : (
                                <div>
                                    <Table aria-label="Example static collection table">
                                        <TableHeader>
                                            <TableColumn>Tên</TableColumn>
                                            <TableColumn>Danh mục</TableColumn>
                                            <TableColumn>Thương hiệu</TableColumn>
                                            <TableColumn>Số lượng biến thể</TableColumn>
                                            <TableColumn>STATUS</TableColumn>
                                        </TableHeader>
                                        <TableBody>
                                            {products.map((product, index) => {
                                                return (
                                                    <TableRow key={index}>
                                                        <TableCell>
                                                            <div className="flex gap-2 items-center">
                                                                <div className="w-20 h-20 rounded-lg bg-slate-100 flex items-center justify-center">
                                                                    {product?.product_images?.length > 0 ? (
                                                                        <Image
                                                                            src={product.product_images[0].image}
                                                                            alt={product.name || 'Product image'}
                                                                            width={60}
                                                                            height={60}
                                                                            loading="lazy"
                                                                            className='!w-[72px] !h-[72px] object-cover'
                                                                        />
                                                                    ) : (
                                                                        <div>No image available</div>
                                                                    )}
                                                                </div>
                                                                <div>{product?.name || "Unnamed product"}</div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>{product.brand?.name}</TableCell>
                                                        <TableCell>{product.category?.name}</TableCell>
                                                        <TableCell>{product.ProductVariantCount}</TableCell>
                                                        <TableCell>
                                                            <div className='flex items-center gap-2'>
                                                                <span
                                                                    className="text-lg text-default-400 cursor-pointer active:opacity-50"
                                                                    onClick={() => handleOpenEditProductModal(product)} // Pass the entire product object
                                                                >
                                                                    <EditIcon />
                                                                </span>
                                                                <span className="text-lg text-danger cursor-pointer active:opacity-50" onClick={() => handleDelete(product.id)}><DeleteIcon /></span>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                    <Pagination
                                        total={pagination.last_page}  // total number of pages
                                        initialPage={pagination.current_page}  // current page
                                        onChange={(page) => fetchProducts(page)} // fetch products when page changes
                                        showControls
                                    />
                                </div>

                            )}
                        </Card>
                    </Tab>
                    {/* Other tabs here... */}
                </Tabs>

                <Modal
                    size="5xl"
                    scrollBehavior="inside"
                    isOpen={isAddCategoryModalOpen}
                    onOpenChange={handleCloseEditProductModal}
                    isDismissable={false}
                >
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader>Bạn đang xem sản phẩm {selectedProduct?.name}</ModalHeader>
                                <ModalBody>
                                    {/* Display selected product details */}
                                    {selectedProduct ? (
                                        <div>

                                            <form onSubmit={handleUpdate} encType="multipart/form-data">
                                                <div>
                                                    <div className="mb-4">
                                                        <label htmlFor="name_product" className="block text-sm font-medium text-gray-700">
                                                            Tên sản phẩm
                                                        </label>
                                                        <Input
                                                            type="text"
                                                            id="name_product"
                                                            name="name_product"
                                                            required
                                                            placeholder='Tên sản phẩm'
                                                            className={errors.name_product ? 'border-red-500' : ''}
                                                            value={selectedProduct.name}
                                                        />
                                                        {errors.name_product && <p className="text-red-500 text-sm">{errors.name_product}</p>}
                                                    </div>

                                                    <div className='flex gap-5'>
                                                        {/* Categories */}
                                                        <div className="mb-4 flex-1">
                                                            <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">
                                                                Category ID
                                                            </label>
                                                            <Select
                                                                aria-label="Chọn một tùy chọn"
                                                                name="category_id"
                                                                required
                                                                placeholder='Phân loại sản phẩm'
                                                                defaultSelectedKeys={`${selectedProduct.category_id}`}
                                                            >
                                                                {categories.length > 0 ? (
                                                                    categories.map((category) => (
                                                                        <SelectItem key={category.id} value={category.id}>
                                                                            {category.name}
                                                                        </SelectItem>
                                                                    ))
                                                                ) : (
                                                                    <SelectItem key={""} value="">No categories available</SelectItem>
                                                                )}
                                                            </Select>
                                                        </div>

                                                        {/* Brands */}
                                                        <div className="mb-4 flex-1">
                                                            <label htmlFor="brand_id" className="block text-sm font-medium text-gray-700">
                                                                Brand ID
                                                            </label>
                                                            <Select
                                                                aria-label="Chọn một tùy chọn"
                                                                name="brand_id"
                                                                required
                                                                placeholder='Thương hiệu sản phẩm'
                                                                defaultSelectedKeys={`${selectedProduct.brand_id}`}

                                                            >
                                                                {brands.length > 0 ? (
                                                                    brands.map((brand) => (
                                                                        <SelectItem key={brand.id} value={brand.id}>
                                                                            {brand.name}
                                                                        </SelectItem>
                                                                    ))
                                                                ) : (
                                                                    <SelectItem key={""} value="">No brands available</SelectItem>
                                                                )}
                                                            </Select>
                                                        </div>
                                                    </div>
                                                    <div className="mb-4">
                                                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                                            Description
                                                        </label>
                                                        <Textarea
                                                            placeholder='Mô tả sản phẩm'
                                                            id="description"
                                                            name="description"
                                                            rows={3}
                                                            className={errors.description ? 'border-red-500' : ''}
                                                            value={selectedProduct.description}
                                                        ></Textarea>
                                                        {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                                                    </div>

                                                    <div className='mb-2'>
                                                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                                            Hình ảnh sản phẩm
                                                        </label>

                                                        <div className='flex gap-2'>

                                                            {selectedProduct.product_images.map((img, index) => (
                                                                <img src={img.image} alt="" className='w-[200px] h-[200px] object-cover' />
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="mb-4">
                                                        <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                                                            Upload Image
                                                        </label>
                                                        <Input
                                                            type="file"
                                                            id="image"
                                                            name="image[]"
                                                            multiple
                                                            required
                                                            className={errors.image ? 'border-red-500' : ''}
                                                        />
                                                        {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}
                                                    </div>
                                                </div>

                                                <div id="variants" className="mb-8">
                                                    <h4 className="text-lg font-semibold mb-1">Sản phẩm biến thể</h4>

                                                    {productsVa.map((product, index) => (
                                                        <div className="mb-4 border-b pb-4" key={index}>
                                                            <div className='mb-1'>Sản phẩm biến thể {index + 1}</div>
                                                            <div className="mb-4">
                                                                <label htmlFor={`name_${index}`} className="block text-sm font-medium text-gray-700">
                                                                    Name Product Variant
                                                                </label>
                                                                <Input
                                                                    placeholder='Tên sản phẩm'
                                                                    type="text"
                                                                    id={`name_${index}`}
                                                                    name={`name[${index}]`}
                                                                    value={product.name}
                                                                    onChange={(e) => handleChangeVariant(index, 'name', e.target.value)}
                                                                    required
                                                                    className={errors[`name_${index}`] ? 'border-red-500' : ''}
                                                                />
                                                                {errors[`name_${index}`] && <p className="text-red-500 text-sm">{errors[`name_${index}`]}</p>}
                                                            </div>
                                                            <div className="mb-4">
                                                                <label htmlFor={`price_${index}`} className="block text-sm font-medium text-gray-700">
                                                                    Price
                                                                </label>
                                                                <Input
                                                                    placeholder='Giá sản phẩm'
                                                                    type="number"
                                                                    id={`price_${index}`}
                                                                    name={`price[${index}]`}
                                                                    value={product.price}
                                                                    onChange={(e) => handleChangeVariant(index, 'price', e.target.value)}
                                                                    required
                                                                    className={errors[`price_${index}`] ? 'border-red-500' : ''}
                                                                />
                                                                {errors[`price_${index}`] && <p className="text-red-500 text-sm">{errors[`price_${index}`]}</p>}
                                                            </div>
                                                            <div className="mb-4">
                                                                <label htmlFor={`stock_${index}`} className="block text-sm font-medium text-gray-700">
                                                                    Stock
                                                                </label>
                                                                <Input
                                                                    placeholder='Số lượng'
                                                                    type="number"
                                                                    id={`stock_${index}`}
                                                                    name={`stock[${index}]`}
                                                                    value={product.stock}
                                                                    onChange={(e) => handleChangeVariant(index, 'stock', e.target.value)}
                                                                    required
                                                                    className={errors[`stock_${index}`] ? 'border-red-500' : ''}
                                                                />
                                                                {errors[`stock_${index}`] && <p className="text-red-500 text-sm">{errors[`stock_${index}`]}</p>}
                                                            </div>
                                                            <div className="mb-4">
                                                                <label htmlFor={`variantValue_${index}`} className="block text-sm font-medium text-gray-700">
                                                                    Variant Value
                                                                </label>
                                                                <Input
                                                                    placeholder='Giá trị biến thể'
                                                                    type="text"
                                                                    id={`variantValue_${index}`}
                                                                    name={`variant_value[${index}]`}
                                                                    value={product.variant_value}
                                                                    onChange={(e) => handleChangeVariant(index, 'variantValue', e.target.value)}
                                                                    required
                                                                    className={errors[`variantValue_${index}`] ? 'border-red-500' : ''}
                                                                />
                                                                {errors[`variantValue_${index}`] && <p className="text-red-500 text-sm">{errors[`variantValue_${index}`]}</p>}
                                                            </div>
                                                            <div className="mb-4">
                                                                <label htmlFor={`discount_${index}`} className="block text-sm font-medium text-gray-700">
                                                                    Discount
                                                                </label>
                                                                <Input
                                                                    placeholder='Giảm giá (%)'
                                                                    type="number"
                                                                    id={`discount_${index}`}
                                                                    name={`discount[${index}]`}
                                                                    value={product.discount}
                                                                    onChange={(e) => handleChangeVariant(index, 'discount', e.target.value)}
                                                                    className={errors[`discount_${index}`] ? 'border-red-500' : ''}
                                                                />
                                                                {errors[`discount_${index}`] && <p className="text-red-500 text-sm">{errors[`discount_${index}`]}</p>}
                                                            </div>
                                                            <div className='mb-2'>
                                                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                                            Hình ảnh sản phẩm
                                                        </label>

                                                        <div className='flex gap-2'>
                                                                <img src={product.image} alt="" className='w-[200px] h-[200px] object-cover' />
                                                        </div>
                                                    </div>
                                                            <div className="mb-4">
                                                                <label htmlFor={`image_${index}`} className="block text-sm font-medium text-gray-700">
                                                                    Upload Variant Image
                                                                </label>
                                                                <Input
                                                                    type="file"
                                                                    id={`image_${index}`}
                                                                    name={`image[${index}]`}
                                                                    multiple
                                                                    onChange={(e) => {
                                                                        const files = e.target.files;
                                                                        if (files) {
                                                                            handleChangeVariant(index, 'image', files);
                                                                        }
                                                                    }}
                                                                />
                                                                {errors[`image_${index}`] && <p className="text-red-500 text-sm">{errors[`image_${index}`]}</p>} {/* Error message for variant image */}
                                                            </div>
                                                        </div>
                                                    ))}

                                                    {!showVariantForm && (
                                                        <button
                                                            type="button"
                                                            onClick={handleAddVariant}
                                                            className="bg-indigo-600 text-white rounded-md px-4 py-2"
                                                        >
                                                            Add Variant
                                                        </button>
                                                    )}

                                                    {showVariantForm && variants.map((variant, index) => (
                                                        <div className="mb-4 border-b pb-4" key={index}>
                                                            <div className="mb-4">
                                                                <label htmlFor={`name_${index}`} className="block text-sm font-medium text-gray-700">
                                                                    Name Product Variant
                                                                </label>
                                                                <Input
                                                                    placeholder='Tên sản phẩm'
                                                                    type="text"
                                                                    id={`name_${index}`}
                                                                    name={`name[${index}]`}
                                                                    value={variant.name}
                                                                    onChange={(e) => handleChangeVariant(index, 'name', e.target.value)}
                                                                    required
                                                                    className={errors[`name_${index}`] ? 'border-red-500' : ''}
                                                                />
                                                                {errors[`name_${index}`] && <p className="text-red-500 text-sm">{errors[`name_${index}`]}</p>}
                                                            </div>
                                                            <div className="mb-4">
                                                                <label htmlFor={`price_${index}`} className="block text-sm font-medium text-gray-700">
                                                                    Price
                                                                </label>
                                                                <Input
                                                                    placeholder='Giá sản phẩm'
                                                                    type="number"
                                                                    id={`price_${index}`}
                                                                    name={`price[${index}]`}
                                                                    value={variant.price}
                                                                    onChange={(e) => handleChangeVariant(index, 'price', e.target.value)}
                                                                    required
                                                                    className={errors[`price_${index}`] ? 'border-red-500' : ''}
                                                                />
                                                                {errors[`price_${index}`] && <p className="text-red-500 text-sm">{errors[`price_${index}`]}</p>}
                                                            </div>
                                                            <div className="mb-4">
                                                                <label htmlFor={`stock_${index}`} className="block text-sm font-medium text-gray-700">
                                                                    Stock
                                                                </label>
                                                                <Input
                                                                    placeholder='Số lượng'
                                                                    type="number"
                                                                    id={`stock_${index}`}
                                                                    name={`stock[${index}]`}
                                                                    value={variant.stock}
                                                                    onChange={(e) => handleChangeVariant(index, 'stock', e.target.value)}
                                                                    required
                                                                    className={errors[`stock_${index}`] ? 'border-red-500' : ''}
                                                                />
                                                                {errors[`stock_${index}`] && <p className="text-red-500 text-sm">{errors[`stock_${index}`]}</p>}
                                                            </div>
                                                            <div className="mb-4">
                                                                <label htmlFor={`variantValue_${index}`} className="block text-sm font-medium text-gray-700">
                                                                    Variant Value
                                                                </label>
                                                                <Input
                                                                    placeholder='Giá trị biến thể'
                                                                    type="text"
                                                                    id={`variantValue_${index}`}
                                                                    name={`variant_value[${index}]`}
                                                                    value={variant.variantValue}
                                                                    onChange={(e) => handleChangeVariant(index, 'variantValue', e.target.value)}
                                                                    required
                                                                    className={errors[`variantValue_${index}`] ? 'border-red-500' : ''}
                                                                />
                                                                {errors[`variantValue_${index}`] && <p className="text-red-500 text-sm">{errors[`variantValue_${index}`]}</p>}
                                                            </div>
                                                            <div className="mb-4">
                                                                <label htmlFor={`discount_${index}`} className="block text-sm font-medium text-gray-700">
                                                                    Discount
                                                                </label>
                                                                <Input
                                                                    placeholder='Giảm giá (%)'
                                                                    type="number"
                                                                    id={`discount_${index}`}
                                                                    name={`discount[${index}]`}
                                                                    value={variant.discount}
                                                                    onChange={(e) => handleChangeVariant(index, 'discount', e.target.value)}
                                                                    className={errors[`discount_${index}`] ? 'border-red-500' : ''}
                                                                />
                                                                {errors[`discount_${index}`] && <p className="text-red-500 text-sm">{errors[`discount_${index}`]}</p>}
                                                            </div>

                                                            

                                                            <div className="mb-4">
                                                                <label htmlFor={`image_${index}`} className="block text-sm font-medium text-gray-700">
                                                                    Upload Variant Image
                                                                </label>
                                                                <Input
                                                                    type="file"
                                                                    id={`image_${index}`}
                                                                    name={`image[${index}]`}
                                                                    multiple
                                                                    onChange={(e) => {
                                                                        const files = e.target.files;
                                                                        if (files) {
                                                                            handleChangeVariant(index, 'image', files);
                                                                        }
                                                                    }}
                                                                />
                                                                {errors[`image_${index}`] && <p className="text-red-500 text-sm">{errors[`image_${index}`]}</p>} {/* Error message for variant image */}
                                                            </div>
                                                        </div>
                                                    ))}

                                                    {showVariantForm && (
                                                        <button
                                                            type="button"
                                                            onClick={handleAddVariant}
                                                            className="bg-indigo-600 text-white rounded-md px-4 py-2"
                                                        >
                                                            Add Another Variant
                                                        </button>
                                                    )}
                                                </div>
                                                <div className='flex gap-2 justify-end'>
                                                    <Button color="danger" onPress={onClose}>
                                                        Close
                                                    </Button>
                                                    <Button color="primary" type='submit'>Cập nhật</Button>
                                                </div>
                                            </form>
                                        </div>
                                    ) : (
                                        <p>No product selected.</p>
                                    )}
                                </ModalBody>

                            </>
                        )}
                    </ModalContent>
                </Modal>

            </div>

        </div>
    );
};

export default CreateProduct;
