'use client'

import apiConfig from "@/src/config/api";

import axios from "axios";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import BreadcrumbNav from "../Breadcrum";
import Loading from "../ui/Loading";



interface Post {

    content: string;

    created_at: string;

    id: number | string;

    id_user: number | null;

    image: string | null;

    title: string;
    updated_at: string;

}


function BodyBlogDetail() {

    const { id } = useParams<{ id: string }>();

    const [blog, setBlog] =  useState<Post | null>(null);

    const [loading, setLoading] = useState<boolean>(true); // {{ edit_1 }}

    useEffect(() => {

        const fetchBlog = async () => {

          try {

            const response = await axios.get(`${apiConfig.post.getPostById}${id}`);

            setBlog(response.data.post);

          } catch (error) {

            console.error('Error fetching blog:', error);

          } finally {

            setLoading(false); // {{ edit_2 }}

          }

        }

        fetchBlog();

    }, [id]);


    if (loading) { // {{ edit_3 }}

        return <div className="flex justify-center items-center h-screen"><Loading /></div>; // {{ edit_4 }}

    }

    console.log(blog);

    

    return ( 

        <div className="max-w-screen-xl lg:mx-auto mx-4 px-4">

            <div className="py-5 h-[62px]">

                <BreadcrumbNav

                    items={[

                        { name: 'Trang chủ', link: '/' },

                        { name: 'Bài viết', link: '/blog' },

                        { name: blog?.title || "", link: "#", },

                    ]}

                />

            </div>

            <div>

                <h1 className="text-2xl font-bold">{blog?.title}</h1>

                <p className="text-gray-500 text-sm mb-6">Xuất bản:  {new Date(blog?.created_at || '').toLocaleString('en-GB')}</p>

                <div className="">

                <p dangerouslySetInnerHTML={{ __html: blog?.content || '' }} />

                </div>
            </div>

        </div>

     );
}


export default BodyBlogDetail;
