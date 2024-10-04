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
                <Modal isOpen={isEditModalOpen} onClose={closeEditModal} className="bg-[#FCFCFC]" size="4xl">
                    <ModalContent>
                        <ModalHeader><div className="text-2xl">Sửa phân loại</div></ModalHeader>
                        <ModalBody>
                            <div className="flex gap-10">
                                <div className="flex flex-col items-center gap-4">
                                    <label className="block text-lg font-medium mb-2">Hình ảnh</label>

                                    {/* Hiển thị ảnh hiện tại hoặc ảnh mới đã chọn */}
                                    <div className="relative w-[200px] h-[200px]">
                                        {/* Nếu có ảnh mới, hiển thị ảnh mới */}
                                        {categoryImage ? (
                                            <Image
                                                src={URL.createObjectURL(categoryImage)} // Preview ảnh mới
                                                alt="Selected image preview"
                                                width={200}
                                                height={200}
                                                className="rounded-lg object-cover w-full h-full"
                                            />
                                        ) : (
                                            // Nếu chưa có ảnh mới, hiển thị ảnh hiện tại
                                            editingCategory?.image && (
                                                <Image
                                                    src={editingCategory.image} // Ảnh hiện tại
                                                    alt={editingCategory.name}
                                                    width={200}
                                                    height={200}
                                                    className="rounded-lg object-cover w-full h-full"
                                                />
                                            )
                                        )}

                                        {/* Nút "X" để xóa ảnh mới được chọn */}
                                        {categoryImage && (
                                            <div
                                                className="absolute top-1 right-1 cursor-pointer bg-white rounded-full shadow-lg flex items-center justify-center hover:text-red-600"
                                                onClick={handleRemoveImage}
                                            >
                                                <CloseIcon className="w-5 h-5"/>
                                            </div>
                                        )}
                                    </div>

                                    {/* Nút chọn file được tùy chỉnh */}
                                    <div className="relative">
                                        <button
                                            type="button"
                                            className="px-4 py-2 bg-blue-500 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            { "Change Image"}
                                        </button>

                                        {/* Input file ẩn hoàn toàn */}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            ref={fileInputRef}
                                            onChange={handleImageChange}
                                            className="hidden" // Hoàn toàn ẩn input file
                                        />
                                    </div>

                                    {/* Chỉ hiển thị tên ảnh đã chọn, không hiển thị link */}
                                    {categoryImage && (
                                        <div className="mt-2 text-sm text-gray-600 hidden">
                                            {categoryImage.name} {/* Chỉ tên ảnh, không link */}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="mb-4">
                                        <label>
                                            <div className="text-lg font-medium">Tên phân loại:</div>
                                            <Input
                                                type="text"
                                                value={categoryName}
                                                onChange={(e) => setCategoryName(e.target.value)}
                                            />
                                        </label>
                                    </div>
                                    <div>
                                        <label>
                                            <div className="text-lg font-medium"> Tag phân lọai:</div>
                                            <Input
                                                type="text"
                                                value={categoryTag}
                                                onChange={(e) => setCategoryTag(e.target.value)}
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>

                        </ModalBody>
                        <ModalFooter>
                            <Button onClick={closeEditModal}>Cancel</Button>
                            <Button onClick={handleSubmitEdit} disabled={isLoading} className="bg-primary-400 text-white font-semibold">
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