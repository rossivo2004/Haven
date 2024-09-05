'use client'
import BreadcrumbNav from "../Breadcrumb/Breadcrumb";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import TableDiscount from "../TableDiscount";
import CustomPagination from "@/components/Pagination";
import { Pagination } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/react";
import { Textarea } from "@nextui-org/input";
import {DatePicker} from "@nextui-org/react";

function BodyDiscount() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    return (
        <div>
            <div className="flex justify-between items-center">
                <div className="py-5 h-[62px]">
                    <BreadcrumbNav
                        items={[
                            { name: 'Trang chủ', link: '/' },
                            { name: 'User', link: '#' },
                        ]}
                    />
                </div>
                <div>
                    <Button onPress={onOpen}>Thêm mã giảm giá</Button>
                    <Modal size="5xl" scrollBehavior="inside" isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} isKeyboardDismissDisabled={true}>
                        <ModalContent>
                            {(onClose) => (
                                <>
                                    <ModalHeader className="flex flex-col gap-1">Thêm mới mã giảm giá</ModalHeader>
                                    <ModalBody>
                                        <div className="flex gap-5 lg:flex-row flex-col mb-5">
                                            <div className="lg:w-1/2 w-full">
                                                <label htmlFor="">Mã </label>
                                                <Input placeholder="Tên phân loại" />
                                            </div>
                                            <div className="flex-1">
                                                <label htmlFor="">Giá trị</label>
                                                <Input placeholder="10.000 VND" type="number"/>
                                            </div>
                                        </div>
                                        <div className="flex gap-5 lg:flex-row flex-col mb-5">
                                            <div className="lg:w-1/2 w-full">
                                                <label htmlFor="">Số lượng</label>
                                                <Input placeholder="x10" type="number"/>
                                            </div>
                                            <div className="flex-1">
                                                <label htmlFor="">Ngày hết hạn</label>
                                                <DatePicker 
          className="w-full"
        />
                                            </div>
                                        </div>
                                        <div className="flex gap-5 lg:flex-row flex-col mb-5">
                                            <div className="lg:w-1/2 w-full">
                                                <label htmlFor="">Điều kiện áp dụng</label>
                                                <Input placeholder="10.000" type="number"/>
                                            </div>
                                        </div>
                                        <div>
                                            <label htmlFor="">Mô tả</label>
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
                    <TableDiscount />
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

export default BodyDiscount;