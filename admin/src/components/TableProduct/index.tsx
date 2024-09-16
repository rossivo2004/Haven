import React from "react";
import { useState, ChangeEvent } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, User, Chip, Tooltip, ChipProps } from "@nextui-org/react";
import { EditIcon } from "./EditIcon";
import { DeleteIcon } from "./DeleteIcon";
import { EyeIcon } from "./EyeIcon";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/react";
import { Textarea } from "@nextui-org/input";
import { Link } from "@nextui-org/react";
const statusColorMap: Record<string, ChipProps["color"]> = {
    active: "success",
    paused: "danger",
    vacation: "warning",
};

const columns = [
    { name: "Tên sản phẩm", uid: "name" },
    { name: "Giá", uid: "price" },
    { name: "Số lượng", uid: "quantity" },
    { name: "Giảm giá", uid: "discount" },
    { name: "ACTIONS", uid: "actions" },
];

const users = [
    {
        id: 1,
        name: "Tony Reichert",
        price: "CEO",
        team: "Management",
        quantity: "active",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
        discount: "tony.reichert@example.com",
    },
    {
        id: 2,
        name: "Zoey Lang",
        price: "Technical Lead",
        team: "Development",
        quantity: "paused",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
        discount: "zoey.lang@example.com",
    },
    {
        id: 3,
        name: "Jane Fisher",
        price: "Senior Developer",
        team: "Development",
        quantity: "active",
        avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
        discount: "jane.fisher@example.com",
    },
    {
        id: 4,
        name: "William Howard",
        price: "Community Manager",
        team: "Marketing",
        quantity: "vacation",
        avatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d",
        discount: "william.howard@example.com",
    },
    {
        id: 5,
        name: "Kristen Copper",
        price: "Sales Manager",
        team: "Sales",
        quantity: "active",
        avatar: "https://i.pravatar.cc/150?u=a092581d4ef9026700d",
        discount: "kristen.cooper@example.com",
    },
];

type User = typeof users[0];

export default function TableProduct() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [image, setImage] = useState<string[]>([]); // State for image previews

    const animals = [
        { key: "cat", label: "Cat" },
        { key: "dog", label: "Dog" },
        { key: "elephant", label: "Elephant" },
    ];

    const handleDelete = (userId: number) => {
        confirmAlert({
            title: 'Xóa sản phẩm',
            message: 'Bạn có chắc muốn xóa sản phẩm?',
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
                        avatarProps={{ radius: "lg", src: user.avatar }}
                        name={cellValue}
                    />
                );
            case "role":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-sm capitalize">{cellValue}</p>
                        <p className="text-bold text-sm capitalize text-default-400">{user.team}</p>
                    </div>
                );
            case "status":
                return (
                    <Chip className="capitalize" color={statusColorMap[user.discount]} size="sm" variant="flat">
                        {cellValue}
                    </Chip>
                );
            case "actions":
                return (
                    <div className="relative flex items-center gap-2 justify-center">
                        <Tooltip content="Details">
                            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
<Link href="/shop" isExternal>
                                <EyeIcon />
</Link>
                            </span>
                        </Tooltip>
                        <Tooltip content="Edit product">
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

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []); // Get the selected files
        const previews = files.map((file) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            return new Promise<string>((resolve) => {
                reader.onloadend = () => {
                    resolve(reader.result as string); // Convert to data URL
                };
            });
        });

        Promise.all(previews).then((images) => {
            setImage(images); // Store image previews
        });
    };

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
                            <ModalHeader className="flex flex-col gap-1 text-2xl">Chỉnh sửa sản phẩm</ModalHeader>
                            <ModalBody>
                            <div className="flex gap-5 lg:flex-row flex-col mb-5">
                                            <div className="lg:w-1/2 w-full">
                                                <label htmlFor="name-product">Tên sản phẩm</label>
                                                <Input id="name-product" placeholder="Tên sản phẩm" />
                                            </div>
                                            <div className="flex-1">
                                                <label htmlFor="category-select">Phân loại</label>
                                                <Select id="category-select" className="w-full" placeholder="Phân loại" aria-label="Chọn phân loại">
                                                    {animals.map((animal) => (
                                                        <SelectItem key={animal.key}>
                                                            {animal.label}
                                                        </SelectItem>
                                                    ))}
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="flex gap-5 lg:flex-row flex-col mb-5">
                                            <div className="lg:w-1/2 w-full">
                                                <label htmlFor="price-product">Giá sản phẩm</label>
                                                <Input id="price-product" type="number" placeholder="Giá sản phẩm" min={1000}/>
                                            </div>
                                            <div className="flex-1">
                                                <label htmlFor="priceSale-product">Giảm giá sản phẩm</label>
                                                <Input id="priceSale-product" max={100} min={0} type="number" placeholder="Giảm giá sản phẩm" />
                                            </div>
                                        </div>
                                        <div className="flex gap-5 lg:flex-row flex-col mb-5">
                                            <div className="lg:w-1/2 w-full">
                                                <label htmlFor="quantity-product">Số lượng sản phẩm</label>
                                                <Input id="quantity-product" min={0} type="number" placeholder="Giá sản phẩm" />
                                            </div>
                                          
                                        </div>
                                        <div>
                                            <label htmlFor="image-product">Hình ảnh</label>
                                            <Input id="image-product" type="file" multiple max={5} onChange={handleImageChange} />
                                        </div>
                                        <div className="grid grid-cols-5 gap-4">
                                            {/* Image previews */}
                                            {image.map((imgSrc, index) => (
                                                <div key={index} className="w-full h-40 bg-amber-600">
                                                    <img src={imgSrc} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                                                </div>
                                            ))}
                                        </div>
                                        <div>
                                            <label htmlFor="description-product">Mô tả sản phẩm</label>
                                            <Textarea
                                            id="description-product"
                                            required
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
                                            <label htmlFor="descriptionDetail-product">Mô tả chi tiết</label>
                                            <Textarea
                                            id="descriptionDetail-product"
                                            isRequired
                                            rows={6}
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
