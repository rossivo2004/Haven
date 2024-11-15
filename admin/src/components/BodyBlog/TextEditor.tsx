'use client';
import { useState } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { Button, Input } from "@nextui-org/react";
import axios from 'axios';
import apiConfig from "@/configs/api";
import { toast } from "react-toastify";

// Sử dụng dynamic import để load React Quill chỉ trên client side
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });



function CreatePostForm() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Title:", title);
        console.log("Content:", content);

        try {
            const response = await axios.post(apiConfig.post.createPost, {
                title,
                content,
            });
            toast.success("Bài viết đã được lưu thành công!");
            console.log('Post saved:', response.data);
        } catch (error) {
            console.error('Error saving post:', error);
        }
    };

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
    

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Tiêu đề:</label>
                <Input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Nhập tiêu đề bài viết"
                    fullWidth
                />
            </div>

            <div className="my-4">
                <label>Nội dung:</label>
                <ReactQuill value={content} onChange={setContent} modules={modules} placeholder="Nhập nội dung bài viết..." />
            </div>

            <Button type="submit" color="primary">Đăng bài</Button>
        </form>
    );
}

export default CreatePostForm;
