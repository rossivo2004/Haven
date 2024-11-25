import React, { useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Tooltip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, useDisclosure } from "@nextui-org/react";
import { EditIcon } from "./EditIcon";
import { DeleteIcon } from "./DeleteIcon";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { Category } from "@/interface";
import {Spinner} from "@nextui-org/spinner";
interface TableCategoryProps {
    categories: Category[] | null; // Expecting an array of Category or null
}

const TableCategory: React.FC<TableCategoryProps> = ({ categories }) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [loading, setLoading] = useState(false); // State for loading
    const [editingCategory, setEditingCategory] = useState<Category | null>(null); // For storing the category being edited

    const handleDelete = (categoryId: string) => {
        confirmAlert({
            title: 'Xóa phân loại',
            message: 'Bạn có chắc muốn xóa phân loại này?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        setLoading(true); // Start loading
                        // console.log('Deleted category with id:', categoryId);
                        // Implement delete logic here
                        // After deletion logic
                        setLoading(false); // End loading
                    }
                },
                {
                    label: 'No',
                }
            ]
        });
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        onOpen(); // Open modal for editing
    };

    const renderCell = (category: Category, columnKey: React.Key) => {
        const cellValue = category[columnKey as keyof Category]; // Ensure this line has the correct type

        switch (columnKey) {
            case "name":
                return (
                    <div className="flex items-center">
                        {category.image && (
                            <img
                                src={category.image}
                                alt={category.name}
                                className="w-8 h-8 rounded-full mr-2" // Adjust size and margin as needed
                            />
                        )}
                        <span>{cellValue}</span>
                    </div>
                );
            case "tag":
                return <span>{cellValue}</span>;
            case "actions":
                return (
                    <div className="relative flex items-center gap-2 justify-center">
                        <Tooltip content="Edit category">
                            <span
                                className="text-lg text-default-400 cursor-pointer active:opacity-50"
                                onClick={() => handleEdit(category)} // Pass the category for editing
                            >
                                <EditIcon />
                            </span>
                        </Tooltip>
                        <Tooltip color="danger" content="Delete category">
                            <span
                                className="text-lg text-danger cursor-pointer active:opacity-50"
                                onClick={() => handleDelete(category.id)} // Ensure category.id matches your type
                            >
                                <DeleteIcon />
                            </span>
                        </Tooltip>
                    </div>
                );
            default:
                return cellValue;
        }
    };

    return (
        <>
            {loading && <Spinner size="lg" />} {/* Loading indicator for delete/edit operations */}
            <Table aria-label="Category table">
                <TableHeader columns={[
                    { uid: 'name', name: 'Tên phân loại' },
                    { uid: 'tag', name: 'Tag phân loại' },
                    { uid: 'actions', name: 'Hành động' }
                ]}>
                    {(column) => (
                        <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody items={categories || []}>
                    {(item) => (
                        <TableRow key={item.id}>
                            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <Modal size="5xl" scrollBehavior="inside" isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Sửa phân loại</ModalHeader>
                            <ModalBody>
                                <div className="flex gap-5 lg:flex-row flex-col mb-5">
                                    <div className="lg:w-1/2 w-full">
                                        <label htmlFor="">Tên phân loại</label>
                                        <Input type="text" placeholder="Tên phân loại" defaultValue={editingCategory?.name} />
                                    </div>
                                    <div className="flex-1">
                                        <label htmlFor="">Tag phân loại</label>
                                        <Input type="text" placeholder="Tag phân loại" defaultValue={editingCategory?.tag} />
                                    </div>
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
                                <Button color="primary" onPress={onClose} disabled={loading}>
                                    {loading ? 'Processing...' : 'Sửa'}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};

export default TableCategory;
