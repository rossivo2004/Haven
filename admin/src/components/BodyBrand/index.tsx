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
import { Brand } from "@/interface";
import { Pagination } from "@nextui-org/react";
import useCsrfToken from "@/configs/csrfToken";
import { ToastContainer, toast } from 'react-toastify';
import Image from "next/image";
import BrandTable from "./tablebrand";
import SearchIcon from '@mui/icons-material/Search';
import useDebounce from "@/un/useDebounce";
import CloseIcon from '@mui/icons-material/Close';

function BodyBrand() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [brandName, setBrandName] = useState("");
    const [brandTag, setBrandTag] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [brands, setBrands] = useState<Brand[]>([]);
    const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
    const [isAddBrandModalOpen, setIsAddBrandModalOpen] = useState(false);
    const [filteredBrands, setFilteredBrands] = useState<Brand[]>([]);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 300);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    const fetchBrands = async (searchTerm = "") => {
        console.log("Searching for:", searchTerm); // Kiểm tra giá trị tìm kiếm
        try {
            const response = await axios.get(apiConfig.brands.getAll, {
                params: { name: searchTerm }, // Chỉ tìm kiếm theo tên của danh mục
                withCredentials: true,
            });
            console.log("API Response:", response.data.brands.data); // Kiểm tra phản hồi từ API
            setBrands(response.data.brands.data);
        } catch (error) {
            console.error('Error fetching brands:', error);
            setErrorMessage('Failed to fetch brands. Please try again.');
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
        fetchBrands();
    }, []);



    const handleSubmit = async (onClose: () => void) => {
        if (!brandName || !brandTag) {
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
        formData.append('name', brandName);
        formData.append('tag', brandTag);
        if (image) {
            formData.append('image', image);
        }

        try {
            onClose();

            const response = await axios.post(apiConfig.brands.createBr, formData, {
                headers: {
                    accept: 'application/json',
                },
            });
            setBrandName('');
            setBrandTag('');
            setImage(null);
            fetchBrands();
            toast.success('Thêm phân loại thành công');

            // Close the modal after successfully adding the Brand
        } catch (error) {
            toast.error('Thêm phân loại thất bại');
            console.error('Error adding Brand:', error);
            setErrorMessage('Failed to add Brand. Please try again.');
        } finally {
            setLoading(false);
        }
    };


    const handleDelete = (brandId: string) => {
        // Find the specific category to delete by its ID
        const brandToDelete = brands.find(brand => brand.id === brandId);

        if (!brandToDelete) {
            setErrorMessage("brand not found.");
            return;
        }

        confirmAlert({
            title: 'Xóa thương hiệu',
            message: `Bạn có muốn xóa thương hiệu ${brandToDelete.name}?`,
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        setLoading(true);
                        try {
                            await axios.delete(`${apiConfig.brands.deleteBr}${brandId}`);
                            fetchBrands(); // Refresh categories after deletion
                            toast.success('Xóa thương hiệu thành công');


                        } catch (error) {
                            console.error('Error deleting brands:', error);
                            setErrorMessage('Failed to delete brands. Please try again.');
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

    const handleEdit = (brand: Brand) => {
        setEditingBrand(brand);
        onOpen();
        fetchBrands();
    };

    const handleOpenAddBrandModal = () => {
        setIsAddBrandModalOpen(true);
    };

    const handleCloseAddBrandModal = () => {
        setIsAddBrandModalOpen(false);
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
                                onClick={() => handleEdit(brand)}
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
                                                    <label>Brand Name</label>
                                                    <Input
                                                        placeholder="Brand Name"
                                                        value={brandName}
                                                        onChange={(e) => setBrandName(e.target.value)}
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <label>Brand Tag</label>
                                                    <Input
                                                        placeholder="Brand Tag"
                                                        value={brandTag}
                                                        onChange={(e) => setBrandTag(e.target.value)}
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
                        <Tooltip color="danger" content="Delete brand">
                            <span
                                className="text-lg text-danger cursor-pointer active:opacity-50"
                                onClick={() => handleDelete(brand.id)}
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
        const filtered = brands.filter(c => c.name.toLowerCase().includes(debouncedSearch.toLowerCase()));
        setFilteredBrands(filtered);
    }, [debouncedSearch, brands]);

    return (
        <div>
            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <Spinner />
                </div>
            )}
            <div className="flex justify-between items-center">
                <div className="py-5 h-[62px]">
                    <BreadcrumbNav
                        items={[
                            { name: 'Home', link: '/' },
                            { name: 'Brands', link: '#' },
                        ]}
                    />
                </div>
                <div>

                    <Modal
                        size="5xl"
                        scrollBehavior="inside"
                        isOpen={isAddBrandModalOpen}
                        onOpenChange={handleCloseAddBrandModal}
                        isDismissable={false}
                    >
                        <ModalContent>
                            {(onClose) => (
                                <>
                                    <ModalHeader>Thêm mới brand</ModalHeader>
                                    <ModalBody>
                                        <div className="flex gap-5 lg:flex-row flex-col mb-5">
                                            <div className="lg:w-1/2 w-full">
                                                <label>Tên thương hiệu</label>
                                                <Input
                                                    placeholder="Brand Name"
                                                    value={brandName}
                                                    onChange={(e) => setBrandName(e.target.value)}
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <label>Tag thương hiệu</label>
                                                <Input
                                                    placeholder="Brand Tag"
                                                    value={brandTag}
                                                    onChange={(e) => setBrandTag(e.target.value)}
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
                <div className="text-xl font-bold">Brand Table</div>
                <div>
                    <div className="flex gap-2">
                        <Input
                            isClearable
                            type="text"
                            placeholder="Tìm kiếm sản phẩm"
                            labelPlacement="outside"
                            size="md"
                            endContent={<SearchIcon />}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Button onPress={handleOpenAddBrandModal} size="md" className="font-medium !px-6" color="primary">Thêm phân loại</Button>
                    </div>
                </div>
            </div>


            <div>
                {/* Hiển thị nếu không có sản phẩm */}
                {filteredBrands.length === 0 ? (
                    <div className="text-center text-lg font-semibold mt-4">
                        Không có phân loại nào được tìm thấy
                    </div>
                ) : (
                    <BrandTable
                        brands={filteredBrands}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                )}
            </div>
        </div>
    );
}

export default BodyBrand;