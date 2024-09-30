'use client';
import { useEffect, useState } from "react";
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

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    const fetchCategories = async () => {
        try {
            const response = await axios.get(apiConfig.categories.getAll, { withCredentials: true });
            setCategories(response.data.categories);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setErrorMessage('Failed to fetch categories. Please try again.');
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSubmit = async () => {
        if (!categoryName || !categoryTag) {
            alert('Please fill in all fields.');
            return;
        }

        if (image && !['image/jpeg', 'image/png', 'image/gif'].includes(image.type)) {
            setErrorMessage('Please upload a valid image (jpeg, png, or gif).');
            return;
        }
        onOpenChange();
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
        } catch (error) {
            toast.error('Thêm phân loại thất bại');
            console.error('Error adding category:', error);
            setErrorMessage('Failed to add category. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (categoryId: string) => {
        // Find the specific category to delete by its ID
        const categoryToDelete = categories.find(category => category.id === categoryId);

        if (!categoryToDelete) {
            setErrorMessage("Category not found.");
            return;
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
                                            <Button color="primary" onPress={handleSubmit} disabled={loading}>
                                                {loading ? 'Processing...' : 'Add'}
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

    return (
        <div>
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
                    <Button onPress={handleOpenAddCategoryModal}>Thêm phân loại</Button>
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
                                    <ModalHeader>Thê mới phân loại</ModalHeader>
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
                                            <label>Hình ảnh phân loại</label>
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
                                            Đóng
                                        </Button>
                                        <Button color="primary" onPress={handleSubmit} disabled={loading}>
                                            {loading ? 'Processing...' : 'Thêm'}
                                        </Button>
                                    </ModalFooter>
                                </>
                            )}
                        </ModalContent>
                    </Modal>
                </div>
            </div>

            <div className="mb-4 text-xl font-bold">Category Table</div>

            <div>
                {loading && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <Spinner size="lg" />
                    </div>
                )}

                <CategoryTable
                    categories={categories}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />

                {/* <div className="flex justify-end w-full mt-2">
                    <Pagination showControls total={10} initialPage={1} />
                </div> */}
            </div>
        </div>
    );
}

export default BodyCategories;
