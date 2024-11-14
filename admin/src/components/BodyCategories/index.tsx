'use client';
import { useEffect, useRef, useState } from "react";
import BreadcrumbNav from "../Breadcrumb/Breadcrumb";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Tooltip, Spinner } from "@nextui-org/react";
import { EditIcon } from "./EditIcon";
import { DeleteIcon } from "./DeleteIcon";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import axios from "axios";
import apiConfig from "@/configs/api";
import { Category } from "@/interface";
import { Pagination } from "@nextui-org/react";
import useCsrfToken from "@/configs/csrfToken";
import { ToastContainer, toast } from 'react-toastify';
import Image from "next/image";
import CategoryTable from "./CategoryTable";
import SearchIcon from '@mui/icons-material/Search';
import useDebounce from "@/un/useDebounce";
import CloseIcon from '@mui/icons-material/Close';

function BodyCategories() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [categoryName, setCategoryName] = useState("");
    const [categoryTag, setCategoryTag] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [categories, setCategories] = useState<Category[]>([]);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
    const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 300);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    const fetchCategories = async (searchTerm = "") => {
        console.log("Searching for:", searchTerm); // Kiểm tra giá trị tìm kiếm
        try {
            const response = await axios.get(apiConfig.categories.getAll, {
                params: { name: searchTerm }, // Chỉ tìm kiếm theo tên của danh mục
                withCredentials: true,
            });
            console.log("API Response:", response.data.categories.data); // Kiểm tra phản hồi từ API
            setCategories(response.data.categories.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setErrorMessage('Failed to fetch categories. Please try again.');
        }
    };

    useEffect(() => {
        if (image) {
            // Create a preview URL for the selected image
            setImagePreviewUrl(URL.createObjectURL(image));
        } else {
            setImagePreviewUrl(null); // Clear preview if no image
        }
    }, [image]);

    useEffect(() => {
        fetchCategories();
    }, []);

    

    const handleSubmit = async (onClose: () => void) => {
        if (!categoryName || !categoryTag) {
            alert('Please fill in all fields.');
            return;
        }

        if (image && !['image/jpeg', 'image/png', 'image/gif'].includes(image.type)) {
            setErrorMessage('Please upload a valid image (jpeg, png, or gif).');
            return;
        }
        setLoading(true);
        setErrorMessage("");
        setSuccessMessage("");

        const formData = new FormData();
        formData.append('name', categoryName);
        formData.append('tag', categoryTag);
        if (image) {
            formData.append('image', image);
        }

        try {
            onClose();

            const response = await axios.post(apiConfig.categories.createCt, formData, {
                headers: {
                    accept: 'application/json',
                },
            });
            setCategoryName('');
            setCategoryTag('');
            setImage(null);
            fetchCategories();
            toast.success('Thêm phân loại thành công');
console.log(formData);

            // Close the modal after successfully adding the category
        } catch (error) {
            toast.error('Thêm phân loại thất bại');
            console.error('Error adding category:', error);
            setErrorMessage('Failed to add category. Please try again.');
        } finally {
            setLoading(false);
        }
    };


// ... existing code ...
// ... existing code ...
const handleDelete = async (categoryId: string) => {
    const categoryToDelete = categories.find(category => category.id === categoryId);

    if (!categoryToDelete) {
        setErrorMessage("Category not found.");
        return;
    }

    // Check if the category has products
    try {
        const response = await axios.get(`http://127.0.0.1:8000/api/category/getproducts/${categoryId}`);
        if (response.data.products.total > 0) {
        toast.error('Thương hiệu đang có sản phẩm, không thể xóa !!!');
            setErrorMessage("Cannot delete category with existing products.");
            return; // Prevent deletion if products exist
        }
    } catch (error) {
        toast.error('Thương hiệu đang có sản phẩm, không thể xóa !!!');
        console.error('Error fetching products:', error);
        setErrorMessage('Failed to check products. Please try again.');
        return; // Prevent deletion if there's an error
    }

    confirmAlert({
        title: 'Xóa phân loại',
        message: `Bạn có muốn xóa phân loại ${categoryToDelete.name}?`,
        buttons: [
            {
                label: 'Yes',
                onClick: async () => {
                    setLoading(true);
                    try {
                        await axios.delete(`${apiConfig.categories.deleteCt}${categoryId}`);
                        fetchCategories(); // Refresh categories after deletion
                        toast.success('Xóa phân loại thành công');
                    } catch (error) {
                        console.error('Error deleting category:', error);
                        setErrorMessage('Failed to delete category. Please try again.');
                    } finally {
                        setLoading(false);
                    }
                }
            },
            {
                label: 'No',
            }
        ]
    });
};
// ... existing code ...
// ... existing code ...

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        onOpen();
        fetchCategories();
    };

    const handleOpenAddCategoryModal = () => {
        setIsAddCategoryModalOpen(true);
    };

    const handleCloseAddCategoryModal = () => {
        setIsAddCategoryModalOpen(false);
    };


    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setImage(event.target.files[0]);
        }
    };
    
    const handleImageClear = () => {
        setImage(null);
        setImagePreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = ""; // Clear the file input field
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
                                onClick={() => handleEdit(category)}
                            >
                                <EditIcon />
                            </span>
                        </Tooltip>
                        <Modal size="5xl" scrollBehavior="inside" isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false}>
                            <ModalContent>
                                {(onClose) => (
                                    <>
                                        <ModalHeader>Sửa phân loại</ModalHeader>
                                        <ModalBody>
                                            <div className="flex gap-5 lg:flex-row flex-col mb-5">
                                                <div className="lg:w-1/2 w-full">
                                                    <label>Category Name</label>
                                                    <Input
                                                        placeholder="Category Name"
                                                        value={categoryName}
                                                        onChange={(e) => setCategoryName(e.target.value)}
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <label>Category Tag</label>
                                                    <Input
                                                        placeholder="Category Tag"
                                                        value={categoryTag}
                                                        onChange={(e) => setCategoryTag(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label>Image</label>
                                                <Input
                                                    type="file"
                                                    onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
                                                />
                                            </div>
                                            {errorMessage && <div className="text-red-600">{errorMessage}</div>}
                                            {successMessage && <div className="text-green-600">{successMessage}</div>}
                                        </ModalBody>
                                        <ModalFooter>
                                            <Button color="danger" onPress={onClose}>
                                                Close
                                            </Button>
                                            <Button color="primary" onPress={() => handleSubmit(onClose)} disabled={loading}>
                                                {loading ? 'Processing...' : 'Thêm'}
                                            </Button>

                                        </ModalFooter>
                                    </>
                                )}
                            </ModalContent>
                        </Modal>
                        <Tooltip color="danger" content="Delete category">
                            <span
                                className="text-lg text-danger cursor-pointer active:opacity-50"
                                onClick={() => handleDelete(category.id)}
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

    useEffect(() => {
        const filtered = categories.filter(c => c.name.toLowerCase().includes(debouncedSearch.toLowerCase()));
        setFilteredCategories(filtered);
    }, [debouncedSearch, categories]);

    return (
        <div>
            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <Spinner />
                </div>
            )}
            <div className="flex justify-between items-center">
                <div className="pb-5 h-[62px]">
                    <BreadcrumbNav
                        items={[
                            { name: 'Trang chủ', link: '/' },
                            { name: 'Phân loại', link: '#' },
                        ]}
                    />
                </div>
                <div>

                    <Modal
                        size="5xl"
                        scrollBehavior="inside"
                        isOpen={isAddCategoryModalOpen}
                        onOpenChange={handleCloseAddCategoryModal}
                        isDismissable={false}
                    >
                        <ModalContent>
                            {(onClose) => (
                                <>
                                    <ModalHeader>Thêm mới phân loại</ModalHeader>
                                    <ModalBody>
                                        <div className="flex gap-5 lg:flex-row flex-col mb-5">
                                            <div className="lg:w-1/2 w-full">
                                                <label>Tên phân loại</label>
                                                <Input
                                                    placeholder="Category Name"
                                                    value={categoryName}
                                                    onChange={(e) => setCategoryName(e.target.value)}
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <label>Tag phân loại</label>
                                                <Input
                                                    placeholder="Category Tag"
                                                    value={categoryTag}
                                                    onChange={(e) => setCategoryTag(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div>
    <label>Image</label>
    <Input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        ref={fileInputRef} // Add ref here
    />
    {imagePreviewUrl && (
        <div className="flex items-center mt-2">
             <div className="w-[200px] h-[200px]">
            <Image
                src={imagePreviewUrl}
                alt="Selected image preview"
                width={200}
                height={200}
                className="rounded-lg object-cover mb-2 w-full h-full"
            />
             </div>
            <Button
                color="danger"
                onClick={handleImageClear}
                className="ml-2" // Optional for spacing
            >
                <CloseIcon /> {/* Use a close icon */}
            </Button>
        </div>
    )}
    {errorMessage && <div className="text-red-600">{errorMessage}</div>}
    {successMessage && <div className="text-green-600">{successMessage}</div>}
</div>
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="danger" onPress={onClose}>
                                            Đóng
                                        </Button>
                                        <Button color="primary" onPress={() => handleSubmit(onClose)} disabled={loading}>
                                            {loading ? 'Processing...' : 'Thêm'}
                                        </Button>

                                    </ModalFooter>
                                </>
                            )}
                        </ModalContent>
                    </Modal>
                </div>
            </div>

            <div className="flex items-center justify-between mb-4">
                <div className="text-xl font-bold">Bảng phân loại</div>
                <div>
                    <div className="flex gap-2">
                        <Input
                        className="bg-white"
                         isClearable
                            type="text"
                            placeholder="Tìm kiếm phân loại"
                            labelPlacement="outside"
                            size="md"
                            endContent={<SearchIcon />}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Button onPress={handleOpenAddCategoryModal} size="md" className="font-medium !px-6" color="primary">Thêm phân loại</Button>
                    </div>
                </div>
            </div>


            <div>
                {/* Hiển thị nếu không có sản phẩm */}
                {filteredCategories.length === 0 ? (
                    <div className="text-center text-lg font-semibold mt-4">
                        Không có phân loại nào được tìm thấy
                    </div>
                ) : (
                    <CategoryTable
                        categories={filteredCategories}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                )}
            </div>
        </div>
    );
}

export default BodyCategories;
