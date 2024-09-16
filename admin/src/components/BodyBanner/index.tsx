'use client';
import { useState, ChangeEvent } from "react";
import BreadcrumbNav from "../Breadcrumb/Breadcrumb";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input } from "@nextui-org/react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import { Checkbox } from "@nextui-org/react";
import { Tooltip } from "@nextui-org/react";
import { EditIcon } from "./EditIcon";
import { DeleteIcon } from "./DeleteIcon";
import { confirmAlert } from "react-confirm-alert";
import { useDisclosure } from "@nextui-org/react";

const BobyBanner: React.FC = () => {
    const [image, setImage] = useState<string | null>(null); // New image URL for preview
    const [addModalOpen, setAddModalOpen] = useState(false); // State for "Thêm mới" modal
    const [editModalOpen, setEditModalOpen] = useState(false); // State for "Sửa" modal
    const [oldImage, setOldImage] = useState<string | null>(null); // Image being edited (old image)
    const [newImage, setNewImage] = useState<string | null>(null); // New image selected for editing

    // Handle Delete with confirmation
    const handleDelete = () => {
        confirmAlert({
            title: 'Xóa hình ảnh',
            message: 'Bạn có chắc muốn xóa hình ảnh này?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        console.log('Deleted image');
                    }
                },
                {
                    label: 'No',
                }
            ]
        });
    };

    // Handle image selection for new images (for both add and edit)
    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file); // Create URL for the selected image
            setImage(imageUrl); // Set for preview in the "Thêm mới" modal
        }
    };

    // Handle image selection for editing (new image in "Sửa" modal)
    const handleNewImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const newImageUrl = URL.createObjectURL(file); // Create URL for new image selection
            setNewImage(newImageUrl); // Set for preview in the "Sửa" modal
        }
    };

    // Open "Sửa" modal with the old image
    const handleEditClick = (imageUrl: string) => {
        setOldImage(imageUrl); // Set the old image for editing
        setNewImage(null); // Reset new image selection
        setEditModalOpen(true);
    };

    return (
        <div>
            <div className="flex justify-between items-center">
                <div className="py-5 h-[62px]">
                    <BreadcrumbNav
                        items={[
                            { name: 'Trang chủ', link: '/' },
                            { name: 'Banner', link: '#' },
                        ]}
                    />
                </div>
                <div>
                    {/* Button to open the "Thêm mới" modal */}
                    <Button onPress={() => setAddModalOpen(true)}>Thêm thương hiệu</Button>

                    {/* "Thêm mới" Modal */}
                    <Modal size="5xl" scrollBehavior="inside" isOpen={addModalOpen} onOpenChange={setAddModalOpen} isDismissable={false} isKeyboardDismissDisabled={true}>
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
                                            <Input type="file" accept="image/*" className="mb-2" onChange={handleImageChange} />
                                            {/* Display the preview of the selected image */}
                                            {image && <img src={image} alt="Selected Preview" className="mt-2 h-32 w-32 object-cover" />}
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
                <Table aria-label="Example static collection table">
                    <TableHeader>
                        <TableColumn>
                            <Checkbox></Checkbox>
                        </TableColumn>
                        <TableColumn className="text-center">Image</TableColumn>
                        <TableColumn className="text-center">ACTIONS</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {[1, 2, 3, 4].map((key) => (
                            <TableRow key={key}>
                                <TableCell>
                                    <Checkbox></Checkbox>
                                </TableCell>
                                <TableCell className="flex items-center justify-center">
                                    <div className="h-32 w-[600px] bg-green-400"></div>
                                </TableCell>
                                <TableCell>
                                    <div className="relative flex items-center gap-2 justify-center">
                                        <Tooltip content="Edit image">
                                            <span
                                                className="text-lg text-default-400 cursor-pointer active:opacity-50"
                                                onClick={() => handleEditClick(`image${key}.jpg`)} // Pass old image URL to edit modal
                                            >
                                                <EditIcon />
                                            </span>
                                        </Tooltip>
                                        <Tooltip color="danger" content="Delete image">
                                            <span
                                                className="text-lg text-danger cursor-pointer active:opacity-50"
                                                onClick={handleDelete}
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

                {/* "Sửa" Modal */}
                <Modal size="5xl" scrollBehavior="inside" isOpen={editModalOpen} onOpenChange={setEditModalOpen} isDismissable={false} isKeyboardDismissDisabled={true}>
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">Sửa hình ảnh</ModalHeader>
                                <ModalBody>
                                    <div className="flex flex-col gap-4">
                                        {/* Display the old image */}
                                        <div>
                                            <label>Hình ảnh cũ:</label>
                                            {oldImage && <img src={oldImage} alt="Old" className="mt-2 h-32 w-32 object-cover" />}
                                        </div>
                                        
                                        {/* Upload and preview new image */}
                                        <div>
                                            <label>Chọn hình ảnh mới:</label>
                                            <Input type="file" accept="image/*" className="mb-4" onChange={handleNewImageChange} />
                                            {/* Preview the newly selected image */}
                                            {newImage && <img src={newImage} alt="New" className="mt-2 h-32 w-32 object-cover" />}
                                        </div>
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
            </div>
        </div>
    );
};

export default BobyBanner;
