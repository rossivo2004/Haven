'use client'
import './style.css';
import BreadcrumbNav from "../Breadcrumb/Breadcrumb";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Table, TableHeader, TableColumn, TableRow, TableCell, TableBody, Tooltip, Radio, cn, RadioGroup } from "@nextui-org/react";
import TableOrder from "../TableOrder";
import CustomPagination from "@/components/Pagination";
import { Pagination } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/react";
import { Textarea } from "@nextui-org/input";
import { EyeIcon } from "./EyeIcon";
import { EditIcon } from "./EditIcon";
import { DeleteIcon } from "./DeleteIcon";
import { confirmAlert } from "react-confirm-alert";
import { useEffect, useState } from 'react';
import { Order } from '@/interface';
import axios from 'axios';
import apiConfig from '@/configs/api';
import "react-confirm-alert/src/react-confirm-alert.css";
import { toast } from 'react-toastify';

const getStatusColor = (status: string) => {
    switch (status) {
        case 'pending':
            return { color: 'orange' }; // Color for pending
        case 'preparing':
            return { color: 'blue' }; // Color for preparing
        case 'transport':
            return { color: 'purple' }; // Color for transport
        case 'complete':
            return { color: 'green' }; // Color for complete
        case 'canceled':
            return { color: 'red' }; // Color for complete
        default:
            return { color: 'black' }; // Default color
    }
};

const getStatusText = (status: string) => {
    switch (status) {
        case 'pending':
            return <div className='bg-yellow-100 w-32 py-1 flex items-center justify-center rounded-lg border border-yellow-700'>Đang chờ</div>; // Pending
        case 'preparing':
            return <div className='bg-blue-100 w-32 py-1 flex items-center justify-center rounded-lg border border-blue-700'>Đang chuẩn bị</div>; // Preparing
        case 'transport':
            return <div className='bg-purple-100 w-32 py-1 flex items-center justify-center rounded-lg border border-purple-700'>Đang vận chuyển</div>; // Transport
        case 'complete':
            return <div className='bg-green-100 w-32 py-1 flex items-center justify-center rounded-lg border border-green-700'>Hoàn thành</div>; // Complete
        case 'canceled':
            return <div className='bg-red-100 w-32 py-1 flex items-center justify-center rounded-lg border border-red-700'>Hủy</div>; // Complete
        default:
            return 'Không xác định'; // Default text
    }
};

const getStatusTextModal = (status: string) => {
    switch (status) {
        case 'pending':
            return <div className=' w-full h-full p-2 flex items-center justify-center rounded-lg text-yellow-700'>Đang chờ</div>; // Pending
        case 'preparing':
            return <div className=' w-full h-full p-2 flex items-center justify-center rounded-lg text-blue-700'>Đang chuẩn bị</div>; // Preparing
        case 'transport':
            return <div className=' w-full h-full p-2 flex items-center justify-center rounded-lg text-purple-700'>Đang vận chuyển</div>; // Transport
        case 'complete':
            return <div className=' w-full h-full p-2 flex items-center justify-center rounded-lg text-green-700'>Hoàn thành</div>; // Complete
        case 'canceled':
            return <div className=' w-full h-full p-2 flex items-center justify-center rounded-lg text-red-700'>Hủy</div>; // Complete
        default:
            return 'Không xác định'; // Default text
    }
};


const orderStatuses = ['pending', 'preparing', 'transport', 'complete']; 

function BodyOrders() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const [order, setOrder] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);

    const [selectedStatus, setSelectedStatus] = useState<string>(''); // Thêm state để lưu trạng thái đã chọn
    const [idOrrder, setIdOrrder] = useState<string>(''); // Thêm state để lưu trạng thái đã chọn
    

// ... existing code ...
const handleEditStatus = (status: string, idOrder: number) => {
    setSelectedStatus(status); // Cập nhật trạng thái đã chọn
    console.log("Selected Status:", status); // Kiểm tra giá trị
    setIdOrrder(String(idOrder)); // Set the idOrrder state correctly
    onOpen(); // Mở modal
};
// ... existing code ...

    const fecthOrder = async () => {
        setLoading(true);
        try {
            const response = await axios.get(apiConfig.order.getAll);
            const data = response.data; // Changed from response.json() to response.data
            setOrder(data);
        } catch (error) {
            console.log("Lỗi");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fecthOrder();
    }, []);

    console.log(order);


    const CustomRadio = (props: any) => {
        const { children, ...otherProps } = props;

        return (
            <Radio
                {...otherProps}
                classNames={{
                    base: cn(
                        "inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between",
                        "flex-row-reverse max-w-[300px] cursor-pointer rounded-lg gap-4 p-4 border-2 border-transparent",
                        "data-[selected=true]:border-primary"
                    ),
                }}
            >
                {children}
            </Radio>
        );
    };


    const handleDelete = (userId: number) => {
        confirmAlert({
            title: "Xóa sản phẩm",
            message: "Bạn có chắc muốn xóa sản phẩm?",
            buttons: [
                {
                    label: "Yes",
                    onClick: () => {
                        console.log("Deleted user with id:", userId);
                    },
                },
                {
                    label: "No",
                },
            ],
        });
    }

    const cancelOrder = (idOrrder: number) => {
        confirmAlert({
            title: "Hủy đơn hàng",
            message: "Bạn có chắc muốn hủy đơn hàng?",
            buttons: [
                {
                    label: "Yes",
                    onClick: async () => { // Thay đổi thành async để sử dụng await
                        try {
                            const response = await axios.post(`${apiConfig.order.cancelOrder}${idOrrder}`); // Thêm await để chờ phản hồi
                            if (response.status === 400) { // Kiểm tra nếu phản hồi trả về 400
                                toast.error("Lỗi: Không thể hủy đơn hàng"); // Thông báo lỗi
                                return; // Dừng thực hiện nếu có lỗi
                            }
                            toast.success("Hủy đơn thành công"); // Sửa thông báo thành công
                        } catch (error) {
                            toast.error("Lỗi khi hủy đơn hàng"); // Cập nhật thông báo lỗi
                        }
                    },
                },
                {
                    label: "No",
                },
            ],
        });
    };

    const handleConfirmUpdate = () => {
        if (idOrrder) {
            console.log("Updating Order ID:", idOrrder, "with Status:", selectedStatus); // Kiểm tra giá trị
            updateOrderStatus(Number(idOrrder), selectedStatus); // Sử dụng selectedStatus làm giá trị trạng thái
        }
    };

    const updateOrderStatus = async (idOrder: number, status: string) => {
        try {
            await axios.put(`${apiConfig.order.updateOrderStatus}${idOrder}`, { status });
            toast.success("Cập nhật trạng thái đơn hàng thành công");
            fecthOrder(); // Refresh the order list after updating
        } catch (error) {
            toast.error("Lỗi khi cập nhật trạng thái");
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center">
                <div className="py-5 h-[62px]">
                    <BreadcrumbNav
                        items={[
                            { name: 'Trang chủ', link: '/' },
                            { name: 'Đơn hàng', link: '#' },
                        ]}
                    />
                </div>
            </div>

            <div>
                <div className="mb-4">
                    <Table aria-label="Example static collection table">
                        <TableHeader>
                            <TableColumn>Mã đơn hàng</TableColumn>
                            <TableColumn><div className='flex justify-center w-full'>Ngày đặt</div></TableColumn>
                            <TableColumn><div className='flex justify-center w-full'>Trạng thái</div></TableColumn>
                            <TableColumn><div className='flex justify-center w-full'>Thao tác</div></TableColumn>
                        </TableHeader>
                        <TableBody>
                            {order.map((item, ind) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.invoice_code}</TableCell>
                                    <TableCell><div className='flex justify-center w-full'>{new Date(item.created_at).toLocaleDateString('en-GB')}</div></TableCell>
                                    <TableCell style={getStatusColor(item.status)}><div className='flex justify-center w-full'>{getStatusText(item.status)}</div></TableCell>
                                    <TableCell>
                                        <div className="relative flex items-center gap-2 justify-center">
                                            <Tooltip content="Details">
                                                <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                                    <EyeIcon />
                                                </span>
                                            </Tooltip>
                                            <Tooltip content="Edit status">
                        <span className="text-lg text-default-400 cursor-pointer active:opacity-50" onClick={() => handleEditStatus(item.status, item.id)}>
                            <EditIcon />
                        </span>
                    </Tooltip>
                                            <Tooltip color="danger" content="Delete order">
                                                <span
                                                    className="text-lg text-danger cursor-pointer active:opacity-50"
                                                    onClick={() => handleDelete(item.id)}
                                                >
                                                    <DeleteIcon />
                                                </span>
                                            </Tooltip>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex justify-end w-full">

                    <Pagination showControls total={10} initialPage={1} />
                </div>
            </div>

            <Modal isOpen={isOpen} size="5xl" onOpenChange={onOpenChange} isDismissable={false} isKeyboardDismissDisabled={true}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex gap-1">Đơn hàng</ModalHeader>
                            <ModalBody>
                                <div>
                                <RadioGroup className="w-full !justify-between mb-2" orientation="horizontal" value={selectedStatus} onChange={(event) => setSelectedStatus(event.target.value)}>
    {orderStatuses.map((status) => (
        <CustomRadio key={status} value={status}>
            {getStatusTextModal(status)} {/* Use the getStatusText function to display the correct text */}
        </CustomRadio>
    ))}
</RadioGroup>   
                                    <div>
                                        <Button color='danger' onClick={() => cancelOrder(Number(idOrrder))}>Hủy đơn hàng</Button>
                                    </div>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
        Đóng
    </Button>
    <Button color="primary" onPress={() => { handleConfirmUpdate(); onClose(); }}>
        Xác nhận
    </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}

export default BodyOrders;