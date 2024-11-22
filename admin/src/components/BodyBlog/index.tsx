'use client';
import { useEffect, useState, useMemo } from "react";
import BreadcrumbNav from "../Breadcrumb/Breadcrumb";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Spinner, Input, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Tooltip } from "@nextui-org/react";
import axios from "axios";
import apiConfig from "@/configs/api";
import { Brand } from "@/interface";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import CreatePostForm from "./TextEditor";
import { EyeIcon } from "./EyeIcon";
import { EditIcon } from "./EditIcon";
import { DeleteIcon } from "./DeleteIcon";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

interface Post {
    content: string;
    created_at: string;
    id: number;
    id_user: number | null;
    image: string | null;
    title: string;
    updated_at: string;
    description: string ;
}

function BodyBlog() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [loading, setLoading] = useState(false);
    const [isAddBrandModalOpen, setIsAddBrandModalOpen] = useState(false);
    const [title, setTitle] = useState(""); // State for title
    const [content, setContent] = useState(""); // State for content
    const [titleEdit, setTitleEdit] = useState(""); // State for title
    const [contentEdit, setContentEdit] = useState(""); // State for content
    const [thumbnailEdit, setThumbnailEdit] = useState<File | null>(null); // State for thumbnail as a File
    const [descriptionEdit, setDescriptionEdit] = useState(""); // State for description
    const [editPost, setEditPost] = useState<Post | null>(null); // State for editing a post
    const [isAddPostModalOpen, setIsAddPostModalOpen] = useState(false); // State for Add Post Modal

    const [posts, setPosts] = useState<Post[]>([]);
    const [searchTerm, setSearchTerm] = useState(""); // State for search term
    const [currentPage, setCurrentPage] = useState<number>(1); // State for current page
    const productsPerPage = 10; // Number of posts per page

    

    const modules = {
        toolbar: [
            [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'color': [] }, { 'background': [] }],
            ['link', 'image'],
            ['clean']                                         
        ],
    };


    const fetchPosts = async () => {
        try {
            const response = await axios.get(apiConfig.post.getAll);
            setPosts(response.data.posts);
        } catch (error) {
            console.error("Error fetching posts:", error); // Log the error
            toast.error("Failed to fetch posts."); // Notify the user
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    console.log(posts);

    const handleOpenAddBrandModal = () => {
        setIsAddBrandModalOpen(true);
    };

    const handleCloseAddBrandModal = () => {
        setIsAddBrandModalOpen(false);
    };

    const handleEditPost = async (post: Post) => {
        setEditPost(post);
        setTitleEdit(post.title);
        setContentEdit(post.content);
        setDescriptionEdit(post.description);
    
        handleOpenAddBrandModal();
    };
    
    useEffect(() => {
        if (editPost) {
            // Check if running in the browser
            if (typeof window !== 'undefined') {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = editPost.content;
                const firstImage = tempDiv.querySelector('img')?.src; // Get the first image source
            }
        }
    }, [editPost]);
    

    const updatePost = async (id: number, updatedPost: { title: string; content: string; thumbnail: File | null; description: string }) => {
        try {
            await axios.put(`${apiConfig.post.updatePost}${id}`, updatedPost);
            toast.success("Post updated successfully!");
            fetchPosts(); // Refresh the posts after update
            handleCloseAddBrandModal(); // Close the modal after update
        } catch (error) {
            toast.error("Failed to update post.");
        }
    };

    const handleOpenAddPostModal = () => {
        setIsAddPostModalOpen(true);
    };

    const handleCloseAddPostModal = () => {
        setIsAddPostModalOpen(false);
    };

    const deletePost = (id: number) => {
        confirmAlert({
            title: 'Xóa bài viết',
            message: 'Bạn có chắc chắn muốn xóa bài viết này?',
            buttons: [
                {
                    label: 'Có',
                    onClick: async () => {
                        try {
                            await axios.delete(`${apiConfig.post.deletePost}${id}`); // Call the delete API
                            toast.success("Post deleted successfully!");
                            fetchPosts(); // Refresh the posts after deletion
                        } catch (error) {
                            toast.error("Failed to delete post.");
                        }
                    }
                },
                {
                    label: 'Không',
                }
            ]
        });
    };

    const filteredPosts = useMemo(() => {
        return posts.filter(item => 
            item.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [posts, searchTerm]);

    const postsToDisplay = useMemo(() => {
        const startIndex = (currentPage - 1) * productsPerPage;
        return filteredPosts.slice(startIndex, startIndex + productsPerPage);
    }, [filteredPosts, currentPage]);

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
<div className="flex gap-2">

                     <Input
                    className="mb-4"
                    placeholder="Tìm kiếm theo tiêu đề bài viết"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button className="bg-[#696bff] text-white font-medium !w-48" onClick={handleOpenAddPostModal}>
                        Viết bài mới
                    </Button>
</div>
                    <Modal
                        size="5xl"
                        scrollBehavior="inside"
                        isOpen={isAddPostModalOpen}
                        onOpenChange={handleCloseAddPostModal}
                        isDismissable={false}
                    >
                        <ModalContent>
                            {(onClose) => (
                                <>
                                    <ModalHeader>Thêm bài viết</ModalHeader>
                                    <ModalBody>
                                        <CreatePostForm />
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="danger" onPress={onClose}>
                                            Đóng
                                        </Button>
                                    </ModalFooter>
                                </>
                            )}
                        </ModalContent>
                    </Modal>
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
                                    <ModalHeader>Sửa bài viết</ModalHeader>
                                    <ModalBody>
                                        <form onSubmit={(e) => { 
                                            e.preventDefault(); 
                                            if (editPost) {
                                                updatePost(editPost.id, { title: titleEdit, content: contentEdit, thumbnail: thumbnailEdit, description: descriptionEdit }); // Call updatePost with the post ID and updated values
                                            }
                                        }}>
                                            <div>
                                                <label>Tiêu đề:</label>
                                                <Input
                                                    type="text"
                                                    value={titleEdit} // Use titleEdit instead of title
                                                    onChange={(e) => setTitleEdit(e.target.value)} // Update titleEdit
                                                    placeholder="Nhập tiêu đề bài viết"
                                                    fullWidth
                                                />
                                            </div>

                                            <div>
                                                <label>Mô tả:</label>
                                                <Input
                                                    type="text"
                                                    value={descriptionEdit}
                                                    onChange={(e) => setDescriptionEdit(e.target.value)}
                                                    placeholder="Nhập mô tả bài viết"
                                                    fullWidth
                                                />
                                            </div>

                                            <div className="my-4">
                                                <label>Nội dung:</label>
                                                <ReactQuill value={contentEdit} onChange={setContentEdit} modules={modules} placeholder="Nhập nội dung bài viết..." />
                                            </div>

                                          


                                            <Button type="submit" color="primary">Cập nhật bài</Button> 
                                        </form>
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="danger" onPress={onClose}>
                                            Đóng
                                        </Button>
                                    </ModalFooter>
                                </>
                            )}
                        </ModalContent>
                    </Modal>
                </div>
            </div>

            <div className="flex items-center justify-between mb-4">
               
                <Table aria-label="Example static collection table">
                    <TableHeader>
                        <TableColumn>STT</TableColumn>
                        <TableColumn><div className='flex justify-center w-full'>Tiêu đề</div></TableColumn>
                        <TableColumn><div className='flex justify-center w-full'>Ngày đặt</div></TableColumn>
                        <TableColumn><div className='flex justify-center w-full'>Thao tác</div></TableColumn>
                    </TableHeader>
                    <TableBody>
                        {postsToDisplay.map((item, ind) => (
                            <TableRow key={item.id}>
                                <TableCell><div className=''>{ind + 1}</div></TableCell>
                                <TableCell><div className='flex justify-center w-full'>{item.title}</div></TableCell>
                                <TableCell><div className='flex justify-center w-full'>{new Date(item.created_at).toLocaleDateString('en-GB')}</div></TableCell>
                                <TableCell>
                                    <div className="relative flex items-center gap-2 justify-center">
                                        <Tooltip content="Details">
                                            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                                <EyeIcon />
                                            </span>
                                        </Tooltip>
                                        <Tooltip content="Edit status">
                                            <span className="text-lg text-default-400 cursor-pointer active:opacity-50" onClick={() => handleEditPost(item)}>
                                                <EditIcon />
                                            </span>
                                        </Tooltip>
                                        <Tooltip color="danger" content="Delete post">
                                            <span className="text-lg text-danger cursor-pointer active:opacity-50" onClick={() => deletePost(item.id)}>
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
            <div className="flex justify-between items-center mt-4">
                <div className="text-sm">
                    {`${(currentPage - 1) * productsPerPage + 1} - ${Math.min(currentPage * productsPerPage, filteredPosts.length)} của ${filteredPosts.length} bài viết`}
                </div>
                <div className="flex gap-2">
                    {Array.from({ length: Math.ceil(filteredPosts.length / productsPerPage) }, (_, index) => (
                        <div
                            className='cursor-pointer w-10 h-10 flex items-center justify-center rounded-md text-white'
                            key={index + 1}
                            onClick={() => setCurrentPage(index + 1)}
                            style={{
                                backgroundColor: currentPage === index + 1 ? '#696bff' : 'transparent',
                                border: currentPage === index + 1 ? '2px solid #696bff' : '2px solid #696bff',
                                color: currentPage === index + 1 ? 'white' : '#696bff'
                            }}
                        >
                            {index + 1}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default BodyBlog;
