import React, { useState, useEffect, useRef } from "react";
import {
    Input,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Tooltip,
} from "@nextui-org/react";
import Image from "next/image";
import { EditIcon } from "./EditIcon";
import { DeleteIcon } from "./DeleteIcon";
import { Category } from "@/interface";
import apiConfig from "@/configs/api";
import axios from "axios";
import CloseIcon from '@mui/icons-material/Close';
import { toast } from "react-toastify";

interface CategoryTableProps {
    categories: Category[];
    onEdit: (category: Category) => void;
    onDelete: (categoryId: string) => void;
}

const CategoryTable = ({ categories, onEdit, onDelete }: CategoryTableProps) => {
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [categoryName, setCategoryName] = useState<string>("");
    const [categoryTag, setCategoryTag] = useState<string>("");
    const [categoryImage, setCategoryImage] = useState<File | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Cập nhật giá trị categoryName và categoryTag khi editingCategory thay đổi
    useEffect(() => {
        if (editingCategory) {
            setCategoryName(editingCategory.name);
            setCategoryTag(editingCategory.tag);
            setCategoryImage(null); // reset image if editing a different category
        }
    }, [editingCategory]);

    const openEditModal = (category: Category) => {
        setEditingCategory(category);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setEditingCategory(null);
        setCategoryName("");
        setCategoryTag("");
        setCategoryImage(null);
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setCategoryImage(event.target.files[0]);
        }
    };

    const handleRemoveImage = () => {
        setCategoryImage(null); // Remove the selected image from state
        if (fileInputRef.current) {
            fileInputRef.current.value = ""; // Clear the file input
        }
    };

    

    const uploadImage = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.put(apiConfig.categories.updateCt, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data.url; // Adjust based on your API response structure
        } catch (error) {
            console.error("Error uploading image:", error);
            return ""; // Handle error gracefully
        }
    };

    const handleSubmitEdit = async () => {
        if (editingCategory) {
            setIsLoading(true); // Set loading state

            const formData = new FormData();
            formData.append("name", categoryName.trim() !== "" ? categoryName : editingCategory.name);
            formData.append("tag", categoryTag.trim() !== "" ? categoryTag : editingCategory.tag);

            // Append the image file if a new one is selected
            if (categoryImage) {
                formData.append("image", categoryImage);
            }

            // Add the `_method` field to simulate a PUT request using POST
            formData.append("_method", "PUT");

            try {
                const response = await axios.post(`${apiConfig.categories.updateCt}${editingCategory.id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                if (response.status === 200) {
                    // Call the onEdit handler to update the parent state
                    onEdit(response.data); // Pass the updated category data
                    closeEditModal();
                    toast.success('Cập nhật thành công')
                } else {
                    console.error("Error updating category:", response);
                }
            } catch (error) {
                console.error("Error updating category:", error);
            } finally {
                setIsLoading(false); // Reset loading state
            }
        }
    };


    const renderCell = (category: Category, columnKey: React.Key) => {
        const cellValue = category[columnKey as keyof Category];

        switch (columnKey) {
            case "name":
                return (
                    <div className="flex items-center">
                        {category.image && (
                            <Image
                                loading="lazy"
                                src={category.image}
                                alt={category.name}
                                className="w-12 h-12 rounded-full mr-2"
                                width={50}
                                height={50}
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
                                onClick={() => openEditModal(category)}
                            >
                                <EditIcon />
                            </span>
                        </Tooltip>
                        <Tooltip color="danger" content="Delete category">
                            <span
                                className="text-lg text-danger cursor-pointer active:opacity-50"
                                onClick={() => onDelete(category.id)}
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
            <Table aria-label="Category table">
                <TableHeader columns={[{ uid: 'name', name: 'Category Name' }, { uid: 'tag', name: 'Category Tag' }, { uid: 'actions', name: 'Actions' }]}>
                    {(column) => (
                        <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody items={categories}>
                    {(item) => (
                        <TableRow key={item.id}>
                            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* Modal for editing category */}
            {editingCategory && (
                <Modal isOpen={isEditModalOpen} onClose={closeEditModal}>
                    <ModalContent>
                        <ModalHeader>Sửa phân loại</ModalHeader>
                        <ModalBody>
                            <div>
                                <label>
                                    Tên phân loại:
                                    <Input
                                        type="text"
                                        value={categoryName}
                                        onChange={(e) => setCategoryName(e.target.value)}
                                    />
                                </label>
                            </div>
                            <div>
                                <label>
                                    Tag phân lọai
                                    <Input
                                        type="text"
                                        value={categoryTag}
                                        onChange={(e) => setCategoryTag(e.target.value)}
                                    />
                                </label>
                            </div>
                            <div>
                                <label className="mb-2">
                                    Hình ảnh hiện tại:
                                    {editingCategory.image && !categoryImage && (
                                        <div className="w-[200px] h-[200px]">
                                            <Image
                                                src={editingCategory.image}
                                                alt={editingCategory.name}
                                                width={200}
                                                height={200}
                                                className="rounded-lg object-cover mb-2 w-full h-full"
                                            />
                                        </div>
                                    )}
                                </label>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    ref={fileInputRef} // Attach the ref to the file input
                                    className="mt-2"
                                />


                                {categoryImage && (
                                    <div className="relative w-[200px] h-[200px]">
                                        <div
                                            className="absolute top-0 right-0 p-1 cursor-pointer bg-white rounded-full shadow-lg"
                                            onClick={handleRemoveImage}
                                        >
                                            <CloseIcon />
                                        </div>
                                        <Image
                                            src={URL.createObjectURL(categoryImage)} // Preview the selected image
                                            alt="Selected image preview"
                                            width={200}
                                            height={200}
                                            className="rounded-lg mt-2 w-full h-full"
                                        />
                                    </div>
                                )}
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button onClick={closeEditModal}>Cancel</Button>
                            <Button onClick={handleSubmitEdit} disabled={isLoading} className="bg-primary-400 font-semibold">
                                {isLoading ? "Saving..." : "Save"}
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            )}

        </>
    );
};

export default CategoryTable;