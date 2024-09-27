'use client';
import { useState, ChangeEvent, useEffect } from "react";
import BreadcrumbNav from "../Breadcrumb/Breadcrumb";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import TableBrand from "../TableBrand";
import CustomPagination from "@/components/Pagination";
import { Pagination } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import axios from "axios";
import { Brand } from "@/interface";

const BodyBrand: React.FC = () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [image, setImage] = useState<string[]>([]); // Image state
    const [brand, setBrand] = useState<Brand[]>([]);
    

    // Function to handle file input change (if you want to store the image as base64 or file path)
    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const fileArray = Array.from(files).map(file => URL.createObjectURL(file)); // Preview images
            setImage(fileArray);
        }
    };

    const fetch = async () => {
        try {
            const response = await axios.get(`${baseUrl}/api/brand`, { withCredentials: true });
            setBrand(response.data.categories);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    console.log(brand);
    

    useEffect(() => {
        fetch();
    }, []);

    return (
        <div>
            <div className="flex justify-between items-center">
                <div className="py-5 h-[62px]">
                    <BreadcrumbNav
                        items={[
                            { name: 'Trang chủ', link: '/' },
                            { name: 'Thương hiệu', link: '#' },
                        ]}
                    />
                </div>
                <div>
                    <Button onPress={onOpen}>Thêm thương hiệu</Button>
                    <Modal size="5xl" scrollBehavior="inside" isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} isKeyboardDismissDisabled={true}>
                        <ModalContent>
                            {(onClose) => (
                                <>
                                    <ModalHeader className="flex flex-col gap-1">Thêm mới thương hiệu</ModalHeader>
                                    <ModalBody>
                                        <div className="flex gap-5 lg:flex-row flex-col mb-5">
                                            <div className="lg:w-1/2 w-full">
                                                <label htmlFor="">Tên thương hiệu</label>
                                                <Input placeholder="Tên thương hiệu" />
                                            </div>
                                            <div className="flex-1">
                                                <label htmlFor="">Tag thương hiệu</label>
                                                <Input placeholder="Tag thương hiệu" />
                                            </div>
                                        </div>
                                        <div>
                                            <label htmlFor="">Hình ảnh</label>
                                            <Input type="file" className="mb-2" onChange={handleImageChange} />
                                            <div className="">
                                                {image.length > 0 && <img src={image[0]} alt="Preview" className="h-20 w-20 object-cover" />}
                                            </div>
                                        </div>
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="danger" variant="light" onPress={onClose}>
                                            Đóng
                                        </Button>
                                        <Button color="primary" onPress={onClose}>
                                            Thêm
                                        </Button>
                                    </ModalFooter>
                                </>
                            )}
                        </ModalContent>
                    </Modal>
                </div>
            </div>

            <div>
                <div className="mb-4">
                    <TableBrand />
                </div>
                <div className="flex justify-end w-full">
                    {/* Custom pagination component */}
                    {/* 
                        <CustomPagination
                            totalItems={filteredProducts.length}
                            itemsPerPage={itemsPerPage}
                            currentPage={currentPage}
                            onPageChange={(page: number) => setCurrentPage(page)}
                        /> 
                    */}
                    <Pagination showControls total={10} initialPage={1} />
                </div>
            </div>
        </div>
    );
};

export default BodyBrand;
