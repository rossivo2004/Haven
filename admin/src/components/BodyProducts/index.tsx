'use client';
import { useState } from "react";
import { useFormik } from 'formik';
import BreadcrumbNav from "../Breadcrumb/Breadcrumb";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import TableProduct from "../TableProduct";
import { Pagination } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/react";
import { Textarea } from "@nextui-org/input";

interface Animal {
    key: string;
    label: string;
}

interface FormData {
    name: string;
    category: string;
    price: string;
    discount: string;
    quantity: string;
    description: string;
    detailedDescription: string;
    images: string[];
}

const BodyProducts: React.FC = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [image, setImage] = useState<string[]>([]);

    const animals: Animal[] = [
        { key: "cat", label: "Cat" },
        { key: "dog", label: "Dog" },
        { key: "elephant", label: "Elephant" },
    ];

    const formik = useFormik<FormData>({
        initialValues: {
            name: "",
            category: "",
            price: "",
            discount: "",
            quantity: "",
            description: "",
            detailedDescription: "",
            images: []
        },
        onSubmit: (values) => {
            console.log("Form Data Submitted:", values);
            onClose(); // Close modal after submission
        }
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const previews = files.map((file) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            return new Promise<string>((resolve) => {
                reader.onloadend = () => {
                    resolve(reader.result as string);
                };
            });
        });

        Promise.all(previews).then((images) => {
            setImage(images);
            formik.setFieldValue("images", images);
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

            <Modal size="5xl" scrollBehavior="inside" isOpen={isOpen} onClose={onClose} isDismissable={false} isKeyboardDismissDisabled={true}>
                <form onSubmit={formik.handleSubmit}>
                    <ModalContent>
                        <ModalHeader className="flex flex-col gap-1">Thêm mới sản phẩm</ModalHeader>
                        <ModalBody>
                            <div className="flex gap-5 lg:flex-row flex-col mb-5">
                                <div className="lg:w-1/2 w-full">
                                    <label htmlFor="name">Tên sản phẩm</label>
                                    <Input
                                        id="name"
                                        placeholder="Tên sản phẩm"
                                        onChange={formik.handleChange}
                                        value={formik.values.name}
                                        required
                                    />
                                </div>
                                <div className="flex-1">
                                    <label htmlFor="category">Phân loại</label>
                                    <Select
                                        isRequired
                                        id="category"
                                        className="w-full"
                                        placeholder="Phân loại"
                                        aria-label="Chọn phân loại"
                                        onChange={(e) => formik.setFieldValue("category", e.target.value)}
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
                                    <label htmlFor="price">Giá sản phẩm</label>
                                    <Input
                                        id="price"
                                        type="number"
                                        placeholder="Giá sản phẩm"
                                        min={1000}
                                        onChange={formik.handleChange}
                                        value={formik.values.price}
                                        required
                                    />
                                </div>
                                <div className="flex-1">
                                    <label htmlFor="discount">Giảm giá sản phẩm</label>
                                    <Input
                                        id="discount"
                                        type="number"
                                        placeholder="Giảm giá sản phẩm"
                                        max={100}
                                        min={0}
                                        onChange={formik.handleChange}
                                        value={formik.values.discount}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex gap-5 lg:flex-row flex-col mb-5">
                                <div className="lg:w-1/2 w-full">
                                    <label htmlFor="quantity">Số lượng sản phẩm</label>
                                    <Input
                                        id="quantity"
                                        type="number"
                                        placeholder="Số lượng sản phẩm"
                                        min={0}
                                        onChange={formik.handleChange}
                                        value={formik.values.quantity}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="images">Hình ảnh</label>
                                <Input
                                    id="images"
                                    type="file"
                                    multiple
                                    onChange={handleImageChange}
                                />
                            </div>
                            <div className="grid grid-cols-5 gap-4">
                                {image.map((imgSrc, index) => (
                                    <div key={index} className="w-full h-40 bg-amber-600">
                                        <img src={imgSrc} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                            <div>
                                <label htmlFor="description">Mô tả sản phẩm</label>
                                <Textarea
                                    id="description"
                                    required
                                    variant="bordered"
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
                            <div>
                                <label htmlFor="detailedDescription">Mô tả chi tiết</label>
                                <Textarea
                                    id="detailedDescription"
                                    required
                                    rows={6}
                                    variant="bordered"
                                    placeholder="Nhập mô tả chi tiết"
                                    disableAnimation
                                    disableAutosize
                                    classNames={{
                                        base: "w-full",
                                        input: "resize-y min-h-[40px]",
                                    }}
                                    onChange={formik.handleChange}
                                    value={formik.values.detailedDescription}
                                />
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                Đóng
                            </Button>
                            <Button type="submit" color="primary">
                                Thêm
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </form>
            </Modal>

            <div>
                <div className="mb-4">
                    <TableProduct />
                </div>
                <div className="flex justify-end w-full">
                    <Pagination showControls total={10} initialPage={1} />
                </div>
            </div>
        </div>
    );
};

export default BodyProducts;
