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
import { Brand } from "@/interface";
import apiConfig from "@/configs/api";
import axios from "axios";
import CloseIcon from '@mui/icons-material/Close';
import { toast } from "react-toastify";

interface BrandTableProps {
    brands: Brand[];
    onEdit: (brand: Brand) => void;
    onDelete: (brandId: string) => void;
}

const BrandTable = ({ brands, onEdit, onDelete }: BrandTableProps) => {
    const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
    const [brandName, setBrandName] = useState<string>("");
    const [brandTag, setBrandTag] = useState<string>("");
    const [brandImage, setBrandImage] = useState<File | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 10; // Number of items per page

    // Calculate the current items to display based on the current page
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = brands.slice(indexOfFirstItem, indexOfLastItem);

    // Cập nhật giá trị categoryName và categoryTag khi editingCategory thay đổi
    useEffect(() => {
        if (editingBrand) {
            setBrandName(editingBrand.name);
            setBrandTag(editingBrand.tag);
            setBrandImage(null); // reset image if editing a different category
        }
    }, [editingBrand]);

    const openEditModal = (category: Brand) => {
        setEditingBrand(category);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setEditingBrand(null);
        setBrandName("");
        setBrandTag("");
        setBrandImage(null);
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setBrandImage(event.target.files[0]);
        }
    };

    const handleRemoveImage = () => {
        setBrandImage(null); // Remove the selected image from state
        if (fileInputRef.current) {
            fileInputRef.current.value = ""; // Clear the file input
        }
    };



    const uploadImage = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.put(apiConfig.brands.updateBr, formData, {
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
        if (editingBrand) {
            setIsLoading(true); // Set loading state

            const formData = new FormData();
            formData.append("name", brandName.trim() !== "" ? brandName : editingBrand.name);
            formData.append("tag", brandTag.trim() !== "" ? brandTag : editingBrand.tag);

            // Append the image file if a new one is selected
            if (brandImage) {
                formData.append("image", brandImage);
            }

            // Add the `_method` field to simulate a PUT request using POST
            formData.append("_method", "PUT");

            try {
                const response = await axios.post(`${apiConfig.brands.updateBr}${editingBrand.id}`, formData, {
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


    const renderCell = (brand: Brand, columnKey: React.Key) => {
        const cellValue = brand[columnKey as keyof Brand];

        switch (columnKey) {
            case "name":
                return (
                    <div className="flex items-center">
                        {brand.image && (
                            <Image
                                loading="lazy"
                                src={brand.image}
                                alt={brand.name}
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
                        <Tooltip content="Edit brand">
                            <span
                                className="text-lg text-default-400 cursor-pointer active:opacity-50"
                                onClick={() => openEditModal(brand)}
                            >
                                <EditIcon />
                            </span>
                        </Tooltip>
                        <Tooltip color="danger" content="Delete category">
                            <span
                                className="text-lg text-danger cursor-pointer active:opacity-50"
                                onClick={() => onDelete(brand.id)}
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

    const totalPages = Math.ceil(brands.length / itemsPerPage); // Calculate total pages

    // Add this line to calculate the current range of items being displayed
    const indexOfFirstProduct = indexOfFirstItem + 1; // Adjust for 1-based index
    const indexOfLastProduct = Math.min(indexOfLastItem, brands.length); // Adjust for total items

    return (
        <>
            <Table aria-label="Brand table">
                <TableHeader columns={[{ uid: 'name', name: 'Brand Name' }, { uid: 'tag', name: 'Brand Tag' }, { uid: 'actions', name: 'Actions' }]}>
                    {(column) => (
                        <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody items={currentItems}>
                    {(item) => (
                        <TableRow key={item.id}>
                            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* Manual Pagination Controls */}
            <div className="flex justify-between items-center mt-4">
                <div className="text-sm">
                    {`${indexOfFirstProduct} - ${indexOfLastProduct} của ${brands.length} thương hiệu`} {/* Updated to show current range */}
                </div>
                <div className="flex gap-2">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <div
                            className={`cursor-pointer w-10 h-10 flex items-center justify-center rounded-md border-2 
                                ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-transparent text-blue-600'}`}
                            key={index + 1}
                            onClick={() => setCurrentPage(index + 1)}
                            style={{ 
                                backgroundColor: currentPage === index + 1 ? '#696bff' : 'transparent', 
                                border: '2px solid #696bff',
                                color: currentPage === index + 1 ? 'white' : '#696bff'
                            }}
                        >
                            {index + 1}
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal for editing category */}
            {editingBrand && (
                <Modal isOpen={isEditModalOpen} onClose={closeEditModal} className="bg-[#FCFCFC]" size="4xl">
                    <ModalContent>
                        <ModalHeader><div className="text-2xl">Sửa thương hiệu</div></ModalHeader>
                        <ModalBody>
                            <div className="flex gap-10">
                                <div className="flex flex-col items-center gap-4">
                                    <label className="block text-lg font-medium mb-2">Hình ảnh</label>

                                    {/* Hiển thị ảnh hiện tại hoặc ảnh mới đã chọn */}
                                    <div className="relative w-[200px] h-[200px]">
                                        {/* Nếu có ảnh mới, hiển thị ảnh mới */}
                                        {brandImage ? (
                                            <Image
                                                src={URL.createObjectURL(brandImage)} // Preview ảnh mới
                                                alt="Selected image preview"
                                                width={200}
                                                height={200}
                                                className="rounded-lg object-cover w-full h-full"
                                            />
                                        ) : (
                                            // Nếu chưa có ảnh mới, hiển thị ảnh hiện tại
                                            editingBrand?.image && (
                                                <Image
                                                    src={editingBrand.image} // Ảnh hiện tại
                                                    alt={editingBrand.name}
                                                    width={200}
                                                    height={200}
                                                    className="rounded-lg object-cover w-full h-full"
                                                />
                                            )
                                        )}

                                        {/* Nút "X" để xóa ảnh mới được chọn */}
                                        {brandImage && (
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
                                    {brandImage && (
                                        <div className="mt-2 text-sm text-gray-600 hidden">
                                            {brandImage.name} {/* Chỉ tên ảnh, không link */}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="mb-4">
                                        <label>
                                            <div className="text-lg font-medium">Tên phân loại:</div>
                                            <Input
                                                type="text"
                                                value={brandName}
                                                onChange={(e) => setBrandName(e.target.value)}
                                            />
                                        </label>
                                    </div>
                                    <div>
                                        <label>
                                            <div className="text-lg font-medium"> Tag phân lọai:</div>
                                            <Input
                                                type="text"
                                                value={brandTag}
                                                onChange={(e) => setBrandTag(e.target.value)}
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

export default BrandTable;