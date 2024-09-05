import React from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, User, Chip, Tooltip, ChipProps } from "@nextui-org/react";
import { EditIcon } from "./EditIcon";
import { DeleteIcon } from "./DeleteIcon";
import { EyeIcon } from "./EyeIcon";
import { columns, users } from "./data";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/react";
import { Textarea } from "@nextui-org/input";

const statusColorMap: Record<string, ChipProps["color"]> = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};

type User = typeof users[0];

export default function TableCategory() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const handleDelete = (userId: number) => {
        confirmAlert({
            title: 'Xóa phân loại',
            message: 'Bạn có chắc muốn xóa phân loại?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        console.log('Deleted user with id:', userId);
                    }
                },
                {
                    label: 'No',
                }
            ]
        });
    };

    const renderCell = React.useCallback((user: User, columnKey: React.Key) => {
        const cellValue = user[columnKey as keyof User];

        switch (columnKey) {
            case "name":
                return (
                    <User
                        avatarProps={{ radius: "lg", src: user.img }}
                        name={cellValue}
                    />
                );
            case "role":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-sm capitalize">{cellValue}</p>
                    </div>
                );
            case "actions":
                return (
                    <div className="relative flex items-center gap-2 justify-center">
                        <Tooltip content="Edit user">
                            <span
                                className="text-lg text-default-400 cursor-pointer active:opacity-50"
                                onClick={onOpen}
                            >
                                <EditIcon />
                            </span>
                        </Tooltip>
                        <Tooltip color="danger" content="Delete user">
                            <span
                                className="text-lg text-danger cursor-pointer active:opacity-50"
                                onClick={() => handleDelete(user.id)}
                            >
                                <DeleteIcon />
                            </span>
                        </Tooltip>
                    </div>
                );
            default:
                return cellValue;
        }
    }, [onOpen]);

    return (
        <>
            <Table aria-label="Example table with custom cells">
                <TableHeader columns={columns}>
                    {(column) => (
                        <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody items={users}>
                    {(item) => (
                        <TableRow key={item.id}>
                            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <Modal size="5xl" scrollBehavior="inside" isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} isKeyboardDismissDisabled={true}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Sửa sản phẩm</ModalHeader>
                            <ModalBody>
                                <div className="flex gap-5 lg:flex-row flex-col mb-5">
                                    <div className="lg:w-1/2 w-full">
                                        <label htmlFor="">Giá sản phẩm</label>
                                        <Input type="number" placeholder="Giá sản phẩm" />
                                    </div>
                                    <div className="flex-1">
                                        <label htmlFor="">Giảm giá sản phẩm</label>
                                        <Input max={100} type="number" placeholder="Giảm giá sản phẩm" />
                                    </div>
                                </div>
                                <div className="flex gap-5 lg:flex-row flex-col mb-5">
                                    <div className="lg:w-1/2 w-full">
                                        <label htmlFor="">Số lượng sản phẩm</label>
                                        <Input type="number" placeholder="Số lượng sản phẩm" />
                                    </div>
                                    <div className="flex-1">
                                        <label htmlFor="">Cân nặng sản phẩm (g)</label>
                                        <Input type="number" placeholder="Cân nặng sản phẩm (g)" />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="">Hình ảnh</label>
                                    <Input type="file" />
                                </div>
                                <div>
                                    <label htmlFor="">Mô tả sản phẩm</label>
                                    <Textarea
                                        variant="bordered"
                                        placeholder="Enter your description"
                                        disableAnimation
                                        disableAutosize
                                        classNames={{
                                            base: "w-full",
                                            input: "resize-y min-h-[40px]",
                                        }}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="">Mô tả chi tiết</label>
                                    <Textarea
                                        variant="bordered"
                                        placeholder="Enter your description"
                                        disableAnimation
                                        disableAutosize
                                        classNames={{
                                            base: "w-full",
                                            input: "resize-y min-h-[40px]",
                                        }}
                                    />
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Đóng
                                </Button>
                                <Button color="primary" onPress={onClose}>
                                    Sửa
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
