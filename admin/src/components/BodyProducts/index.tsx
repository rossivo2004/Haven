'use client';
import { useState, useEffect } from "react";
import { useFormik } from 'formik';
import BreadcrumbNav from "../Breadcrumb/Breadcrumb";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import { Pagination } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/react";
import { Textarea } from "@nextui-org/input";
import { confirmAlert } from "react-confirm-alert";
import { Category, Brand } from "@/interface";
import apiConfig from "@/configs/api";
import axios from "axios";
import { toast } from "react-toastify";

// FormData with Variant properties inside it
interface FormData {
    name_product: string;
    category_id: string;
    brand_id: string;
    description: string;
    images: string[];
    name: string[];
    price: string[];
    discount: string[];
    stock: string[];
    variant_value: string[];
    image: string[];
}

const BodyProductsV2: React.FC = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [variants, setVariants] = useState<{ name: string[], variant_value: string[], price: string[], discount: string[], stock: string[], image: string[] }[]>([]);
    const [newVariant, setNewVariant] = useState<{ name: string[], variant_value: string[], price: string[], discount: string[], stock: string[], image: string[] }>({
        name: [""],
        variant_value: [""],
        price: ["0"],
        discount: ["0"],
        stock: ["0"],
        image: [],
    });
    const [hasVariants, setHasVariants] = useState(false);
    const [productImages, setProductImages] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);

    const [image, setImage] = useState<File | null>(null);
    const [imageVa, setImageVa] = useState<File | null>(null);


    const formik = useFormik<FormData>({
        initialValues: {
            name_product: "",
            category_id: "",
            brand_id: "",
            description: "",
            images: [],
            name: [],
            price: [],
            discount: [],
            stock: [],
            variant_value: [],
            image: [],
        },
        onSubmit: (values) => {
            // Kiểm tra và thêm các giá trị mặc định nếu cần thiết
            const formData = {
                ...values,
                images: productImages.length > 0 ? productImages : [],
             
            };

            console.log("Form Data Submitted:", formData); // Log the data being sent

            const add = async () => {
                setLoading(true);
                try {
                    const response = await axios.post(apiConfig.products.createPr, formData, {
                        headers: { accept: 'application/json' },
                    });
                    console.log(response);
                    toast.success('Thêm sản phẩm thành công');
                    formik.resetForm();
                } catch (error: any) {
                    if (error.response) {
                        console.error("Error response:", error.response.data);
                        toast.error(`Error: ${error.response.data.message}`);
                    } else {
                        console.error("Error submitting form:", error);
                        toast.error('Đã xảy ra lỗi, vui lòng thử lại.');
                    }
                } finally {
                    setLoading(false);
                }
            };

            add();
            onClose();
        },
    });

    const handleAddVariant = () => {
        if (newVariant.name && newVariant.variant_value && newVariant.price && newVariant.discount && newVariant.stock) {
            const updatedVariants = [...variants, newVariant];
            setVariants(updatedVariants);
     
            // Cập nhật formik values với biến thể mới
            formik.setFieldValue("name", updatedVariants.map(variant => variant.name).flat());
            formik.setFieldValue("price", updatedVariants.map(variant => variant.price).flat());
            formik.setFieldValue("discount", updatedVariants.map(variant => variant.discount).flat());
            formik.setFieldValue("stock", updatedVariants.map(variant => variant.stock).flat());
            formik.setFieldValue("variant_value", updatedVariants.map(variant => variant.variant_value).flat());
            formik.setFieldValue("image", updatedVariants.map(variant => variant.image).flat()); // Cập nhật hình ảnh đúng cách
            
            setHasVariants(true);
            setNewVariant({ name: [""], variant_value: [""], price: ["0"], discount: ["0"], stock: ["0"], image: [] });
        } else {
            alert("Vui lòng điền đầy đủ thông tin biến thể.");
        }
    };
    
    

    const handleVariantChange = (index: number, field: keyof typeof newVariant, value: string | string[]) => {
        const updatedVariants = [...variants];
        if (Array.isArray(value)) {
            updatedVariants[index][field] = value;
        } else {
            updatedVariants[index][field] = [value];
        }
        
        setVariants(updatedVariants);
    
        // Cập nhật formik values với biến thể mới
      formik.setFieldValue("name", updatedVariants.map(variant => variant.name).flat());

        formik.setFieldValue("price", updatedVariants.map(variant => variant.price).flat());
        formik.setFieldValue("discount", updatedVariants.map(variant => variant.discount).flat());
        formik.setFieldValue("stock", updatedVariants.map(variant => variant.stock).flat());
        formik.setFieldValue("variant_value", updatedVariants.map(variant => variant.variant_value).flat());
        formik.setFieldValue("image", updatedVariants.map(variant => variant.image));
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
                    }
                },
                { label: 'No' }
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
            console.error('Error fetching brands:', error);
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchBrands();
    }, []);

    const handleProductImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const imageUrls = files.map(file => URL.createObjectURL(file));
    
        setProductImages(imageUrls);  // Store preview URLs for display
        formik.setFieldValue("images", files);  // Store actual files for upload
    };

const handleVariantImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
        const updatedVariants = [...variants];
        const newImages = Array.from(files).map(file => URL.createObjectURL(file)); // Tạo URL cho hình ảnh

        updatedVariants[index].image = newImages;  // Lưu hình ảnh vào biến thể
        setVariants(updatedVariants);
        formik.setFieldValue("image", updatedVariants.map(variant => variant.image).flat()); // Cập nhật formik values
    }
};

    

    return (
        <div>
            <div className="flex justify-between items-center">
                <div className="py-5 h-[62px]">
                    <BreadcrumbNav items={[{ name: 'Trang chủ', link: '/' }, { name: 'Sản phẩm', link: '#' }]} />
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
                                    <label htmlFor="name_product" className="block mb-1">Tên sản phẩm</label>
                                    <Input
                                        id="name_product"
                                        name="name_product"
                                        placeholder="Tên sản phẩm"
                                        onChange={formik.handleChange}
                                        value={formik.values.name_product}
                                        required
                                    />
                                    {formik.touched.name_product && formik.errors.name_product ? (
                                        <div className="text-red-500">{formik.errors.name_product}</div>
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
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.id}>
                                                {cat.name}
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
                                        aria-label="Chọn thương hiệu"
                                        onChange={(event) => formik.setFieldValue("brand_id", event.target.value)}
                                        value={formik.values.brand_id}
                                    >
                                        {brands.map((brand) => (
                                            <SelectItem key={brand.id} value={brand.id}>
                                                {brand.name}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                    {formik.touched.brand_id && formik.errors.brand_id ? (
                                        <div className="text-red-500">{formik.errors.brand_id}</div>
                                    ) : null}
                                </div>
                            </div>
                            <div className="mb-5">
                                <label htmlFor="description" className="block mb-1">Mô tả sản phẩm</label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    placeholder="Mô tả sản phẩm"
                                    onChange={formik.handleChange}
                                    value={formik.values.description}
                                    required
                                />
                            </div>
                            <div className="mb-5">
    <label htmlFor="productImages" className="block mb-1">Hình ảnh sản phẩm</label>
    <input
        type="file"
        id="productImages"
        name="productImages"
        accept="image/*"
        multiple
        onChange={handleProductImagesChange}
    />
    {productImages.length > 0 && (
        <div className="flex mt-3 gap-2">
            {productImages.map((image, index) => (
                <img key={index} src={image} alt={`Product Preview ${index}`} className="w-20 h-20 object-cover" />
            ))}
        </div>
    )}
</div>


                            {/* Biến thể */}
                            <div className="mb-5">
                                <h2 className="mb-3">Biến thể sản phẩm</h2>
                                {variants.map((variant, index) => (
                                    <div key={index} className="border p-4 mb-4">
                                        <div className="flex gap-5">
                                            <div className="flex-1">
                                                <label htmlFor={`variant_name_${index}`} className="block mb-1">Tên biến thể</label>
                                                <Input
                                                    id={`variant_name_${index}`}
                                                    name={`variants[${index}].name`}
                                                    placeholder="Tên biến thể"
                                                    onChange={(e) => handleVariantChange(index, "name", e.target.value)}
                                                    value={variant.name[0]}
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <label htmlFor={`variant_value_${index}`} className="block mb-1">Giá trị biến thể</label>
                                                <Input
                                                    id={`variant_value_${index}`}
                                                    name={`variants[${index}].variant_value`}
                                                    placeholder="Giá trị biến thể"
                                                    onChange={(e) => handleVariantChange(index, "variant_value", e.target.value)}
                                                    value={variant.variant_value[0]}
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <label htmlFor={`variant_price_${index}`} className="block mb-1">Giá bán</label>
                                                <Input
                                                    id={`variant_price_${index}`}
                                                    name={`variants[${index}].price`}
                                                    placeholder="Giá bán"
                                                    onChange={(e) => handleVariantChange(index, "price", e.target.value)}
                                                    value={variant.price[0]}
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <label htmlFor={`variant_discount_${index}`} className="block mb-1">Giảm giá</label>
                                                <Input
                                                    id={`variant_discount_${index}`}
                                                    name={`variants[${index}].discount`}
                                                    placeholder="Giảm giá"
                                                    onChange={(e) => handleVariantChange(index, "discount", e.target.value)}
                                                    value={variant.discount[0]}
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <label htmlFor={`variant_stock_${index}`} className="block mb-1">Tồn kho</label>
                                                <Input
                                                    id={`variant_stock_${index}`}
                                                    name={`variants[${index}].stock`}
                                                    placeholder="Tồn kho"
                                                    onChange={(e) => handleVariantChange(index, "stock", e.target.value)}
                                                    value={variant.stock[0]}
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-3">
    <label htmlFor={`variant_image_${index}`} className="block mb-1">Hình ảnh biến thể</label>
    <input
        type="file"
        id={`variant_image_${index}`}
        name={`variants[${index}].image`}
        accept="image/*"
        onChange={(e) => handleVariantImageChange(index, e)}
    />
    {variant.image.length > 0 && (
        <div className="flex mt-3 gap-2">
            {variant.image.map((image, idx) => (
                <img key={idx} src={image} alt={`Variant Preview ${idx}`} className="w-20 h-20 object-cover" />
            ))}
        </div>
    )}
</div>

                                        <div className="mt-3 flex justify-end">
                                            <Button color="danger" onClick={() => removeVariant(index)}>Xóa biến thể</Button>
                                        </div>
                                    </div>
                                ))}
                                <Button className="mt-4" onClick={handleAddVariant}>Thêm biến thể</Button>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" onClick={onClose}>Hủy</Button>
                            <Button type="submit" isLoading={loading} disabled={loading}>Lưu</Button>
                        </ModalFooter>
                    </ModalContent>
                </form>
            </Modal>

            {/* Table hiển thị sản phẩm */}
            {/* <TableProduct handleDelete={handleDelete} /> */}
            <div className="flex justify-center mt-5">
                <Pagination total={10} initialPage={1} />
            </div>
        </div>
    );
};

export default BodyProductsV2;
