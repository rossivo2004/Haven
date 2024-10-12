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
import { Brand } from "@/interface"; // Interface cho Brand
import apiConfig from "@/configs/api";
import axios from "axios";
import CloseIcon from '@mui/icons-material/Close';
import { toast } from "react-toastify";

interface BrandTableProps {
    brands: Brand[]; // Danh sách các thương hiệu
    onEdit: (brand: Brand) => void; // Hàm xử lý khi chỉnh sửa
    onDelete: (brandId: string) => void; // Hàm xử lý khi xóa
}

const BrandTable = ({ brands, onEdit, onDelete }: BrandTableProps) => {
    const [editingBrand, setEditingBrand] = useState<Brand | null>(null); // Quản lý trạng thái thương hiệu đang chỉnh sửa
    const [brandName, setBrandName] = useState<string>(""); // Tên thương hiệu
    const [brandTag, setBrandTag] = useState<string>(""); // Tag của thương hiệu
    const [brandImage, setBrandImage] = useState<File | null>(null); // Hình ảnh của thương hiệu
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false); // Trạng thái mở/đóng Modal chỉnh sửa
    const [isLoading, setIsLoading] = useState<boolean>(false); // Trạng thái loading khi xử lý

    const fileInputRef = useRef<HTMLInputElement>(null); // Tham chiếu đến input file để reset sau khi tải hình

    useEffect(() => {
        if (editingBrand) {
            setBrandName(editingBrand.name); // Đổ dữ liệu tên của thương hiệu vào input
            setBrandTag(editingBrand.tag); // Đổ dữ liệu tag của thương hiệu vào input
            setBrandImage(null); // Reset hình ảnh khi chỉnh sửa một thương hiệu khác
        }
    }, [editingBrand]);

    const openEditModal = (brand: Brand) => {
        setEditingBrand(brand); // Đặt thương hiệu cần chỉnh sửa
        setIsEditModalOpen(true); // Mở Modal chỉnh sửa
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setEditingBrand(null); // Đặt lại thương hiệu đang chỉnh sửa về null
        setBrandName(""); // Reset tên
        setBrandTag(""); // Reset tag
        setBrandImage(null); // Xóa hình ảnh khỏi state
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setBrandImage(event.target.files[0]); // Lưu ảnh vào state
        }
    };

    const handleRemoveImage = () => {
        setBrandImage(null); // Xóa ảnh khỏi state
        if (fileInputRef.current) {
            fileInputRef.current.value = ""; // Xóa ảnh đã chọn khỏi input file
        }
    };
    // Upload hình ảnh lên server và trả về URL của hình ảnh
    const uploadImage = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.put(apiConfig.categories.updateCt, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data.url; // Trả về URL của hình ảnh
        } catch (error) {
            console.error("Error uploading image:", error);
            return ""; // Trả về chuỗi rỗng nếu xảy ra lỗi
        }
    };
    // Hàm xử lý khi người dùng nhấn nút `Save` trong Modal chỉnh sửa
const handleSubmitEdit = async () => {
        if (editingBrand) {
            setIsLoading(true); // Set loading state
            const formData = new FormData();
            formData.append("name", brandName.trim() !== "" ? brandName : editingBrand.name);
            formData.append("tag", brandTag.trim() !== "" ? brandTag : editingBrand.tag);

            if (brandImage) {
                formData.append("image", brandImage); // Đính kèm ảnh nếu có
            }

            // Thêm `_method` để giả lập PUT request thông qua POST
            formData.append("_method", "PUT");

            try {
                const response = await axios.post(`${apiConfig.brands.update}${editingBrand.id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });

                if (response.status === 200) {
                    onEdit(response.data); // Cập nhật lại thương hiệu sau khi chỉnh sửa thành công
                    closeEditModal(); // Đóng modal
                    toast.success('Cập nhật thương hiệu thành công!');
                } else {
                    console.error("Error updating brand:", response);
                }
            } catch (error) {
                console.error("Error updating brand:", error);
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
                        <Tooltip color="danger" content="Delete brand">
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
                <TableBody items={brands}>
                    {(item) => (
                        <TableRow key={item.id}>
                            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* Modal chỉnh sửa thương hiệu */}
            {editingBrand && (
                <Modal isOpen={isEditModalOpen} onClose={closeEditModal}>
                    <ModalContent>
                        <ModalHeader>Sửa thương hiệu</ModalHeader>
                        <ModalBody>
                            <div>
                                <label>
                                    Tên thương hiệu:
                                    <Input
                                        type="text"
                                        value={brandName}
                                        onChange={(e) => setBrandName(e.target.value)}
                                    />
                                </label>
                            </div>
                            <div>
                                <label>
                                    Tag thương hiệu:
                                    <Input
                                        type="text"
                                        value={brandTag}
                                        onChange={(e) => setBrandTag(e.target.value)}
                                    />
                                </label>
                            </div>
                            <div>
                                <label className="mb-2">
                                    Hình ảnh hiện tại:
                                    {editingBrand.image && !brandImage && (
                                        <div className="w-[200px] h-[200px]">
                                            <Image
                                                src={editingBrand.image}
                                                alt={editingBrand.name}
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
                                    ref={fileInputRef}
                                    className="mt-2"
                                />
                                {brandImage && (
                                    <div className="relative w-[200px] h-[200px]">
                                        <div
                                            className="absolute top-0 right-0 p-1 cursor-pointer bg-white rounded-full shadow-lg"
                                            onClick={handleRemoveImage}
                                        >
                                            <CloseIcon />
                                        </div>
                                        <Image
                                            src={URL.createObjectURL(brandImage)}
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

export default BrandTable;