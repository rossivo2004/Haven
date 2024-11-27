'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Brand, Category, Product, Product1, ProductVa } from '@/interface';
import { toast } from "react-toastify";
import { Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, image } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/react";
import { Textarea } from "@nextui-org/input";
import apiConfig from "@/configs/api";
import { Spinner } from "@nextui-org/react"; // Optional: if you want a spinner
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@nextui-org/table";
import Image from 'next/image';
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import Cookies from 'js-cookie';

import { EditIcon } from "./EditIcon";
import { DeleteIcon } from "./DeleteIcon";
import { EyeIcon } from "./EyeIcon";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import BreadcrumbNav from '../Breadcrumb/Breadcrumb';

interface Variant {
    name: string;
    price: string;
    stock: string;
    variantValue: string;
    discount: string;
    image: File[];
    product_id: string | number;
    id: number | string;
}



const BodyProductVa = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [variants, setVariants] = useState<Variant[]>([]);
    const [editingVariant, setEditingVariant] = useState<ProductVa | null>(null);
    const [newVariant, setNewVariant] = useState<Variant>({
        name: '',
        price: '',
        stock: '',
        variantValue: '',
        discount: '',
        image: [],
        product_id: '',
        id: ''
    });

    const [mainProduct, setMainProduct] = useState<{
        name: string;
        description: string;
        category_id: string;
        brand_id: string;
    }>({
        name: '',
        description: '',
        category_id: '',
        brand_id: '',
    });


    const [products, setProducts] = useState<Product[]>([]);
    const [productsVa, setProductsVa] = useState<ProductVa[]>([]);

    const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const { isOpen, onOpen, onClose } = useDisclosure(); // Modal control
    const [showVariantForm, setShowVariantForm] = useState(false); // Control variant form visibility
    const [loading, setLoading] = useState(false); // Loading state
    const [loadingProducts, setLoadingProducts] = useState(false); // Loading state for products
    const [showNewVariantForm, setShowNewVariantForm] = useState(false);
    // Error state for main product fields
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [newImages, setNewImages] = useState<File[]>([]);

    const [selectedImages, setSelectedImages] = useState<Variant>({
        name: '',
        price: '',
        stock: '',
        variantValue: '',
        discount: '',
        image: [],
        product_id: '',
        id: ''
    });
    const [selectedVariantImages, setSelectedVariantImages] = useState<{ [key: number]: File[] }>({}); // Add this line

    const [currentPage, setCurrentPage] = useState(1); // Add state for current page
    const productsPerPage = 20; // Set the number of products per page

    const [search, setSearch] = useState(""); // Thêm trạng thái tìm kiếm
    const [filteredProducts, setFilteredProducts] = useState<ProductVa[]>([]); // Trạng thái cho sản phẩm đã lọc

    const resetNewVariant = () => {
        setNewVariant({
            name: '',
            price: '',
            stock: '',
            variantValue: '',
            discount: '',
            image: [],
            product_id: '',
            id: ''
        });
    };

    const handleOpenAddProductModal = () => {
        resetNewVariant(); // Reset newVariant before opening the modal
        onOpen(); // Open the modal
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
                        const token = Cookies.get('access_token_admin'); // Get the token
                        try {
                            await axios.delete(`${apiConfig.products.deletePr}${Id}`, {
                                headers: {
                                    Authorization: `Bearer ${token}`, // Add the Authorization header
                                },
                            });
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
        const mainProductName = (document.getElementById('name') as HTMLInputElement)?.value;
        const variantValue = (document.getElementById('variant_value') as HTMLInputElement)?.value;
        const price = (document.getElementById('price') as HTMLInputElement)?.value;
        const discount = (document.getElementById('discount') as HTMLInputElement)?.value;
        const quantity = (document.getElementById('stock') as HTMLInputElement)?.value;
        const mainProductImages = (document.getElementById('image') as HTMLInputElement)?.files;
        const selectedProductId = (document.querySelector('select[name="product_id"]') as HTMLSelectElement)?.value; // Get the selected product ID

        // Main product validation
        if (!mainProductName) newErrors.name = "Tên sản phẩm là bắt buộc.";
        if (!variantValue) newErrors.variant_value = "Slug sản phẩm là bắt buộc.";
        if (!selectedProductId) newErrors.product_id = "Sản phẩm chính là bắt buộc."; // Validate main product ID
        if (!price) newErrors.price = "Giá sản phẩm là bắt buộc.";
        if (!discount) newErrors.discount = "Giảm giá sản phẩm là bắt buộc.";
        if (!quantity) newErrors.stock = "Số lượng sản phẩm là bắt buộc.";
        if (!mainProductImages || mainProductImages.length === 0) newErrors.image = "Ít nhất một hình ảnh sản phẩm là bắt buộc.";

        // Check if at least one image is selected
        if (newVariant.image.length === 0) newErrors.image = "Ít nhất một hình ảnh sản phẩm là bắt buộc.";

        // Variant validation (if applicable)
        variants.forEach((variant, index) => {
            if (!variant.name) newErrors[`name_${index}`] = "Tên biến thể là bắt buộc.";
            if (!variant.price) newErrors[`price_${index}`] = "Giá biến thể là bắt buộc.";
            if (!variant.stock) newErrors[`stock_${index}`] = "Số lượng biến thể là bắt buộc.";
            if (!variant.variantValue) newErrors[`variantValue_${index}`] = "Giá trị biến thể là bắt buộc.";
            if (variant.image.length === 0) newErrors[`image_${index}`] = "Ít nhất một hình ảnh cho biến thể là bắt buộc."; // Check for variant image
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Return true if no errors
    };



    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validate the form
        if (!validateForm()) return; // Exit if validation fails

        // Check for valid image file types
        const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/svg+xml'];
        const mainImages = (e.currentTarget.querySelector('#image') as HTMLInputElement).files;

        if (mainImages) {
            for (let i = 0; i < mainImages.length; i++) {
                if (!validImageTypes.includes(mainImages[i].type)) {
                    toast.error('Hình ảnh phải có định dạng jpeg, png, jpg, hoặc svg.');
                    return; // Exit if an invalid image type is found
                }
            }
        }

        setLoading(true); // Start loading
        const formElement = e.currentTarget as HTMLFormElement;
        const formData = new FormData(formElement);
        const token = Cookies.get('access_token_admin'); // Get the token

        // Append main product fields
        if (mainImages) {
            Array.from(mainImages).forEach((image) => {
                formData.append('image', image); // Append each image file
            });
        }

        // Append main product ID
        const selectedProductId = (formElement.querySelector('select[name="product_id"]') as HTMLSelectElement)?.value;
        if (!selectedProductId) {
            toast.error('Sản phẩm chính là bắt buộc.');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(`${apiConfig.productsva.createproductvariants}`, formData, {
                headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${token}`, // Add the Authorization header
                },
            });

            setNewVariant({
                ...newVariant,
                product_id: '',
                name: '',
                price: '',
                stock: '',
                variantValue: '',
                discount: '',
                image: []
            });
            fetchProductsVa();
            toast.success('Thêm sản phẩm thành công');
            setShowVariantForm(false);
            setVariants([]);
            onClose();
            fetchProducts();
            setNewImages([]); // Clear new images after successful addition
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('Thêm sản phẩm thất bại');
        } finally {
            setLoading(false); // Stop loading
        }
    };

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setLoading(true);
        const formElement = e.currentTarget as HTMLFormElement;
        const formData = new FormData(formElement);
        const token = Cookies.get('access_token_admin'); // Get the token

        formData.append("_method", "PUT");
        formData.append('product_id', newVariant.product_id.toString());

        if (newVariant.image.length > 0) {
            formData.append('image', newVariant.image[0]); // Assuming you want to send only the first image
        }

        try {
            const response = await axios.post(`${apiConfig.productsva.updateproductvariants}${newVariant.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`, // Add the Authorization header
                },
            });
            toast.success('Cập nhật sản phẩm thành công');
            fetchProductsVa();
            onClose();
            clo();
        } catch (error) {
            console.error('Error updating product:', error);
            toast.error('Cập nhật sản phẩm thất bại');
        } finally {
            setLoading(false);
        }
    };

    // ... rest of the code ...

    // ... rest of the code ...
    const fetchProducts = async () => {
        setLoadingProducts(true); // Start loading
        try {
            const response = await axios.get(`${apiConfig.products.getAll}`, { withCredentials: true });
            setProducts(response.data.products);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoadingProducts(false); // Stop loading
        }
    };

    const fetchProductsVa = async () => {
        // setLoadingProducts(true); // Start loading
        try {
            const response = await axios.get(`${apiConfig.productsva.getAll}`, { withCredentials: true });
            setProductsVa(response.data.productVariants);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            // setLoadingProducts(false); // Stop loading
        }
    };

    useEffect(() => {
        fetchProductsVa();
    }, []);


    const fetchPagination = async () => {
        try {
            const response = await axios.get(apiConfig.products.getAll, { withCredentials: true });
        } catch (error) {
            console.error('Error fetching brands:', error);
        }
    };

    const handleMainProductChange = (field: string, value: string) => {
        setMainProduct(prev => ({ ...prev, [field]: value }));
    };

    useEffect(() => {
        fetchProducts();
        fetchPagination();
    }, []);

    useEffect(() => {
        if (selectedProduct) {
            setMainProduct({
                name: selectedProduct.name,
                description: selectedProduct.description,
                category_id: selectedProduct.category_id.toString(),
                brand_id: selectedProduct.brand_id.toString(),
            });
            // fetchProductsVa(selectedProduct.id);
        }
    }, [selectedProduct]);

    const clo = () => {
        onClose();
        setVariants([])
        setNewImages([]); // Clear new images after successful addition
    }

    const handleOpenEditProductModal = (product: ProductVa) => {
        // Giả sử bạn có một hàm để tìm sản phẩm chính từ variant
        // const mainProduct = products.find(product => product.id === variant.product_id);
    
        if (mainProduct) {
            // setSelectedProduct(mainProduct); // Lưu sản phẩm chính
            setNewVariant({
                name: product.name,
                price: product.price,
                stock: product.stock,
                variantValue: product.variant_value,
                discount: product.discount,
                image: [], // Nếu bạn muốn thêm hình ảnh, bạn có thể lấy từ variant
                product_id: product.product.id,
                id: product.id
            });
            setIsAddCategoryModalOpen(true); // Mở modal
        } else {
            console.error('Không tìm thấy sản phẩm chính cho biến thể này.');
        }

    };

    const handleCloseEditProductModal = () => {
        setIsAddCategoryModalOpen(false);
        setSelectedProduct(null); // Clear selected product when closing the modal
    };

    // useEffect(() => {
    //     if (selectedProduct) {
    //         fetchProductsVa(selectedProduct.id); // Now it's guaranteed to be a number
    //     }
    // }, [selectedProduct]);

    const handleAddProductImages = async (productId: number) => {
        const formData = new FormData();
        formData.append('product_id', productId.toString());
        newImages.forEach(image => {
            formData.append('product_images[]', image); // Thêm ảnh mới vào formData
        });
        setLoading(true);
        try {
            await axios.post(`${apiConfig.products.addproductimage}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            // if (selectedProduct) {
            //     // Fetch updated product variants to refresh images
            //     await fetchProductsVa(selectedProduct.id); // Refresh product variants
            // }
            setNewImages([]); // Clear new images after successful addition
            // setSelectedImages([]); // Clear selected images for the main product
            fetchProducts();

            setSelectedProduct(prev => ({
                ...prev,
                product_images: [...(prev?.product_images || []), ...newImages] // Ensure prev is not null
            } as Product)); // Cast to Product to satisfy TypeScript

            const input = document.getElementById('new_images') as HTMLInputElement;
            if (input) {
                input.value = ''; // Clear the input value
            }

            toast.success('Thm ảnh thành công');
        } catch (error) {
            console.error('Error adding product images:', error);
            toast.error('Thêm ảnh thất bại');
        } finally {
            setLoading(false);
        }
    };

    // ... existing code ...

    const handleDeleteProductImage = async (imageId: number) => {
        // Check if the selected product has only one image
        if (selectedProduct && selectedProduct.product_images.length <= 1) {
            toast.error('Không thể xóa hình ảnh cuối cùng.');
            return; // Exit the function if it's the last image
        }

        confirmAlert({
            title: 'Xóa hình ảnh sản phẩm',
            message: 'Bạn có chắc chắn muốn xóa hình ảnh này?',
            buttons: [
                {
                    label: 'Có',
                    onClick: async () => {
                        setLoading(true);
                        try {
                            await axios.delete(`${apiConfig.products.deleteproductimage}${imageId}`);
                            // if (selectedProduct) {
                            //     // Fetch updated product variants to refresh images
                            //     await fetchProductsVa(selectedProduct.id); // Refresh product variants
                            // }
                            fetchProducts();

                            setSelectedProduct(prev => ({
                                ...prev!,
                                product_images: prev?.product_images.filter(img => img.id !== imageId) // Remove the deleted image
                            } as Product));
                            // setSelectedProduct(null);
                            toast.success('Xóa hình ảnh sản phẩm thành công');
                        } catch (error) {
                            console.error('Error deleting product image:', error);
                            toast.error('Xóa hình ảnh sản phẩm thất bại');
                        } finally {
                            setLoading(false);
                        }
                    }
                },
                {
                    label: 'Không',
                    onClick: () => { }
                }
            ]
        });
    };


    const handleDeleteProduct = async (productId: number) => {
        confirmAlert({
            title: 'Xóa sản phẩm',
            message: 'Bạn có chắc chắn muốn xóa sản phẩm này?',
            buttons: [
                {
                    label: 'Có',
                    onClick: async () => {
                        setLoading(true);
                        const token = Cookies.get('access_token_admin'); // Get the tokenFc
                        try {
                            await axios.delete(`${apiConfig.productsva.deleteproductvariants}${productId}`, {
                                headers: {
                                    Authorization: `Bearer ${token}`, // Add the Authorization header
                                },
                            });
                            toast.success('Xóa sản phẩm thành công');
                            fetchProducts(); // Refresh the product list after deletion
                            fetchProductsVa();
                        } catch (error) {
                            console.error('Error deleting product:', error);
                            toast.error('Xóa sản phẩm thất bại');
                        } finally {
                            setLoading(false);
                        }
                    }
                },
                {
                    label: 'Không',
                }
            ]
        });
    };

    // useEffect(() => {
    //     if (selectedProduct) {
    //         // Kiểm tra xem selectedProduct có phải là Variant không
    //         const variant = variants.find(v => v.product_id === selectedProduct.id); // Tìm variant tương ứng
    //         console.log(selectedProduct);
    //         if (variant) {
    //             const variantData: Variant = {
    //                 name: variant.name,
    //                 price: variant.price,
    //                 stock: variant.stock,
    //                 variantValue: variant.variant_value, // Ensure this matches your data structure
    //                 discount: variant.discount,
    //                 image: [], // Adjust as necessary
    //                 product_id: variant.product_id // Ensure this matches your data structure
    //             };
    //             handleOpenEditProductModal(variantData); // Pass the new object
    //         } else {
    //             console.error('Không tìm thấy biến thể cho sản phẩm này.');
    //         }
    //     }
    // }, [selectedProduct, variants]);

    useEffect(() => {
        const filtered = productsVa.filter(product => 
            product.name.toLowerCase().includes(search.toLowerCase()) || // Tìm kiếm theo tên sản phẩm
            product.variant_value.toLowerCase().includes(search.toLowerCase()) // Tìm kiếm theo slug sản phẩm
        );
        setFilteredProducts(filtered);
    }, [search, productsVa]); // Cập nhật khi tìm kiếm hoặc danh sách sản phẩm thay đổi

    const indexOfLastProduct = currentPage * productsPerPage; // Tính chỉ số sản phẩm cuối cùng
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage; // Tính chỉ số sản phẩm đầu tiên
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct); // Lấy sản phẩm hiện tại từ danh sách đã lọc

    return (
        <div className="p-4 !pt-0">
            <div className="pb-5 h-[62px]">
                <BreadcrumbNav
                    items={[
                        { name: 'Trang chủ', link: '/' },
                        { name: 'Sản phẩm biến thể', link: '#' },
                    ]}
                />
            </div>
            {/* {loading && <Spinner />} */}
            <div className='flex justify-between mb-4'>
                <div className='font-semibold text-xl'>
                    Quản lý sản phẩm biến thể
                </div>
                <div className='flex items-center gap-2'>
                    <Input
                        type="text"
                        placeholder="Tìm kiếm sản phẩm"
                        labelPlacement="outside"
                        size="md"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)} // Cập nhật giá trị tìm kiếm
                    />
                    <Button className='bg-[#696CFF] text-white !w-48' onPress={handleOpenAddProductModal}>
                        Thêm sản phẩm
                    </Button>
                </div>
            </div>


            <Modal isOpen={isOpen} onClose={clo} closeButton size='5xl'>
                <ModalContent>
                    <ModalHeader>Thêm mới sản phẩm biếm thể</ModalHeader>
                    <ModalBody className='!max-h-[70vh] overflow-y-auto'>
                        <form onSubmit={handleSubmit} encType="multipart/form-data">
                            <div>
                                <div className="mb-4">
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                        Tên sản phẩm
                                    </label>
                                    <Input
                                        type="text"
                                        id="name"
                                        name="name"
                                        required
                                        placeholder='Tn sản phẩm'
                                        className={errors.name ? 'border-red-500' : ''}
                                        value={newVariant.name}
                                        onChange={(e) => setNewVariant({ ...newVariant, name: e.target.value })}
                                    />
                                    {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                                </div>

                                <div className='flex gap-5'>
                                    <div className='flex-1 mb-4'>
                                        <label htmlFor="name_product" className="block text-sm font-medium text-gray-700 mb-1">
                                            Slug sản phẩm
                                        </label>
                                        <Input
                                            type="text"
                                            id="variant_value"
                                            name="variant_value"
                                            required
                                            placeholder='Slug sản phẩm'
                                            className={errors.variant_value ? 'border-red-500' : ''}
                                            value={newVariant.variantValue}
                                            onChange={(e) => setNewVariant({ ...newVariant, variantValue: e.target.value })}
                                        />
                                        {errors.variant_value && <p className="text-red-500 text-sm">{errors.variant_value}</p>}
                                    </div>
                                    <div className="mb-4 flex-1">
                                        <label htmlFor="brand_id" className="block text-sm font-medium text-gray-700 mb-1">
                                            Sản phẩm chính
                                        </label>
                                        <Select
                                            aria-label="Chọn một tùy chọn"
                                            name="product_id"
                                            required
                                            placeholder='Sản phẩm chính'
                                            value={newVariant.product_id}
                                            onChange={(e) => setNewVariant({ ...newVariant, product_id: e.target.value })}
                                        >
                                            {products.length > 0 ? (
                                                products.map((product) => (
                                                    <SelectItem key={product.id} value={product.id}>
                                                        {product.name}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <SelectItem key={""} value="">No products available</SelectItem>
                                            )}
                                        </Select>
                                    </div>
                                </div>

                                <div className='flex gap-5'>
                                    <div className='flex-1 mb-4'>
                                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                                            Giá sản phẩm
                                        </label>
                                        <Input
                                            type="number"
                                            id="price"
                                            name="price"
                                            required
                                            placeholder='Giá sản phẩm'
                                            className={errors.price ? 'border-red-500' : ''}
                                            value={newVariant.price}
                                            onChange={(e) => setNewVariant({ ...newVariant, price: e.target.value })}
                                            min={0}
                                        />
                                        {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
                                    </div>
                                    <div className='flex-1 mb-4'>
                                        <label htmlFor="discount" className="block text-sm font-medium text-gray-700 mb-1">
                                            Giảm giá sản phẩm
                                        </label>
                                        <Input
                                            type="number"
                                            id="discount"
                                            name="discount"
                                            required
                                            placeholder='Giảm giá sản phẩm'
                                            className={errors.discount ? 'border-red-500' : ''}
                                            value={newVariant.discount}
                                            onChange={(e) => setNewVariant({ ...newVariant, discount: e.target.value })}
                                            min={0}
                                            max={100}
                                        />
                                        {errors.discount && <p className="text-red-500 text-sm">{errors.discount}</p>}
                                    </div>
                                </div>


                                <div className='flex gap-5'>
                                    <div className='flex-1 mb-4'>
                                        <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                                            Số lượng sản phẩm
                                        </label>
                                        <Input
                                            type="number"
                                            id="stock"
                                            name="stock"
                                            required
                                            placeholder='Số lượng sản phẩm'
                                            className={errors.stock ? 'border-red-500' : ''}
                                            value={newVariant.stock}
                                            onChange={(e) => setNewVariant({ ...newVariant, stock: e.target.value })}
                                            min={0}
                                        />
                                        {errors.stock && <p className="text-red-500 text-sm">{errors.stock}</p>}
                                    </div>
                                </div>


                                <div className="mb-4">
                                    <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                                        Hình ảnh
                                    </label>
                                    <Input
                                        name='image'
                                        id='image'
                                        className='mb-2'
                                        type="file"
                                        accept="image/png, image/jpeg, image/jpg, image/svg+xml"
                                        onChange={(e) => {
                                            const files = e.target.files;
                                            if (files) {
                                                setNewVariant({ ...newVariant, image: Array.from(files) });
                                            }
                                        }}
                                    />
                                    {/* <div className='flex gap-2 mt-1'>
                                        {selectedImages.map((file, index) => (
                                            <div key={index} className="w-[200px] h-[200px] relative">
                                                <img
                                                    src={URL.createObjectURL(file)}
                                                    alt={`Selected ${index}`}
                                                    className="w-[200px] h-[200px] object-cover"
                                                />
                                                <button
                                                    onClick={() => {
                                                        const updatedImages = selectedImages.filter((_, i) => i !== index);
                                                        setSelectedImages(updatedImages); // Remove the selected image

                                                        // Reset the input file value
                                                        const input = document.getElementById('image') as HTMLInputElement;
                                                        if (input) {
                                                            const dataTransfer = new DataTransfer();
                                                            updatedImages.forEach((img) => {
                                                                dataTransfer.items.add(img); // Add remaining images to DataTransfer
                                                            });
                                                            input.files = dataTransfer.files; // Update the input files
                                                        }
                                                    }}
                                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-lg w-6 h-6"
                                                >
                                                    X
                                                </button>
                                            </div>
                                        ))}
                                    </div> */}
                                    {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}
                                </div>
                            </div>

                            <div className='flex gap-2 justify-end'>
                                <Button color="danger" onClick={clo}>
                                    Đóng
                                </Button>
                                <Button className='bg-[#4f46b5] text-white' type='submit'>Lưu</Button>
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
                {loadingProducts ? ( // Conditional rendering of the spinner
                    <div className="flex justify-center items-center h-32">
                        <Spinner size="lg" color="primary" />
                        <p className="ml-2 text-lg">Loading products...</p>
                    </div>
                ) : (
                    <div>
                        <Table aria-label="Example static collection table">
                            <TableHeader>
                                <TableColumn><div className='flex items-center justify-center'>STT</div></TableColumn>
                                <TableColumn><div className='flex items-center justify-center'>Tên</div></TableColumn>
                                <TableColumn><div className='flex items-center justify-center'>Slug</div></TableColumn>
                                <TableColumn><div className='flex items-center justify-center'>Tên sản phẩm chính</div></TableColumn>
                                <TableColumn><div className='flex items-center justify-center'>Giá sản phẩm</div></TableColumn>
                                <TableColumn><div className='flex items-center justify-center'>Khuyến mãi</div></TableColumn>
                                <TableColumn><div className='flex items-center justify-center'>Số lượng</div></TableColumn>
                                <TableColumn><div className='flex items-center justify-center'>Thao tác</div></TableColumn>
                            </TableHeader>
                            <TableBody>
                                {currentProducts.map((product, index) => {
                                    const displayIndex = indexOfFirstProduct + index + 1;
                                    return (
                                        <TableRow key={product.id}>
                                            <TableCell><div className='flex items-center justify-center'>{displayIndex}</div></TableCell>
                                            <TableCell>
                                                <div className="flex gap-2 items-center">
                                                    <div className="w-20 h-20 rounded-lg bg-slate-100 flex items-center justify-center">
                                                        {product?.image?.length > 0 ? (
                                                            <Image
                                                                src={product.image}
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
                                            <TableCell><div className='flex items-center justify-center'>{product.variant_value}</div></TableCell>
                                            <TableCell>
                                                <div className='flex items-center justify-center'>
                                                    {product && product.product ? product.product.name : 'Unnamed product'}
                                                </div>
                                            </TableCell>
                                            <TableCell><div className='flex items-center justify-center'>{product.price}</div></TableCell>
                                            <TableCell><div className='flex items-center justify-center'>{product.discount}</div></TableCell>
                                            <TableCell><div className='flex items-center justify-center'>{product.stock}</div></TableCell>
                                            <TableCell>
                                                <div className='flex items-center justify-center gap-2'>
                                                    <span
                                                        className="text-lg text-default-400 cursor-pointer active:opacity-50"
                                                        onClick={() => {
                                                           
                                                                handleOpenEditProductModal(product); // Gọi hàm với biến thể
                                                          
                                                        }}
                                                    >
                                                        <EditIcon />
                                                    </span>
                                                    <span className="text-lg text-danger cursor-pointer active:opacity-50" onClick={() => handleDeleteProduct(product.id)}><DeleteIcon /></span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>

                        <div className="flex justify-between items-center mt-4">
                            <div className="text-sm">
                                {`${indexOfFirstProduct + 1} - ${Math.min(indexOfLastProduct, filteredProducts.length)} của ${filteredProducts.length} sản phẩm`}
                            </div>
                            <div className="flex gap-2">

                                {Array.from({ length: Math.ceil(filteredProducts.length / productsPerPage) }, (_, index) => (
                                    <div
                                        className='cursor-pointer w-10 h-10 flex items-center justify-center rounded-md'
                                        key={index + 1}
                                        onClick={() => setCurrentPage(index + 1)}
                                        style={{
                                            backgroundColor: currentPage === index + 1 ? '#696bff' : 'transparent',
                                            border: '2px solid #696bff',
                                            color: currentPage === index + 1 ? 'white' : '#696bff'
                                        }}
                                    >
                                        {index + 1}
                                    </div>
                                ))}

                            </div>

                        </div>

                    </div>

                )}

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
                                <ModalBody className='!max-h-[70vh] overflow-y-auto'>
                                    <form onSubmit={handleUpdate} encType="multipart/form-data">
                                        <div>
                                            <div className="mb-4">
                                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Tên sản phẩm
                                                </label>
                                                <Input
                                                    type="text"
                                                    id="name"
                                                    name="name"
                                                    required
                                                    placeholder='Tên sản phẩm'
                                                    className={errors.name ? 'border-red-500' : ''}
                                                    value={newVariant.name}
                                                    onChange={(e) => setNewVariant({ ...newVariant, name: e.target.value })}
                                                />
                                                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                                            </div>

                                            <div className='flex gap-5'>
                                                <div className='flex-1 mb-4'>
                                                    <label htmlFor="variant_value" className="block text-sm font-medium text-gray-700 mb-1">
                                                        Slug sản phẩm
                                                    </label>
                                                    <Input
                                                        type="text"
                                                        id="variant_value"
                                                        name="variant_value"
                                                        required
                                                        placeholder='Slug sản phẩm'
                                                        className={errors.variant_value ? 'border-red-500' : ''}
                                                        value={newVariant.variantValue}
                                                        onChange={(e) => setNewVariant({ ...newVariant, variantValue: e.target.value })}
                                                    />
                                                    {errors.variant_value && <p className="text-red-500 text-sm">{errors.variant_value}</p>}
                                                </div>
                                                {/* <div className="mb-4 flex-1">
                                                    <label htmlFor="product_id" className="block text-sm font-medium text-gray-700 mb-1">
                                                        Sản phẩm chính
                                                    </label>
                                                    <Select
                                                        aria-label="Chọn một tùy chọn"
                                                        name="product_id"
                                                        required
                                                        placeholder='Sản phẩm chính'
                                                        value={newVariant.product_id}
                                                        onChange={(e) => setNewVariant({ ...newVariant, product_id: e.target.value })}
                                                    >
                                                        {products.length > 0 ? (
                                                            products.map((product) => (
                                                                <SelectItem key={product.id} value={product.id}>
                                                                    {product.name}
                                                                </SelectItem>
                                                            ))
                                                        ) : (
                                                            <SelectItem key={""} value="">No products available</SelectItem>
                                                        )}
                                                    </Select>
                                                </div> */}
                                            </div>

                                            <div className='flex gap-5'>
                                                <div className='flex-1 mb-4'>
                                                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                                                        Giá sản phẩm
                                                    </label>
                                                    <Input
                                                        type="number"
                                                        id="price"
                                                        name="price"
                                                        required
                                                        placeholder='Giá sản phẩm'
                                                        className={errors.price ? 'border-red-500' : ''}
                                                        value={newVariant.price}
                                                        onChange={(e) => setNewVariant({ ...newVariant, price: e.target.value })}
                                                        min={0}
                                                    />
                                                    {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
                                                </div>
                                                <div className='flex-1 mb-4'>
                                                    <label htmlFor="discount" className="block text-sm font-medium text-gray-700 mb-1">
                                                        Giảm giá sản phẩm
                                                    </label>
                                                    <Input
                                                        type="number"
                                                        id="discount"
                                                        name="discount"
                                                        required
                                                        placeholder='Giảm giá sản phẩm'
                                                        className={errors.discount ? 'border-red-500' : ''}
                                                        value={newVariant.discount}
                                                        onChange={(e) => setNewVariant({ ...newVariant, discount: e.target.value })}
                                                        min={0}
                                                        max={100}
                                                    />
                                                    {errors.discount && <p className="text-red-500 text-sm">{errors.discount}</p>}
                                                </div>
                                            </div>

                                            <div className='flex gap-5'>
                                                <div className='flex-1 mb-4'>
                                                    <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                                                        Số lượng sản phẩm
                                                    </label>
                                                    <Input
                                                        type="number"
                                                        id="stock"
                                                        name="stock"
                                                        required
                                                        placeholder='Số lượng sản phẩm'
                                                        className={errors.stock ? 'border-red-500' : ''}
                                                        value={newVariant.stock}
                                                        onChange={(e) => setNewVariant({ ...newVariant, stock: e.target.value })}
                                                        min={0}
                                                    />
                                                    {errors.stock && <p className="text-red-500 text-sm">{errors.stock}</p>}
                                                </div>
                                            </div>

                                            <div className="mb-4">
                                                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Hình ảnh
                                                </label>
                                                <Input
                                                    name='image'
                                                    id='image'
                                                    className='mb-2'
                                                    type="file"
                                                    accept="image/png, image/jpeg, image/jpg, image/svg+xml"
                                                    onChange={(e) => {
                                                        const files = e.target.files;
                                                        if (files) {
                                                            setNewVariant({ ...newVariant, image: Array.from(files) });
                                                        }
                                                    }}
                                                />
                                                {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}
                                            </div>
                                        </div>

                                        <div className='flex gap-2 justify-end'>
                                            <Button color="danger" onClick={clo}>
                                                Đóng
                                            </Button>
                                            <Button className='bg-[#4f46b5] text-white' type='submit'>Cập nhật</Button>
                                        </div>
                                    </form>
                                </ModalBody>

                            </>
                        )}
                    </ModalContent>
                </Modal>

            </div>

        </div>
    );
};

export default BodyProductVa;
