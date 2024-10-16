'use client'
import BreadcrumbNav from "../Breadcrumb/Breadcrumb";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Spinner, Input } from "@nextui-org/react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { useEffect, useState } from "react";
import axios from "axios";
import apiConfig from "@/configs/api";
import { EditIcon } from "./EditIcon";
import { DeleteIcon } from "./DeleteIcon";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";
import "react-confirm-alert/src/react-confirm-alert.css";
import { Checkbox } from "@nextui-org/react";
import Image from "next/image";

interface Variant {
    name: string;
    price: string;
    stock: string;
    variantValue: string;
    discount: string;
    image: string;
    product_id: string | number;
    id: number;
    discountedPrice: number;
    flashSalePrice: number;
    flash_sales: {
        ProductFlashSaleCount: number;
        StatusFlashSaleStock: string;
        created_at: string;
        end_time: string;
        id: number;
        pivot: {
            discount_percent: number;
            flash_sale_id: number;
            id: number;
            product_variant_id: number;
            sold: number;
            stock: number;
        };
    }[];
    // isEditing?: boolean;
}

interface FlashSale {
    ProductFlashSaleCount: number;
    StatusFlashSaleStock: string | null;
    created_at: string;
    end_time: string;
    id: number;
    start_time: string;
    status: number;
    updated_at: string;
}

function BodyFlashsale() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [products, setProducts] = useState<Variant[]>([]);
    const [productsNotInFlashsale, setProductsNotInFlashsale] = useState<Variant[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<{ [key: string]: { stock: number; discount: number } }>({});
    const [startTime, setStartTime] = useState<string>('');
    const [endTime, setEndTime] = useState<string>('');

    const [newProductId, setNewProductId] = useState<string | number | null>(null);
    const [flashsaleProducts, setFlashsaleProducts] = useState<Variant[]>([]);
    const [flashsale, setFlashsale] = useState<FlashSale[]>([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingTb, setLoadingTb] = useState(false);

    const [editingFlashsale, setEditingFlashsale] = useState<FlashSale | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [showProductList, setShowProductList] = useState<boolean>(false);

    const [editingProductId, setEditingProductId] = useState<number | null>(null);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(apiConfig.products.getallproductvariants, { withCredentials: true });
            setProducts(response.data.productvariants.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const fetchFlashsale = async () => {
        setLoadingTb(true);
        try {
            const reponse = await axios.get(apiConfig.flashsale.getAllFlashsale, { withCredentials: true });
            setFlashsale(reponse.data.flashSales.data)
        } catch (error) {
            console.error('Error fetching flashsale:', error);
        } finally {
            setLoadingTb(false)
        }
    }

    const fetchProductsNotInFlashsale = async (flashsaleId: number) => {
        try {
            const response = await axios.get(`${apiConfig.flashsale.getProductNotInFlashSale}${flashsaleId}`, { withCredentials: true });
            setProductsNotInFlashsale(response.data.flashSaleProduct);
        } catch (error) {
            console.error('Error fetching products not in flashsale:', error);
        }
    };

    const fetchFlashsaleProducts = async (flashsaleId: number) => {
        try {
            const response = await axios.get(`${apiConfig.flashsale.getShowProductFlashsale}${flashsaleId}`, { withCredentials: true });
            setFlashsaleProducts(response.data.FlashsaleProducts.data); // Assuming the response contains a 'products' field
        } catch (error) {
            console.error('Error fetching flashsale products:', error);
        }
    };

    const handleAddProductToFlashSale = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Ensure the default form submission is prevented
        if (newProductId) {
            const product = products.find(p => p.id === newProductId);
            if (product) {
                const flash_sale_id = editingFlashsale?.id; // Ensure this is set correctly
                const product_variant_ids = [product.id]; // Array of product variant IDs
                const stocks = [selectedProducts[product.id]?.stock || 0]; // Array of stocks
                const discount_percents = [selectedProducts[product.id]?.discount || 0]; // Array of discount percents

                // Prepare the data to send
                const data = {
                    flash_sale_id,
                    product_variant_ids,
                    stocks,
                    discount_percents
                };

                console.log('Data to send:', data); // Log the data being sent

                try {
                    setLoading(true);
                    const response = await axios.post(apiConfig.flashsale.addProductToFlashSale, data, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    toast.success('Thêm sản phẩm thành công');
                    if (flash_sale_id !== undefined) { // Check if flash_sale_id is defined
                        fetchProductsNotInFlashsale(flash_sale_id);
                    } else {
                        console.error('flash_sale_id is undefined'); // Handle the case where it is undefined
                    }
                    if (flash_sale_id !== undefined) { // Ensure flash_sale_id is defined
                        fetchFlashsaleProducts(flash_sale_id); // Call only if defined
                    }
                } catch (error) {
                    console.error('Error adding product to flash sale:', error);
                } finally {
                    setLoading(false)
                }
            }
        } else {
            console.error('No product ID selected.'); // Log if no product ID is set
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchFlashsale();
    }, []);

    console.log(flashsaleProducts);

    const handleProductChange = (productId: string | number) => {
        setSelectedProducts(prev => {
            const { [productId]: _, ...rest } = prev; // Destructure to remove the product
            // Initialize with default values if the product is being added
            if (!prev[productId]) {
                setNewProductId(productId); // Set newProductId when a product is selected
            }
            return prev[productId] ? rest : { ...rest, [productId]: { stock: 0, discount: 0 } };
        });
    };

    const handleInputChange = (productId: string | number, field: 'stock' | 'discount', value: number) => {
        setSelectedProducts(prev => ({
            ...prev,
            [productId]: {
                ...prev[productId] || { stock: 0, discount: 0 }, // Ensure the product exists
                [field]: value // Use the input value directly
            }
        }));
    };

    const handleDelete = async (flashsaleId: number) => {
        const flashsaleToDelete = flashsale.find(flashsale => flashsale.id === flashsaleId);

        if (!flashsaleToDelete) {
            setErrorMessage("Category not found.");
            return;
        }

        confirmAlert({
            title: 'Xóa phân loại',
            message: `Bạn có muốn xóa phân loại ${flashsaleToDelete.id}?`,
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        setLoading(true);
                        try {
                            await axios.delete(`${apiConfig.flashsale.deleteflashsale}${flashsaleId}`);
                            fetchFlashsale(); // Refresh categories after deletion
                            toast.success('Xóa khuyến mãi thành công');
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
                    onClick: () => {
                        // Do nothing to keep the modal open
                    }
                }
            ]
        });
    };

    const handleDeletePrFl = async (prId: number) => {
        // const flashsaleToDelete = flashsale.find(flashsale => flashsale.id === prId);

        // if (!flashsaleToDelete) {
        //     setErrorMessage("Category not found.");
        //     return;
        // }

        confirmAlert({
            title: 'Xóa phân loại',
            message: `Bạn có muốn xóa ?`,
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        setLoading(true);
                        try {
                            await axios.delete(`${apiConfig.flashsale.deleteProductFlashSale}${prId}`);
                            fetchFlashsale(); // Refresh categories after deletion
                            toast.success('Xóa sản phẩm thành công');
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

    const addFlashSale = async () => {
        const start_time = startTime;
        const end_time = endTime;
        const product_variant_ids = Object.keys(selectedProducts).map(id => Number(id));
        const stocks = Object.values(selectedProducts).map(product => product.stock); // Lấy giá trị từ input
        const discount_percents = Object.values(selectedProducts).map(product => product.discount); // Lấy giá trị từ input

        if (!start_time || !end_time || product_variant_ids.length === 0) {
            console.error('Validation failed: Missing required fields.');
            return;
        }

        // Log the data to check for issues
        console.log({ start_time, end_time, product_variant_ids, stocks, discount_percents });

        try {
            setLoading(true);
            const response = await axios.post(apiConfig.flashsale.createflashsale, {
                start_time,
                end_time,
                product_variant_ids,
                stocks,
                discount_percents
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('Flash sale added:', response.data);
        } catch (error) {
            console.error('Error adding flash sale:', error);
        } finally {
            setLoading(false)
        }
    };
    const openEditModal = (flashsale: FlashSale) => {
        setEditingFlashsale(flashsale);
        fetchFlashsaleProducts(flashsale.id);
        fetchProductsNotInFlashsale(flashsale.id);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setEditingFlashsale(null);
    };

    const openEditTimeModal = () => {
        setIsEditModalOpen(true); // Open the edit time modal
    };

    const handleSubmitEditTime = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevent default form submission

        // Validate start_time and end_time
        if (!startTime || !endTime) {
            toast.error('Thời gian bắt đầu và kết thúc là bắt buộc.'); // Show error message
            return;
        }

        const updatedFlashSale = {
            start_time: startTime,
            end_time: endTime,
        };

        try {
            await axios.put(`${apiConfig.flashsale.editTimeFlashSale}${editingFlashsale?.id}`, updatedFlashSale, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            toast.success('Cập thời gian nhật khuyến mãi thành công');
            fetchFlashsale(); // Refresh the flash sale list
            closeEditModal(); // Close the modal after saving
        } catch (error) {
            console.error('Error updating flash sale:', error);
            toast.error('Cập nhật khuyến mãi thất bại');
        }
    };
    return (
        <div>
                {loading && (
                <div className="fixed z-[9999] inset-0 bg-gray-800 bg-opacity-75 flex gap-3 justify-center items-center w-screen h-screen ">
                    <Spinner size="lg" color="white" />
                    <p className="text-white text-lg">Đang xử lý...</p>
                </div>
            )}
            <div className="flex justify-between items-center">
                <div className="py-5 h-[62px]">
                    <BreadcrumbNav
                        items={[
                            { name: 'Trang chủ', link: '/' },
                            { name: 'Flash Sale', link: '#' },
                        ]}
                    />
                </div>
                <div>
                    <Button onPress={onOpen} color="primary">Thêm chương trình khuyển mãi</Button>
                    <Modal size="5xl" scrollBehavior="inside" isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} isKeyboardDismissDisabled={true}>
                        <ModalContent>
                            {(onClose) => (
                                <>
                                    <ModalHeader className="flex flex-col gap-1">Thêm mới flash sale</ModalHeader>
                                    <ModalBody>
                                        <div>
                                            <div className="flex gap-10 mb-2">
                                                <div>
                                                    <label className="font-bold text-base">Thời gian bắt đầu:</label><br />
                                                    <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                                                </div>
                                                <div>
                                                    <label className="font-bold text-base">Thời gian kết thúc:</label><br />
                                                    <input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-bold text-base">Chọn sản phẩm:</div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    {products.map(product => (
                                                        <div key={product.id} className="p-5 border-2 border-gray-300 rounded-lg flex-1">
                                                            <Checkbox onChange={() => handleProductChange(product.id)}>
                                                                <div className="flex gap-2 items-center">
                                                                    <div><Image src={product.image} alt={product.name} width={40} height={40} loading="lazy" /></div>
                                                                    <div>{product.name}</div>
                                                                </div>
                                                            </Checkbox>

                                                            {selectedProducts[product.id] && (
                                                                <div className="flex gap-2 mt-2">
                                                                    <div>
                                                                        <label htmlFor="st" className="font-medium">Số lượng</label>
                                                                        <Input
                                                                            id="st"
                                                                            type="number"
                                                                            placeholder="Số lượng"
                                                                            value={String(selectedProducts[product.id]?.stock || '')} // Convert to string
                                                                            onChange={(e) => handleInputChange(product.id, 'stock', Number(e.target.value))}
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <label htmlFor="di" className="font-medium">Giảm giá (%)</label>
                                                                        <Input
                                                                            id="di"
                                                                            type="number"
                                                                            placeholder="Giảm giá (%)"
                                                                            value={selectedProducts[product.id]?.discount !== undefined ? String(selectedProducts[product.id]?.discount) : ''} // Convert to string
                                                                            onChange={(e) => handleInputChange(product.id, 'discount', Number(e.target.value))} // Cập nhật giá trị khi người dùng nhập
                                                                        />
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="danger" variant="light" onPress={onClose}>Hủy</Button>
                                        <Button color="primary" onPress={async () => {
                                            await addFlashSale(); // Call addFlashSale on form submission
                                            console.log({ startTime, endTime, selectedProducts });
                                            onClose();
                                        }}>
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
                    <Table aria-label="Example static collection table">
                        <TableHeader>
                            <TableColumn>
                                <div className="flex justify-center">ID</div>
                            </TableColumn>
                            <TableColumn>
                                <div className="flex justify-center">Trạng thái</div>
                            </TableColumn>
                            <TableColumn>
                                <div className="flex justify-center">Thời gian bắt đầu</div>
                            </TableColumn>
                            <TableColumn>
                                <div className="flex justify-center">Thời gian kết thúc</div>
                            </TableColumn>
                            <TableColumn>
                                <div className="flex justify-center">Số lượng sản phẩm</div>
                            </TableColumn>
                            <TableColumn>
                                <div className="flex justify-center">Thao tác</div>
                            </TableColumn>
                        </TableHeader>


                        <TableBody items={flashsale}>
                            
                            {(item) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <div className="flex items-center justify-center">
                                        {item.id}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                       <div className="flex items-center justify-center">
                                       <div className="w-28 flex items-center justify-center">
                                            {item.status === 0 ? <div className="bg-red-600 text-white font-bold p-1 rounded-lg">Chưa bắt đầu</div> : item.status === 1 ? <div className="bg-green-600 text-white font-bold p-1 rounded-lg">Đang diễn ra</div> : item.status}
                                        </div>
                                       </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-center">
                                        {item.start_time}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex items-center justify-center">
                                      {item.end_time}
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                       <div className="flex items-center justify-center">
                                       {item.ProductFlashSaleCount}
                                       </div>
                                    </TableCell>
                                    <TableCell>
                                       <div className="flex items-center justify-center">
                                       <div className='flex items-center gap-2'>
                                            <span className="text-lg text-default-400 cursor-pointer active:opacity-50" onClick={() => openEditModal(item)}>
                                                <EditIcon />
                                            </span>
                                            <span className="text-lg text-danger cursor-pointer active:opacity-50" onClick={() => handleDelete(item.id)}><DeleteIcon /></span>
                                        </div>
                                       </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex justify-end w-full">
                    {/* <Pagination showControls total={10} initialPage={1} /> */}
                </div>
            </div>

            {/* Edit Modal moved outside of the table */}
            <Modal isOpen={isEditModalOpen} onClose={closeEditModal} className="bg-[#FCFCFC]" size="4xl" scrollBehavior="inside">
                <ModalContent>
                    <ModalHeader><div className="text-2xl">Sửa chương trình giảm giá</div></ModalHeader>
                    <ModalBody>
                        <div className="flex flex-col gap-2">
                            <div>{`Bạn đang xem chương trình giảm giá ID : ${editingFlashsale?.id}`}</div>
                            <div className="w-auto flex items-center justify-start">
                                <span className="mr-2">Trạng thái: </span>
                                {editingFlashsale?.status === 0 ?
                                    <div className="bg-red-600 text-white font-bold p-1 rounded-lg">Chưa bắt đầu</div> :
                                    editingFlashsale?.status === 1 ?
                                        <div className="bg-green-600 text-white font-bold p-1 rounded-lg">Đang diễn ra</div> :
                                        editingFlashsale?.status}
                            </div>
                            <form onSubmit={handleSubmitEditTime}> {/* Added onSubmit handler */}
                                <div className="flex gap-10 mb-2 items-center">
                                    <div>
                                        <label className="font-bold text-base">Thời gian bắt đầu:</label><br />
                                        <input type="datetime-local" value={editingFlashsale?.start_time} onChange={(e) => setStartTime(e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="font-bold text-base">Thời gian kết thúc:</label><br />
                                        <input type="datetime-local" value={editingFlashsale?.end_time} onChange={(e) => setEndTime(e.target.value)} />
                                    </div>
                                    <Button type="submit" color="primary">Lưu</Button> {/* Added submit button */}
                                </div>

                            </form>
                            <div>
                                {!showProductList && ( // Hide button when product list is shown
                                    <Button onPress={() => setShowProductList(prev => !prev)}>Chọn sản phẩm để thêm vào flash sale</Button>
                                )}
                                {showProductList && ( // Show product list if showProductList is true
                                    <div>
                                        <div className="font-bold text-base">Chọn sản phẩm:</div>
                                        <form onSubmit={handleAddProductToFlashSale}>
                                            <div className="grid grid-cols-2 gap-2 mb-2">
                                                {productsNotInFlashsale.map(product => (
                                                    <div key={product.id} className="p-5 border-2 border-gray-300 rounded-lg flex-1">
                                                        <Checkbox onChange={() => handleProductChange(product.id)}>
                                                            <div className="flex gap-2 items-center">
                                                                <div><Image src={product.image} alt={product.name} width={40} height={40} loading="lazy" /></div>
                                                                <div>{product.name}</div>
                                                            </div>
                                                        </Checkbox>
                                                        {selectedProducts[product.id] && ( // Check if the product is selected
                                                            <div className="flex gap-2 mt-2">
                                                                <div>
                                                                    <label htmlFor={`stock-${product.id}`} className="font-medium">Số lượng</label>
                                                                    <Input
                                                                        id={`stock-${product.id}`}
                                                                        type="number"
                                                                        placeholder="Số lượng"
                                                                        value={selectedProducts[product.id]?.stock !== undefined ? String(selectedProducts[product.id]?.stock) : ''} // Convert to string
                                                                        onChange={(e) => handleInputChange(product.id, 'stock', Number(e.target.value))}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label htmlFor={`discount-${product.id}`} className="font-medium">Giảm giá (%)</label>
                                                                    <Input
                                                                        id={`discount-${product.id}`}
                                                                        type="number"
                                                                        placeholder="Giảm giá (%)"
                                                                        value={selectedProducts[product.id]?.discount !== undefined ? String(selectedProducts[product.id]?.discount) : ''} // Convert to string
                                                                        onChange={(e) => handleInputChange(product.id, 'discount', Number(e.target.value))}
                                                                    />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}

                                            </div>
                                            <div className="flex gap-2">
                                                <Button type="submit" color="primary">Thêm</Button>
                                                <Button type="button" color="danger" onPress={() => setShowProductList(false)}>Hủy</Button> {/* Added cancel button */}
                                            </div>
                                        </form>
                                    </div>
                                )}
                            </div>
                            <div>
                                <div className="font-bold text-base">Danh sách sản phẩm:</div>
                                <div className="grid grid-cols-2 gap-4">
                                    {flashsaleProducts.map(product => (
                                        <div key={product.id} className="p-5 border-2 border-gray-300 rounded-lg flex-1">
                                            <div className="flex gap-2 items-center">
                                                <div><Image src={product.image} alt={product.name} width={40} height={40} loading="lazy" /></div>
                                                <div>{product.name}</div>
                                            </div>
                                            <div className="flex gap-2 mt-2">
                                                {editingProductId === product.id ? ( // Check if this product is being edited
                                                    <div className="flex flex-col gap-2">
                                                        <div className="grid grid-cols-2 gap-2">
                                                            <div>
                                                                <label htmlFor={`stock-${product.id}`} className="font-medium">Số lượng</label>
                                                                <Input
                                                                    required
                                                                    id={`stock-${product.id}`}
                                                                    type="number"
                                                                    placeholder="Số lượng"
                                                                    value={selectedProducts[product.id]?.stock !== undefined ? String(selectedProducts[product.id]?.stock) : ''} // Convert to string
                                                                    onChange={(e) => handleInputChange(product.id, 'stock', Number(e.target.value))}
                                                                />
                                                            </div>
                                                            <div>
                                                                <label htmlFor={`discount-${product.id}`} className="font-medium">Giảm giá (%)</label>
                                                                <Input
                                                                    required
                                                                    id={`discount-${product.id}`}
                                                                    type="number"
                                                                    placeholder="Giảm giá (%)"
                                                                    value={selectedProducts[product.id]?.discount !== undefined ? String(selectedProducts[product.id]?.discount) : ''} // Convert to string
                                                                    onChange={(e) => handleInputChange(product.id, 'discount', Number(e.target.value))}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-2">
                                                            <Button
                                                                color="primary"
                                                                onPress={async () => {
                                                                    // Logic to save the updated stock and discount
                                                                    const updatedData = {
                                                                        flash_sale_id: editingFlashsale?.id,
                                                                        product_variant_id: product.id,
                                                                        stock: selectedProducts[product.id]?.stock || 0,
                                                                        discount_percent: selectedProducts[product.id]?.discount || 0,
                                                                    };

                                                                    console.log(updatedData);

                                                                    try {
                                                                        const flashSalePivot = Array.isArray(product.flash_sales) && product.flash_sales.length > 0 ? product.flash_sales[0].pivot.id : null;
                                                                        await axios.put(`${apiConfig.flashsale.editProductFlashSale}${flashSalePivot}`, updatedData, {
                                                                            headers: {
                                                                                'Content-Type': 'application/json'
                                                                            }
                                                                        });
                                                                        toast.success('Cập nhật sản phẩm thành công');
                                                                        setEditingProductId(null); // Reset editing state
                                                                    } catch (error) {
                                                                        console.error('Error updating product:', error);
                                                                        toast.error('Cập nhật sản phẩm thất bại');
                                                                    }
                                                                }}
                                                            >
                                                                Lưu
                                                            </Button>
                                                            <Button
                                                                color="danger"
                                                                onPress={() => {
                                                                    setEditingProductId(null); // Reset editing state
                                                                }}
                                                            >
                                                                Hủy
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex gap-2 flex-col">
                                                        <div className="flex gap-2 flex-col">
                                                            <div className="flex items-center gap-2">
                                                                <label htmlFor={`stock-${product.id}`} className="font-medium w-[100px]">Số lượng</label>
                                                                <span className="w-12 h-12 flex items-center justify-center border-2 border-gray-300 rounded-lg">{product.flash_sales[0].pivot.stock}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <label htmlFor={`discount-${product.id}`} className="font-medium w-[100px]">Giảm giá (%)</label>
                                                                <span className="w-12 h-12 flex items-center justify-center border-2 border-gray-300 rounded-lg">{product.flash_sales[0].pivot.discount_percent}</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Button
                                                                color="primary"
                                                                onPress={() => {
                                                                    setEditingProductId(product.id); // Set the product being edited
                                                                }}
                                                            >
                                                                Sửa
                                                            </Button>
                                                            <Button
                                                                color="danger"
                                                                onPress={() => {
                                                                    if (flashsaleProducts.length > 1) {
                                                                        const flashSalePivot = Array.isArray(product.flash_sales) && product.flash_sales.length > 0 ? product.flash_sales[0].pivot.id : null;
                                                                        if (flashSalePivot) {
                                                                            handleDeletePrFl(flashSalePivot);
                                                                        } else {
                                                                            toast.error('Không thể xóa sản phẩm cuối cùng trong flash sale.');
                                                                        }
                                                                    } else {
                                                                        toast.error('Không thể xóa sản phẩm cuối cùng trong flash sale.');
                                                                    }
                                                                }}
                                                            >
                                                                Xóa
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={closeEditModal}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

        </div>
    );
}

export default BodyFlashsale;