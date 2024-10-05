'use client';
import { useState, useEffect } from "react";
import { useFormik } from 'formik';
import BreadcrumbNav from "../Breadcrumb/Breadcrumb";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import { Pagination } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/react";
import { Textarea } from "@nextui-org/input";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Tooltip } from "@nextui-org/react";
import TableProduct from "../TableProduct";
import { confirmAlert } from "react-confirm-alert";

import { Category } from "@/interface";
import { Brand } from "@/interface";

import apiConfig from "@/configs/api";
import axios from "axios";
import { toast } from "react-toastify";

interface Variant {
    name: string;
    price: string;
    discount: string;
    stock: string;
    variant_value: string;
    image: string[]; // Array of images for each variant
    product_id: string; // Id of product
}

interface FormData {
    name: string;
    category_id: string;
    brand_id: string;
    description: string;
    variants: Variant[];
}

const BodyProductsV2: React.FC = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [variants, setVariants] = useState<Variant[]>([]);
    const [newVariant, setNewVariant] = useState<Variant>({ name: "", variant_value: "", price: "", discount: "", stock: "", image: [], product_id: "" });
    const [hasVariants, setHasVariants] = useState(false); // Trạng thái để theo dõi số lượng biến thể
    const [productImages, setProductImages] = useState<string[]>([]); // Trạng thái cho ảnh sản phẩm chung
    const [loading, setLoading] = useState(false);

    const [categories, setCategories] = useState<Category[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);

    

    const formik = useFormik<FormData>({
        initialValues: {
            name: "",
            category_id: "",
            brand_id: "",
            description: "",
            variants: [],
        },
        onSubmit: (values) => {
            const formData = {
                ...values,
                variants: variants.map(variant => ({
                    ...variant,
                    price: Number(variant.price),
                    discount: Number(variant.discount),
                    stock: Number(variant.stock),

                })),
                // main_image: productImages,
            };

            console.log("Form Data Submitted:", formData); // Log the data being sent

            const add = async () => {
                setLoading(true);
                try {
                    const response = await axios.post(apiConfig.products.createPr, formData, {
                        headers: {
                            accept: 'application/json',
                        },
                    });

                    console.log(response);
                    
                    toast.success('Thêm sản phẩm thành công');
                    formik.resetForm();
                } catch (error: any) {
                    if (error.response) {
                        console.error("Error response:", error.response.data); // Log the server's response
                        console.error("Validation errors:", error.response.data.errors); // Log validation errors
                        toast.error(`Error: ${error.response.data.message}`); // Show an error message
                    } else {
                        console.error("Error submitting form:", error);
                        toast.error('Đã xảy ra lỗi, vui lòng thử lại.');
                    }
                } finally {
                    setLoading(false);
                }
            };

            add();
            onClose(); // Close modal or perform any other necessary action
        },

    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, variantIndex: number) => {
        const files = Array.from(e.target.files || []);
        const previews = files.map((file) => {
            return new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    if (reader.result) {
                        resolve(reader.result as string);
                    }
                };
                reader.onerror = reject;
                reader.readAsDataURL(file); // Convert image to base64
            });
        });

        Promise.all(previews).then((image) => {
            const updatedVariants = [...variants];
            updatedVariants[variantIndex].image = image; // Set images as base64
            setVariants(updatedVariants); // Update the state to trigger re-rendering
        });
    };

    const handleProductImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const previews = files.map((file) => {
            return new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    if (reader.result) {
                        resolve(reader.result as string);
                    }
                };
                reader.onerror = reject;
                reader.readAsDataURL(file); // Convert image to base64
            });
        });

        // Promise.all(previews).then((image) => {
        //     setProductImages(image); // Cập nhật ảnh sản phẩm chung
        //     formik.setFieldValue("main_image", image); // Cập nhật vào formik
        // });
    };

    const handleAddVariant = () => {
        if (newVariant.name && newVariant.variant_value && newVariant.price && newVariant.discount && newVariant.stock) {
            setVariants([...variants, newVariant]);
            setHasVariants(true); // Cập nhật trạng thái khi thêm biến thể
            setNewVariant({ name: "", variant_value: "", price: "0", discount: "0", stock: "0", image: [], product_id: "", });
        } else {
            alert("Vui lòng điền đầy đủ thông tin biến thể.");
        }
    };

    const handleVariantChange = (index: number, field: keyof Variant, value: string | string[]) => {
        const updatedVariants = [...variants];

        if (field === 'image') {
            if (Array.isArray(value)) {
                updatedVariants[index][field] = value as string[]; // Updating images with string[]
            } else {
                console.error("Expected an array for images");
            }
        } else if (field === 'price' || field === 'discount' || field === 'stock') {
            updatedVariants[index][field] = String(value); // Convert to number for numeric fields
        } else {
            updatedVariants[index][field] = value as string; // For all other fields, treat as string
        }

        setVariants(updatedVariants);
    };


    const removeVariant = (index: number) => {
        const updatedVariants = variants.filter((_, i) => i !== index);
        setVariants(updatedVariants);
        formik.setFieldValue("variants", updatedVariants);
    };

    const handleDelete = (id: number) => {
        confirmAlert({
            title: 'Xóa sản phẩm',
            message: 'Bạn có chắc muốn xóa sản phẩm?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        console.log('Deleted user with id:', id);
                        // Thực hiện xóa sản phẩm tại đây
                    }
                },
                {
                    label: 'No',
                }
            ]
        });
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
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchBrands();
    }, []);

    return (
        <div>
            <div className="flex justify-between items-center">
                <div className="py-5 h-[62px]">
                    <BreadcrumbNav
                        items={[{ name: 'Trang chủ', link: '/' }, { name: 'Sản phẩm', link: '#' }]}
                    />
                </div>
                <div>
                    <Button onPress={onOpen}>Thêm sản phẩm</Button>
                </div>
            </div>

            {/* Form thêm sản phẩm */}
            <Modal size="5xl" scrollBehavior="inside" isOpen={isOpen} onClose={onClose} isDismissable={false} isKeyboardDismissDisabled={true}>
                <form onSubmit={formik.handleSubmit}>
                    <ModalContent>
                        <ModalHeader className="flex flex-col gap-1">Thêm mới sản phẩm</ModalHeader>
                        <ModalBody>
    <div className="flex gap-5 lg:flex-row flex-col mb-5">
        <div className="lg:w-1/2 w-full">
            <label htmlFor="name" className="block mb-1">Tên sản phẩm</label>
            <Input
                id="name"
                name="name"
                placeholder="Tên sản phẩm"
                onChange={formik.handleChange}
                value={formik.values.name}
                required
            />
            {formik.touched.name && formik.errors.name ? (
                <div className="text-red-500">{formik.errors.name}</div>
            ) : null}
        </div>
        <div className="flex-1">
            <label htmlFor="category_id" className="block mb-1">Phân loại</label>
            <Select
                isRequired
                id="category_id"
                name="category_id"
                className="w-full"
                placeholder="Phân loại"
                aria-label="Chọn phân loại"
                onChange={(event) => formik.setFieldValue("category_id", event.target.value)}
                value={formik.values.category_id}
            >
                {categories.map((animal) => (
                    <SelectItem key={animal.id} value={animal.id}>
                        {animal.name}
                    </SelectItem>
                ))}
            </Select>
            {formik.touched.category_id && formik.errors.category_id ? (
                <div className="text-red-500">{formik.errors.category_id}</div>
            ) : null}
        </div>
    </div>
    <div className="flex gap-5 lg:flex-row flex-col mb-5">
        <div className="lg:w-1/2 w-full">
            <label htmlFor="brand_id" className="block mb-1">Thương hiệu</label>
            <Select
                isRequired
                id="brand_id"
                name="brand_id"
                className="w-full"
                placeholder="Thương hiệu"
                onChange={(event) => formik.setFieldValue("brand_id", event.target.value)}
                value={formik.values.brand_id}
                aria-label="Chọn thương hiệu"
            >
                {brands.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                        {b.name}
                    </SelectItem>
                ))}
            </Select>
            {formik.touched.brand_id && formik.errors.brand_id ? (
                <div className="text-red-500">{formik.errors.brand_id}</div>
            ) : null}
        </div>
    </div>

    {/* Product Image Upload */}
    {/* <div className="mb-5">
        <label htmlFor="main_image" className="block mb-1">Ảnh sản phẩm</label>
        <Input
            id="main_image"
            type="file"
            multiple
            accept="image/*"
            onChange={handleProductImageChange}
        />
        <div className="flex gap-2 mt-2">
            {productImages.map((img, imgIndex) => (
                <img
                    key={imgIndex}
                    src={img}
                    alt={`product-img-${imgIndex}`}
                    className="w-16 h-16 object-cover"
                />
            ))}
        </div>
    </div> */}

    <div>
        <label htmlFor="description">Mô tả sản phẩm</label>
        <Textarea
            id="description"
            name="description"
            rows={6}
            required
            placeholder="Nhập mô tả sản phẩm"
            disableAnimation
            disableAutosize
            classNames={{
                base: "w-full",
                input: "resize-y min-h-[40px]",
            }}
            onChange={formik.handleChange}
            value={formik.values.description}
        />
    </div>

    {/* Variants Section */}
    <div className="mb-5">
        <h3 className="text-lg font-semibold mb-3">Thêm biến thể sản phẩm</h3>
        <div className="flex flex-col gap-3 mb-3">
            <div className="flex gap-3 mb-3">
                <Input
                    placeholder="Tên biến thể"
                    value={newVariant.name}
                    onChange={(e) => setNewVariant({ ...newVariant, name: e.target.value })}
                    required={!hasVariants}
                />
                <Input
                    placeholder="Tag biến thể (e.g., Lon, Lốc)"
                    value={newVariant.variant_value}
                    onChange={(e) => setNewVariant({ ...newVariant, variant_value: e.target.value })}
                    required={!hasVariants}
                />
                <Input
                    type="number"
                    placeholder="Giá biến thể"
                    value={newVariant.price !== "" ? newVariant.price : ""}
                    onChange={(e) => setNewVariant({ ...newVariant, price: e.target.value })}
                    required={!hasVariants}
                />
                <Input
                    type="number"
                    placeholder="Giá giảm (Sale Price)"
                    value={newVariant.discount !== "" ? newVariant.discount : ""}
                    onChange={(e) => setNewVariant({ ...newVariant, discount: e.target.value })}
                    required={!hasVariants}
                />
                <Input
                    type="number"
                    placeholder="Số lượng"
                    value={newVariant.stock !== "" ? newVariant.stock : ""}
                    onChange={(e) => setNewVariant({ ...newVariant, stock: e.target.value })}
                    required={!hasVariants}
                />
            </div>

            <div>
                <Input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        const previews = files.map((file) => {
                            return new Promise<string>((resolve, reject) => {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                    if (reader.result) {
                                        resolve(reader.result as string);
                                    }
                                };
                                reader.onerror = reject;
                                reader.readAsDataURL(file);
                            });
                        });

                        Promise.all(previews).then((image) => {
                            setNewVariant({ ...newVariant, image });
                        });
                    }}
                />
            </div>

            <div className="flex gap-2 mt-2">
                {newVariant.image.map((img, imgIndex) => (
                    <img
                        key={imgIndex}
                        src={img}
                        alt={`new-variant-img-${imgIndex}`}
                        className="w-16 h-16 object-cover"
                    />
                ))}
            </div>

            <Button type="button" onPress={handleAddVariant}>Thêm biến thể</Button>
        </div>

        {/* Display existing variants */}
        <div className="mt-4">
            {variants.map((variant, index) => (
                <div key={index} className="flex flex-col gap-3 mb-2 border p-3 rounded">
                    <div className="flex gap-3 items-center">
                        <Input
                            placeholder="Tên biến thể"
                            value={variant.name}
                            onChange={(e) => handleVariantChange(index, "name", e.target.value)}
                            required
                        />
                        <Input
                            placeholder="Tag biến thể"
                            value={variant.variant_value}
                            onChange={(e) => handleVariantChange(index, "variant_value", e.target.value)}
                            required
                        />
                        <Input
                            type="number"
                            placeholder="Giá biến thể"
                            value={variant.price.toString()}
                            onChange={(e) => handleVariantChange(index, "price", e.target.value)}
                            required
                        />
                        <Input
                            type="number"
                            placeholder="Giá giảm (Sale Price)"
                            value={variant.discount?.toString() || ''}
                            onChange={(e) => handleVariantChange(index, "discount", e.target.value)}
                            required
                        />
                        <Input
                            type="number"
                            placeholder="Số lượng"
                            value={variant.stock.toString()}
                            onChange={(e) => handleVariantChange(index, "stock", e.target.value)}
                            required
                        />
                        <Button color="danger" onPress={() => removeVariant(index)}>Xóa</Button>
                    </div>

                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, index)}
                    />
                    <div className="flex gap-2 mt-2">
                        {variant.image.map((img, imgIndex) => (
                            <img
                                key={imgIndex}
                                src={img}
                                alt={`variant-img-${imgIndex}`}
                                className="w-16 h-16 object-cover"
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    </div>
</ModalBody>    
                        <ModalFooter>
                            <Button type="submit" color="primary">Lưu</Button>
                            <Button type="button" onPress={onClose}>Hủy</Button>
                        </ModalFooter>
                    </ModalContent>
                </form>
            </Modal>
            {/* ///////////////////*/}
            <div className="mt-5">
                <TableProduct />
                <div className="mt-5 flex justify-center">
                    <Pagination total={5} initialPage={1} />
                </div>
            </div>
        </div>
    );
};

export default BodyProductsV2;
