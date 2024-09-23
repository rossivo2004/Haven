'use client';
import { useState } from "react";
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


interface Animal {
    key: string;
    label: string;
}

interface Variant {
    name: string;
    price: string;
    salePrice: string;
    quantity: string;
    images: string[]; // Array of images for each variant
}

interface FormData {
    name: string;
    category: string;
    brand: string;
    description: string;
    variants: Variant[];
}

const BodyProductsV2: React.FC = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [variants, setVariants] = useState<Variant[]>([]);
    const [newVariant, setNewVariant] = useState<Variant>({ name: "", price: "", salePrice: "", quantity: "", images: [] });
    const [hasVariants, setHasVariants] = useState(false); // Trạng thái để theo dõi số lượng biến thể

    const animals: Animal[] = [
        { key: "beverage", label: "Beverage" },
        { key: "snacks", label: "Snacks" },
        { key: "electronics", label: "Electronics" },
    ];

    const brands: Animal[] = [
        { key: "pepsi", label: "Pepsi" },
        { key: "coca", label: "Coca-Cola" },
        { key: "fanta", label: "Fanta" },
    ];

    const formik = useFormik<FormData>({
        initialValues: {
            name: "",
            category: "",
            brand: "",
            description: "",
            variants: [],
        },
        onSubmit: (values) => {
            const formData = {
                ...values,
                variants: variants,
            };
            console.log("Form Data Submitted:", formData);
            onClose();
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

        Promise.all(previews).then((images) => {
            const updatedVariants = [...variants];
            updatedVariants[variantIndex].images = images; // Set images as base64
            setVariants(updatedVariants); // Update the state to trigger re-rendering
        });
    };

    const handleAddVariant = () => {
        if (newVariant.name && newVariant.price && newVariant.salePrice && newVariant.quantity) {
            setVariants([...variants, newVariant]);
            setHasVariants(true); // Cập nhật trạng thái khi thêm biến thể
            setNewVariant({ name: "", price: "", salePrice: "", quantity: "", images: [] });
        } else {
            alert("Vui lòng điền đầy đủ thông tin biến thể.");
        }
    };

    const handleVariantChange = (index: number, field: keyof Variant, value: string | string[]) => {
        const updatedVariants = [...variants];

        if (field === 'images') {
            if (Array.isArray(value)) {
                updatedVariants[index][field] = value as string[];  // Updating images with string[]
            } else {
                console.error("Expected an array for images");
            }
        } else {
            updatedVariants[index][field] = value as string;  // Updating other fields with string
        }

        setVariants(updatedVariants);
    };

    const removeVariant = (index: number) => {
        setVariants(variants.filter((_, i) => i !== index));
        formik.setFieldValue("variants", variants.filter((_, i) => i !== index));
    };

    const handleDelete = (userId: number) => {
        confirmAlert({
            title: 'Xóa sản phẩm',
            message: 'Bạn có chắc muốn xóa sản phẩm?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        console.log('Deleted user with id:', userId);
                    }
                },
                {
                    label: 'No',
                }
            ]
        });
    };

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
                                        placeholder="Tên sản phẩm"
                                        onChange={formik.handleChange}
                                        value={formik.values.name}
                                        required
                                    />
                                </div>
                                <div className="flex-1">
                                    <label htmlFor="category" className="block mb-1">Phân loại</label>
                                    <Select
                                        isRequired
                                        id="category"
                                        className="w-full"
                                        placeholder="Phân loại"
                                        aria-label="Chọn phân loại"
                                        onChange={(value) => formik.setFieldValue("category", value)}
                                        value={formik.values.category}
                                    >
                                        {animals.map((animal) => (
                                            <SelectItem key={animal.key} value={animal.key}>
                                                {animal.label}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                </div>
                            </div>
                            <div className="flex gap-5 lg:flex-row flex-col mb-5">
                                <div className="lg:w-1/2 w-full">
                                    <label htmlFor="brand-select" className="block mb-1">Thương hiệu</label>
                                    <Select
                                        id="brand-select"
                                        className="w-full"
                                        placeholder="Thương hiệu"
                                        onChange={(value) => formik.setFieldValue("brand", value)}
                                        value={formik.values.brand}
                                        aria-label="Chọn thương hiệu"
                                    >
                                        {brands.map((b) => (
                                            <SelectItem key={b.key} value={b.key}>
                                                {b.label}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="description">Mô tả sản phẩm</label>
                                <Textarea
                                    id="description"
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

                            {/* Section for Variants */}
                            <div className="mb-5">
                                <h3 className="text-lg font-semibold mb-3">Thêm biến thể sản phẩm</h3>
                                <div className="flex flex-col gap-3 mb-3">
                                    <div className="flex gap-3 mb-3">
                                        <Input
                                            placeholder="Tên biến thể (e.g., Lon, Lốc)"
                                            value={newVariant.name}
                                            onChange={(e) => setNewVariant({ ...newVariant, name: e.target.value })}
                                            required={!hasVariants} // Bỏ required nếu đã có biến thể
                                        />
                                        <Input
                                            type="number"
                                            placeholder="Giá biến thể"
                                            value={newVariant.price}
                                            onChange={(e) => setNewVariant({ ...newVariant, price: e.target.value })}
                                            required={!hasVariants} // Bỏ required nếu đã có biến thể
                                        />
                                        <Input
                                            type="number"
                                            placeholder="Giá giảm (Sale Price)"
                                            value={newVariant.salePrice}
                                            onChange={(e) => setNewVariant({ ...newVariant, salePrice: e.target.value })}
                                            required={!hasVariants} // Bỏ required nếu đã có biến thể
                                        />
                                        <Input
                                            type="number"
                                            placeholder="Số lượng"
                                            value={newVariant.quantity}
                                            onChange={(e) => setNewVariant({ ...newVariant, quantity: e.target.value })}
                                            required={!hasVariants} // Bỏ required nếu đã có biến thể
                                        />
                                    </div>

                                    {/* Input file ảnh ngay tại đây */}
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
                                                        reader.readAsDataURL(file); // Convert image to base64
                                                    });
                                                });

                                                Promise.all(previews).then((images) => {
                                                    setNewVariant({ ...newVariant, images });
                                                });
                                            }}
                                        />
                                    </div>

                                    {/* Hiển thị ảnh preview */}
                                    <div className="flex gap-2 mt-2">
                                        {newVariant.images.map((img, imgIndex) => (
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
                                        <div key={index} className="flex flex-col gap-3 mb-2">
                                            <div className="flex gap-3 items-center">
                                                <Input
                                                    placeholder="Tên biến thể"
                                                    value={variant.name}
                                                    onChange={(e) => handleVariantChange(index, "name", e.target.value)}
                                                    required
                                                />
                                                <Input
                                                    type="number"
                                                    placeholder="Giá biến thể"
                                                    value={variant.price}
                                                    onChange={(e) => handleVariantChange(index, "price", e.target.value)}
                                                    required
                                                />
                                                <Input
                                                    type="number"
                                                    placeholder="Giá giảm (Sale Price)"
                                                    value={variant.salePrice}
                                                    onChange={(e) => handleVariantChange(index, "salePrice", e.target.value)}
                                                    required
                                                />
                                                <Input
                                                    type="number"
                                                    placeholder="Số lượng"
                                                    value={variant.quantity}
                                                    onChange={(e) => handleVariantChange(index, "quantity", e.target.value)}
                                                    required
                                                />
                                                <Button color="danger" onPress={() => removeVariant(index)}>Xóa</Button>
                                            </div>

                                            {/* Image upload for each variant */}
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                onChange={(e) => handleImageChange(e, index)}
                                            />

                                            {/* Display uploaded images */}
                                            <div className="flex gap-2 mt-2">
                                                {variant.images.map((img, imgIndex) => (
                                                    <img
                                                        key={imgIndex}
                                                        src={img}
                                                        alt={`variant-${index}-img-${imgIndex}`}
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
