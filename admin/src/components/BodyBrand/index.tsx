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
import { Brand } from "@/interface";
import { Pagination } from "@nextui-org/react";
import { ToastContainer, toast } from 'react-toastify';
import Image from "next/image";
import BrandTable from "./BrandTable"; // Import component bảng thương hiệu
import SearchIcon from '@mui/icons-material/Search';
import useDebounce from "@/un/useDebounce";
import CloseIcon from '@mui/icons-material/Close';
import TableBrand from "../TableBrand";

function BodyBrand() {
    //các hook quản lý trangj thái của component
    const { isOpen, onOpen, onOpenChange } = useDisclosure(); // Quản lý trạng thái Modal chỉnh sửa thương hiệu
    const [brandName, setBrandName] = useState(""); // quản lý tên thương hiệu
    const [brandTag, setBrandTag] = useState(""); // Tag của thương hiệu bỏ
    const [image, setImage] = useState<File | null>(null); // Hình ảnh của thương hiệu
    const [loading, setLoading] = useState(false); // Trạng thái loading khi thao tác
    const [errorMessage, setErrorMessage] = useState(""); // Thông báo lỗi
    const [successMessage, setSuccessMessage] = useState(""); // Thông báo thành công
    const [brands, setBrands] = useState<Brand[]>([]); // Danh sách thương hiệu
    const [editingBrand, setEditingBrand] = useState<Brand | null>(null); //Lưu thông tin của Thương hiệu đang chỉnh sửa
    const [isAddBrandModalOpen, setIsAddBrandModalOpen] = useState(false); // Trạng thái Modal thêm thương hiệu
    const [filteredBrands, setFilteredBrands] = useState<Brand[]>([]); // Danh sách thương hiệu sau khi lọc
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null); // URL preview hình ảnh

    const [search, setSearch] = useState(""); // Trạng thái tìm kiếm
    const debouncedSearch = useDebounce(search, 300); // Thực hiện tìm kiếm giảm thiểu số lần gọi API
    const fileInputRef = useRef<HTMLInputElement>(null); // Tham chiếu đến input file

    // Hàm lấy danh sách thương hiệu từ API
    const fetchBrands = async (searchTerm = "") => {
        try {
            const response = await axios.get(apiConfig.brands.getAll, {
                params: { name: searchTerm },
                withCredentials: true,
            });
            console.log("API Response:", response.data); // Kiểm tra phản hồi từ API
            setBrands(response.data.brands);
        } catch (error) {
            console.error('Error fetching brands:', error);
            setErrorMessage('Failed to fetch brands. Please try again.');
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
        fetchBrands();
    }, []);
    // xử lý thêm hoặc chỉnh sửa danh mục
    const handleSubmit = async (onClose: () => void) => {
        if (!brandName || !brandTag) {
            alert('Please fill in all fields.');
            return;
        }
        // kiểm định dạng file hình ảnh
        if (image && !['image/jpeg', 'image/png', 'image/gif'].includes(image.type)) {
            setErrorMessage('Please upload a valid image (jpeg, png, or gif).');
            return;
        }
        setLoading(true); //bật trạng thái loading
        setErrorMessage("");
        setSuccessMessage("");

        //Tải form data để gửi lên api
        const formData = new FormData();
        formData.append('name', brandName);
        formData.append('tag', brandTag);
        if (image) {
            formData.append('image', image);
        }

        try {
            onClose();//đóng modal khi hoàn tất

            const response = await axios.post(apiConfig.brands.create, formData, {
                headers: { accept: 'application/json' },
            });
            setBrandName('');
            setBrandTag('');
            setImage(null);
            fetchBrands();
            toast.success('Thêm thương hiệu thành công');
            
            //reset lại các trường dữ liêu và tải lai brand
        } catch (error) {
            toast.error('Thêm thương hiệu thất bại');
            console.error('Error adding category:', error);
            setErrorMessage('Failed to add brand. Please try again.');
        } finally {
            setLoading(false); //tắt trạng thái loading
        }
    };

    //Xử lý xóa một brand
    const handleDelete = (brandId: string) => {
        const brandToDelete = brands.find(brand => brand.id === brandId);

        if (!brandToDelete) {
            setErrorMessage("Brand not found.");
            return;
        }
        //Hiện thị modal xác nhận xóa
        confirmAlert({
            title: 'Xóa thương hiệu',
            message: `Bạn có muốn xóa thương hiệu ${brandToDelete.name}?`,
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        setLoading(true);
                        try {
                            await axios.delete(`${apiConfig.brands.delete}${brandId}`);
                            fetchBrands(); //tải laij hình ảnh khi thành công
                            toast.success('Xóa thương hiệu thành công');
                        } catch (error) {
                            setErrorMessage('Failed to delete brand.');
                        } finally {
                            setLoading(false);
                        }
                    }
                },
                { label: 'No' }
            ]
        });
    };
    //Xử lý khi người dùng nhấn vào chỉnh sửa
    const handleEdit = (brand: Brand) => {
        setEditingBrand(brand); // đặt brand đang chỉnh sửa
        onOpen();// mở modal chỉnh sửa
        fetchBrands();// cập nhật thương hiệu
    };

    //mở modal thêm mới
    const handOpenAddBrandModal = () => {
        setIsAddBrandModalOpen(true);
    }
    //đóng modal thêm mới
    const handCloseAddBrandModal = () => {
        setIsAddBrandModalOpen(false);
    }
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

    return (
        <div>
            <div className="flex justify-between items-center">
                <div className="py-5 h-[62px]">
                    <BreadcrumbNav
                        items={[
                            { name: 'Trang chủ', link: '/' },
                            { name: 'Thương hiệu', link: '#' },
                        ]}
                    />
                </div>
                <div>
                    <Button onPress={onOpen}>Thêm thương hiệu</Button>
                    <Modal size="5xl" scrollBehavior="inside" isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} isKeyboardDismissDisabled={true}>
                        <ModalContent>
                            {(onClose) => (
                                <>
                                    <ModalHeader className="flex flex-col gap-1">Thêm mới thương hiệu</ModalHeader>
                                    <ModalBody>
                                        <div className="flex gap-5 lg:flex-row flex-col mb-5">
                                            <div className="lg:w-1/2 w-full">
                                                <label htmlFor="">Tên thương hiệu</label>
                                                <Input placeholder="Tên thương hiệu" />
                                            </div>
                                            <div className="flex-1">
                                                <label htmlFor="">Tag thương hiệu</label>
                                                <Input placeholder="Tag thương hiệu" />
                                            </div>
                                        </div>
                                        <div>
                                            <label htmlFor="">Hình ảnh</label>
                                            <Input type="file" className="mb-2" onChange={handleImageChange} />
                                            <div className="">
                                                {image.length > 0 && <img src={image[0]} alt="Preview" className="h-20 w-20 object-cover" />}
                                            </div>
                                        </div>
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="danger" variant="light" onPress={onClose}>
                                            Đóng
                                        </Button>
                                        <Button color="primary" onPress={onClose}>
                                            Thêm
                                        </Button>
                                    </ModalFooter>
                                </>
                            )}
                        </ModalContent>
                    </Modal>
                </div>
            </div>
    
            <div>
                <div className="mb-4">
                    <TableBrand />
                </div>
                <div className="flex justify-end w-full">
                    {/* Custom pagination component */}
                    {/* 
                        <CustomPagination
                            totalItems={filteredProducts.length}
                            itemsPerPage={itemsPerPage}
                            currentPage={currentPage}
                            onPageChange={(page: number) => setCurrentPage(page)}
                        /> 
                    */}
                    <Pagination showControls total={10} initialPage={1} />
                </div>
            </div>
        </div>
    );
}

export default BodyBrand;

