'use client';
import { useEffect, useRef, useState } from "react";
import BreadcrumbNav from "../Breadcrumb/Breadcrumb";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input, Tooltip, Spinner } from "@nextui-org/react";
import { EditIcon } from "./EditIcon";
import { DeleteIcon } from "./DeleteIcon";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import axios from "axios";
import apiConfig from "@/configs/api";
import { Category } from "@/interface";
import { Pagination } from "@nextui-org/react";
import { ToastContainer, toast } from 'react-toastify';
import Image from "next/image";
import CategoryTable from "./CategoryTable";
import SearchIcon from '@mui/icons-material/Search';
import useDebounce from "@/un/useDebounce";
import CloseIcon from '@mui/icons-material/Close';

function BodyCategories() {
    // Các hook quản lý trạng thái của component
    const { isOpen, onOpen, onOpenChange } = useDisclosure(); // Quản lý trạng thái của Modal chỉnh sửa danh mục
    const [categoryName, setCategoryName] = useState(""); // Quản lý tên danh mục
    const [categoryTag, setCategoryTag] = useState(""); // Quản lý tag của danh mục đẫ bỏ
    const [image, setImage] = useState<File | null>(null); // Quản lý hình ảnh của danh mục
    const [loading, setLoading] = useState(false); // Trạng thái loading khi đang gọi API
    const [errorMessage, setErrorMessage] = useState(""); // Thông báo lỗi
    const [successMessage, setSuccessMessage] = useState(""); // Thông báo thành công
    const [categories, setCategories] = useState<Category[]>([]); // Danh sách các danh mục
    const [editingCategory, setEditingCategory] = useState<Category | null>(null); // Lưu thông tin của danh mục đang chỉnh sửa
    const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false); // Trạng thái Modal thêm mới danh mục
    const [filteredCategories, setFilteredCategories] = useState<Category[]>([]); // Danh sách danh mục sau khi lọc
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null); // URL hiển thị preview hình ảnh

    const [search, setSearch] = useState(""); // Quản lý trạng thái tìm kiếm
    const debouncedSearch = useDebounce(search, 300); // Giảm thiểu số lần thực hiện tìm kiếm (debounce)
    const fileInputRef = useRef<HTMLInputElement>(null); // Tham chiếu đến input file để reset sau khi tải hình

    const baseUrl = process.env.NEXT_PUBLIC_API_URL; //URL API

    // Hàm lấy danh sách các danh mục từ API
    const fetchCategories = async (searchTerm = "") => {
        console.log("Searching for:", searchTerm); // Kiểm tra giá trị tìm kiếm
        try {
            const response = await axios.get(apiConfig.categories.getAll, {
                params: { name: searchTerm }, // Tìm kiếm danh mục theo tên
                withCredentials: true,
            });
            console.log("API Response:", response.data); // Kiểm tra phản hồi từ API
            setCategories(response.data.categories);// Lưu danh sách danh mục vào state
        } catch (error) {
            console.error('Error fetching categories:', error);
            setErrorMessage('Failed to fetch categories. Please try again.');
        }
    };

    // Cập nhật URL preview khi người dùng chọn một hình ảnh mới
    useEffect(() => {
        if (image) {
           
            setImagePreviewUrl(URL.createObjectURL(image));// Tạo URL preview cho ảnh
        } else {
            setImagePreviewUrl(null); // Xóa preview nếu không có ảnh
        }
    }, [image]);
    // Lấy danh sách danh mục ngay khi component được mount
    useEffect(() => {
        fetchCategories();
    }, []);
    // xử lý thêm hoặc chỉnh sửa danh mục
    const handleSubmit = async (onClose: () => void) => {
        if (!categoryName || !categoryTag) {
            alert('Please fill in all fields.');
            return;
        }
        // kiểm định dạng file hình ảnh
        if (image && !['image/jpeg', 'image/png', 'image/gif'].includes(image.type)) {
            setErrorMessage('Please upload a valid image (jpeg, png, or gif).');
            return;
        }
        setLoading(true); // bật trạng thái loading
        setErrorMessage("");
        setSuccessMessage("");

        // tải form data để gửi lên api 
        const formData = new FormData();
        formData.append('name', categoryName);
        formData.append('tag', categoryTag);
        if (image) {
            formData.append('image', image);
        }

        try {
            onClose(); //đóng modal khi hoàn tất

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

            // Reset các trường dữ liệu và tải lại danh mục
        } catch (error) {
            toast.error('Thêm phân loại thất bại');
            console.error('Error adding category:', error);
            setErrorMessage('Failed to add category. Please try again.');
        } finally {
            setLoading(false); //tắt trạng thái loading
        }
    };

    // xử lý xóa một danh mục
    const handleDelete = (categoryId: string) => {
        // Find the specific category to delete by its ID
        const categoryToDelete = categories.find(category => category.id === categoryId);

        if (!categoryToDelete) {
            setErrorMessage("Category not found.");
            return;
        }
        // hiện thị modal xác nhận xóa
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
                            fetchCategories(); // tải lại ảnh sau khi xóa
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
    // Xử lý khi người dùng nhấn vào chỉnh sửa
    const handleEdit = (category: Category) => {
        setEditingCategory(category); //đặt danh mục đang chỉnh sửa
        onOpen();// mở model chỉnh sửa
        fetchCategories();//cập nhật danh sách  
    };
    //mở model thêm mới
    const handleOpenAddCategoryModal = () => {
        setIsAddCategoryModalOpen(true);
    };
    //dóng model thêm mới 
    const handleCloseAddCategoryModal = () => {
        setIsAddCategoryModalOpen(false);
    };

    // xử lí khi chọn ảnh
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setImage(event.target.files[0]);
        }
    };
    
    // xóa ảnh đã chọn
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
    //Lọc danh sach theo từ khóa tìm kiếm 
    useEffect(() => {
        const filtered = categories.filter(c => c.name.toLowerCase().includes(debouncedSearch.toLowerCase()));
        setFilteredCategories(filtered);
    }, [debouncedSearch, categories]);

    return (
        
        <div>
            {/* hiện thị trạng thái loading */}
            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <Spinner />
                </div>
            )}
            {/* hiện thị modal và bảng dữ liệu */}
            <div className="flex justify-between items-center">
                <div className="py-5 h-[62px]">
                    <BreadcrumbNav
                        items={[
                            { name: 'Home', link: '/' },
                            { name: 'Categories', link: '#' },
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
                <div className="text-xl font-bold">Category Table</div>
                <div>
                    <div className="flex gap-2">
                        <Input
                            type="text"
                            placeholder="Tìm kiếm sản phẩm"
                            labelPlacement="outside"
                            size="lg"
                            endContent={<SearchIcon />}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Button onPress={handleOpenAddCategoryModal} size="lg" className="font-semibold" color="primary">Thêm phân loại</Button>
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
