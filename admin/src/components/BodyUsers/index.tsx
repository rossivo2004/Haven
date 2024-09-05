'use client'
import BreadcrumbNav from "../Breadcrumb/Breadcrumb";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import TableUser from "../TableUser";
import CustomPagination from "@/components/Pagination";
import { Pagination } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/react";
import { Textarea } from "@nextui-org/input";

function BodyUsers() {
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
                    <Button onPress={onOpen}>Thêm user</Button>
                    <Modal size="5xl" scrollBehavior="inside" isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} isKeyboardDismissDisabled={true}>
                        <ModalContent>
                            {(onClose) => (
                                <>
                                    <ModalHeader className="flex flex-col gap-1">Thêm mới user</ModalHeader>
                                    <ModalBody>
                                        <div className="flex gap-5 lg:flex-row flex-col mb-5">
                                            <div className="lg:w-1/2 w-full">
                                                <label htmlFor="">User name</label>
                                                <Input placeholder="Tên phân loại" />
                                            </div>
                                            <div className="flex-1">
                                                <label htmlFor="">Full name</label>
                                                <Input placeholder="Full name" />
                                            </div>
                                        </div>
                                        <div className="flex gap-5 lg:flex-row flex-col mb-5">
                                            <div className="lg:w-1/2 w-full">
                                                <label htmlFor="">Số điện thoại</label>
                                                <Input placeholder="Tên phân loại" />
                                            </div>
                                            <div className="flex-1">
                                                <label htmlFor="">Email</label>
                                                <Input placeholder="Email" />
                                            </div>
                                        </div>
                                        <div>
                                            <label htmlFor="">Địa chỉ</label>
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
                                            <label htmlFor="">Hình ảnh</label>
                                            <Input type="file" />
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
                    <TableUser />
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

export default BodyUsers;