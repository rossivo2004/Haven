'use client'
import BreadcrumbNav from "../Breadcrumb/Breadcrumb";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import TableProduct from "../TableProduct";
import CustomPagination from "@/components/Pagination";
import { Pagination } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/react";
import { Textarea } from "@nextui-org/input";

function BodyProducts() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const animals = [
        { key: "cat", label: "Cat" },
        { key: "dog", label: "Dog" },
        { key: "elephant", label: "Elephant" },

    ];

    return (
        <div>
            <div className="flex justify-between items-center">
                <div className="py-5 h-[62px]">
                    <BreadcrumbNav
                        items={[
                            { name: 'Trang chủ', link: '/' },
                            { name: 'Sản phẩm', link: '#' },
                        ]}
                    />
                </div>
                <div>
                    <Button onPress={onOpen}>Thêm sản phẩm</Button>
                    <Modal size="5xl" scrollBehavior="inside" isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} isKeyboardDismissDisabled={true}>
                        <ModalContent>
                            {(onClose) => (
                                <>
                                    <ModalHeader className="flex flex-col gap-1">Thêm mới sản phẩm</ModalHeader>
                                    <ModalBody>
                                        <div className="flex gap-5 lg:flex-row flex-col mb-5">
                                            <div className="lg:w-1/2 w-full">
                                                <label htmlFor="">Tên sản phẩm</label>
                                                <Input placeholder="Tên sản phẩm" />
                                            </div>
                                            <div className="flex-1">
                                                <label htmlFor="">Phân loại</label>
                                                <Select
                                                    className="w-full"
                                                    placeholder="Phân loại"
                                                >
                                                    {animals.map((animal) => (
                                                        <SelectItem key={animal.key}>
                                                            {animal.label}
                                                        </SelectItem>
                                                    ))}
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="flex gap-5 lg:flex-row flex-col mb-5">
                                            <div className="lg:w-1/2 w-full">
                                                <label htmlFor="">Giá sản phẩm</label>
                                                <Input type="number" placeholder="Giá sản phẩm" />
                                            </div>
                                            <div className="flex-1">
                                                <label htmlFor="">Giảm giá sản phẩm</label>
                                                <Input max={100} type="number" placeholder="Giảm giá sản phẩm" />
                                            </div>
                                        </div>
                                        <div className="flex gap-5 lg:flex-row flex-col mb-5">
                                            <div className="lg:w-1/2 w-full">
                                                <label htmlFor="">Số lượng sản phẩm</label>
                                                <Input type="number" placeholder="Giá sản phẩm" />
                                            </div>
                                            <div className="flex-1">
                                                <label htmlFor="">Cân nặng sản phẩm (g)</label>
                                                <Input type="number" placeholder="Giảm giá sản phẩm" />
                                            </div>
                                        </div>
                                        <div>
                                            <label htmlFor="">Hình ảnh</label>
                                            <Input type="file" />
                                        </div>
                                        <div>
                                            <label htmlFor="">Mô tả sản phẩm</label>
                                            <Textarea
                                                variant="bordered"
                                                placeholder="Enter your description"
                                                disableAnimation
                                                disableAutosize
                                                classNames={{
                                                    base: "w-full",
                                                    input: "resize-y min-h-[40px]",
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="">Mô tả cchi tiết</label>
                                            <Textarea
                                                variant="bordered"
                                                placeholder="Enter your description"
                                                disableAnimation
                                                disableAutosize
                                                classNames={{
                                                    base: "w-full",
                                                    input: "resize-y min-h-[40px]",
                                                }}
                                            />
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
                    <TableProduct />
                </div>
                <div className="flex justify-end w-full">
                    {/* <CustomPagination
                    totalItems={filteredProducts.length}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={(page: number) => setCurrentPage(page)}
                /> */}
                    <Pagination showControls total={10} initialPage={1} />
                </div>
            </div>
        </div>
    );
}

export default BodyProducts;