'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Brand, Category } from '@/interface';
import { toast } from "react-toastify";
import { Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/react";
import { Textarea } from "@nextui-org/input";
import apiConfig from "@/configs/api";
import { Spinner } from "@nextui-org/react"; // Optional: if you want a spinner
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@nextui-org/table";
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";

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
    const { isOpen, onOpen, onClose } = useDisclosure(); // Modal control
    const [showVariantForm, setShowVariantForm] = useState(false); // Control variant form visibility
    const [loading, setLoading] = useState(false); // Loading state

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

    const fetchCategories = async () => {
        try {
            const response = await axios.get(apiConfig.categories.getAll, { withCredentials: true });
            setCategories(response.data.categories.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchBrands = async () => {
        try {
            const response = await axios.get(apiConfig.brands.getAll, { withCredentials: true });
            setBrands(response.data.brands.data);
        } catch (error) {
            console.error('Error fetching brands:', error);
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchBrands();
    }, []);

    const clo = () => {
        onClose();
        setVariants([])

    }

    return (
        <div className="p-4">
            <div className='flex justify-between mb-4'>
                <div className='font-semibold text-xl'>
                    Thêm sản phẩm
                </div>
                <div>
                    <Button color="primary" onPress={onOpen}>
                        Create Product
                    </Button>
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
                    <Tab key="photos" title="Photos">
                        <Card>
                            <Table aria-label="Example static collection table">
                                <TableHeader>
                                    <TableColumn>NAME</TableColumn>
                                    <TableColumn>ROLE</TableColumn>
                                    <TableColumn>STATUS</TableColumn>
                                </TableHeader>
                                <TableBody>
                                    <TableRow key="1">
                                        <TableCell>Tony Reichert</TableCell>
                                        <TableCell>CEO</TableCell>
                                        <TableCell>Active</TableCell>
                                    </TableRow>
                                    <TableRow key="2">
                                        <TableCell>Zoey Lang</TableCell>
                                        <TableCell>Technical Lead</TableCell>
                                        <TableCell>Paused</TableCell>
                                    </TableRow>
                                    <TableRow key="3">
                                        <TableCell>Jane Fisher</TableCell>
                                        <TableCell>Senior Developer</TableCell>
                                        <TableCell>Active</TableCell>
                                    </TableRow>
                                    <TableRow key="4">
                                        <TableCell>William Howard</TableCell>
                                        <TableCell>Community Manager</TableCell>
                                        <TableCell>Vacation</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Card>
                    </Tab>
                    <Tab key="music" title="Music">
                        <Card>
                            <Table aria-label="Example static collection table">
                                <TableHeader>
                                    <TableColumn>NAME</TableColumn>
                                    <TableColumn>ROLE</TableColumn>
                                    <TableColumn>STATUS</TableColumn>
                                </TableHeader>
                                <TableBody>
                                    <TableRow key="1">
                                        <TableCell>Tony Reichert</TableCell>
                                        <TableCell>CEO</TableCell>
                                        <TableCell>Active</TableCell>
                                    </TableRow>
                                    <TableRow key="2">
                                        <TableCell>Zoey Lang</TableCell>
                                        <TableCell>Technical Lead</TableCell>
                                        <TableCell>Paused</TableCell>
                                    </TableRow>
                                    <TableRow key="3">
                                        <TableCell>Jane Fisher</TableCell>
                                        <TableCell>Senior Developer</TableCell>
                                        <TableCell>Active</TableCell>
                                    </TableRow>
                                    <TableRow key="4">
                                        <TableCell>William Howard</TableCell>
                                        <TableCell>Community Manager</TableCell>
                                        <TableCell>Vacation</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Card>
                    </Tab>

                </Tabs>

            </div>
        </div>
    );
};

export default CreateProduct;
