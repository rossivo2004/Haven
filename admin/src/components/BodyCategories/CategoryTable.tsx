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
} from "@nextui-org/react"; // Import các thành phần giao diện từ thư viện NextUI
import Image from "next/image";
import { EditIcon } from "./EditIcon"; // biểu tượng chỉnh sửa
import { DeleteIcon } from "./DeleteIcon"; // biểu tượng xóa
import { Category } from "@/interface"; // Interface của danh mục (Category)
import apiConfig from "@/configs/api"; // configs api
import axios from "axios"; //thư viện axios để gọi api
import CloseIcon from '@mui/icons-material/Close'; 
import { toast } from "react-toastify"; // thư viên để hiện thị thông báo

// Khai báo kiểu dữ liệu cho các prop mà component nhận
interface CategoryTableProps {
    categories: Category[]; // Danh sách các danh mục
    onEdit: (category: Category) => void; // Hàm xử lý khi chỉnh sửa danh mục   
    onDelete: (categoryId: string) => void;// Hàm xử lý khi xóa danh mục
}

const CategoryTable = ({ categories, onEdit, onDelete }: CategoryTableProps) => {
    // State lưu trữ danh mục đang chỉnh sửa và thông tin của danh mục đó
    const [editingCategory, setEditingCategory] = useState<Category | null>(null); // Danh mục đang được chỉnh sửa
    const [categoryName, setCategoryName] = useState<string>(""); // Tên danh mục
    const [categoryTag, setCategoryTag] = useState<string>(""); // Tag của danh mục
    const [categoryImage, setCategoryImage] = useState<File | null>(null); // Hình ảnh của danh mục
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false); // Trạng thái mở/đóng Modal chỉnh sửa
    const [isLoading, setIsLoading] = useState<boolean>(false); // Trạng thái loading khi thực hiện thao tác
    const fileInputRef = useRef<HTMLInputElement>(null); // Tham chiếu đến input file để dễ dàng reset

    // Cập nhật giá trị categoryName và categoryTag khi editingCategory thay đổi
    useEffect(() => {
        if (editingCategory) {
            setCategoryName(editingCategory.name); // Đổ dữ liệu tên của danh mục vào input
            setCategoryTag(editingCategory.tag); // Đổ dữ liệu tag của danh mục vào input
            setCategoryImage(null); // Reset hình ảnh khi chỉnh sửa một danh mục khác
        }
    }, [editingCategory]);

    // Mở modal chỉnh sửa khi người dùng nhấn vào biểu tượng chỉnh sửa
    const openEditModal = (category: Category) => {
        setEditingCategory(category); // Lưu danh mục đang được chỉnh sửa vào state
        setIsEditModalOpen(true); // Mở Modal
    };
    // Đóng Modal chỉnh sửa và reset các giá trị trong form
    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setEditingCategory(null);
        setCategoryName("");
        setCategoryTag("");
        setCategoryImage(null);
    };
     // Xử lý khi người dùng chọn ảnh mới
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setCategoryImage(event.target.files[0]);// Lưu ảnh đã chọn vào state
        }
    };
    // Xóa hình ảnh hiện tại khỏi state
    const handleRemoveImage = () => {
        setCategoryImage(null); // Xóa ảnh khỏi state
        if (fileInputRef.current) {
            fileInputRef.current.value = ""; // Xóa ảnh đã chọn khỏi input file
        }
    };

     // Xử lý khi người dùng nhấn nút `Save` trong Modal chỉnh sửa
    const handleSubmitEdit = async () => {
        if (editingCategory) {
            setIsLoading(true); // Set loading state

            const formData = new FormData();
            formData.append("name", categoryName.trim() !== "" ? categoryName : editingCategory.name);
            formData.append("tag", categoryTag.trim() !== "" ? categoryTag : editingCategory.tag);

            // Nếu có hình ảnh mới, thêm vào formData
            if (categoryImage) {
                formData.append("image", categoryImage);
            }

            // Thêm `_method` để giả lập PUT request thông qua POST
            formData.append("_method", "PUT");

            try {
                const response = await axios.post(`${apiConfig.categories.updateCt}${editingCategory.id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                if (response.status === 200) {
                    // Call the onEdit handler to update the parent state
                    onEdit(response.data); // Cập nhật danh mục sau khi chỉnh sửa thành công
                    closeEditModal(); // Dóng modal
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


    // Hàm render từng ô của bảng dựa vào dữ liệu danh mục và cột hiển thị
    const renderCell = (category: Category, columnKey: React.Key) => {
        const cellValue = category[columnKey as keyof Category]; // Lấy giá trị của ô theo cột

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