'use client';
import { useEffect, useState } from "react";
import BreadcrumbNav from "../Breadcrumb/Breadcrumb";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Spinner, Input } from "@nextui-org/react";
import axios from "axios";
import apiConfig from "@/configs/api";
import { Brand } from "@/interface";
import "react-toastify/dist/ReactToastify.css";
import $ from "jquery";
import "summernote/dist/summernote-bs4.css"; // Import CSS của Summernote
import "summernote/dist/summernote-bs4.min.js"; // Import JavaScript của Summernote
import { toast } from "react-toastify";

// Add this declaration at the top of your file
declare global {
    interface JQuery {
        summernote: any; // or a more specific type if available
    }
}

function BodyBlog() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [loading, setLoading] = useState(false);
    const [isAddBrandModalOpen, setIsAddBrandModalOpen] = useState(false);
    const [title, setTitle] = useState(""); // State for title
    const [content, setContent] = useState(""); // State for content

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    const handleOpenAddBrandModal = () => {
        setIsAddBrandModalOpen(true);
    };

    const handleCloseAddBrandModal = () => {
        setIsAddBrandModalOpen(false);
    };

    const handleSubmit = async (onClose: () => void) => {
        setLoading(true);
        try {
            const response = await axios.post(`${baseUrl}/blog`, { title, content });
            console.log("Blog saved successfully:", response.data);
            toast.success("Bài viết đã được lưu thành công!");
        } catch (error) {
            console.error("Error saving blog:", error);
            toast.error("Có lỗi xảy ra khi lưu bài viết.");
        } finally {
            setLoading(false);
            onClose();
        }
    };

    useEffect(() => {
        // Initialize Summernote
        $("#summernote").summernote({
            height: 300,
            placeholder: "Nhập nội dung bài viết...",
            callbacks: {
                onChange: function(contents: string) {
                    setContent(contents); // Update content state when changed
                }
            }
        });

        // Destroy Summernote on component unmount
        return () => {
            $("#summernote").summernote("destroy");
        };
    }, []);

    return (
        <div>
            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <Spinner />
                </div>
            )}
            <div className="flex justify-between items-center">
                <div className="h-[62px]">
                    <BreadcrumbNav
                        items={[
                            { name: 'Trang chủ', link: '/' },
                            { name: 'Bài viết', link: '#' },
                        ]}
                    />
                </div>
                <div>
                    <Button color="primary" onClick={handleOpenAddBrandModal}>
                        Viết bài mới
                    </Button>
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
                                    <ModalHeader>Thêm bài viết mới</ModalHeader>
                                    <ModalBody>
                                        {/* Form viết blog */}
                                        <Input 
                                            fullWidth 
                                            label="Tiêu đề" 
                                            placeholder="Nhập tiêu đề bài viết..." 
                                            value={title} 
                                            onChange={(e) => setTitle(e.target.value)} 
                                        />
                                        <div className="mt-4">
                                            <label>Nội dung bài viết</label>
                                            <textarea id="summernote" name="editordata"></textarea>
                                        </div>
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="danger" onPress={onClose}>
                                            Đóng
                                        </Button>
                                        <Button 
                                            color="primary" 
                                            onPress={() => handleSubmit(onClose)} 
                                            disabled={loading || !title || !content}
                                        >
                                            {loading ? 'Processing...' : 'Lưu bài viết'}
                                        </Button>
                                    </ModalFooter>
                                </>
                            )}
                        </ModalContent>
                    </Modal>
                </div>
            </div>

            <div className="flex items-center justify-between mb-4">
                {/* Hiển thị nội dung của Summernote */}
                <h3>Nội dung bài viết:</h3>
                <div dangerouslySetInnerHTML={{ __html: content }}></div>
            </div>
        </div>
    );
}

export default BodyBlog;
