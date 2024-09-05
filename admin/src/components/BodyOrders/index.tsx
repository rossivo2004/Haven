'use client'
import BreadcrumbNav from "../Breadcrumb/Breadcrumb";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import TableOrder from "../TableOrder";
import CustomPagination from "@/components/Pagination";
import { Pagination } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/react";
import { Textarea } from "@nextui-org/input";

function BodyOrders() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    return (
        <div>
            <div className="flex justify-between items-center">
                <div className="py-5 h-[62px]">
                    <BreadcrumbNav
                        items={[
                            { name: 'Trang chủ', link: '/' },
                            { name: 'Đơn hàng', link: '#' },
                        ]}
                    />
                </div>
            </div>

            <div>
                <div className="mb-4">
                    <TableOrder />
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

export default BodyOrders;