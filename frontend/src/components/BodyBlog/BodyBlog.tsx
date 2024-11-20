"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Post } from "@/src/interface";
import axios from "axios";
import apiConfig from "@/src/config/api";
import Link from "next/link";

function BodyBlog() {
	const [popularPosts, setPopularPosts] = useState<Post[]>([]);
	const [post, setPosts] = useState<Post[]>([]);
	const [recentPosts, setRecentPosts] = useState<Post | null>(null);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		const fetchPopularPosts = async () => {
			const response = await axios.get(`${apiConfig.post.popularPosts}`);
			setPopularPosts(response.data.posts);
		};
		fetchPopularPosts();

		const fetchRecentPosts = async () => {
			const response = await axios.get(`${apiConfig.post.recentPosts}`);
			setRecentPosts(response.data.posts[0]);
		};
		fetchRecentPosts();

		const fetchPosts = async () => {
			const response = await axios.get(`${apiConfig.post.getAll}`);
			setPosts(response.data.posts);
		};
		fetchPosts();
	}, []);

	useEffect(() => {
		setMounted(true);
	}, []);

	// const cards = [
	// 	{
	// 		id: 1,
	// 		image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9PV8gKpdTDxJTUh0qcCDmteFZlKn6ecaY6Q&s",
	// 		title: "CÁC TIÊU CHÍ LỰA CHỌN BẢO NGỮ AN TOÀN",
	// 		description: "Đây giao Việt Nam lứt tử đặt các vị vớt đông hoặc vật phẩm, cứ á huơu ắn động truyển thống gni mhao là đ...",
	// 	},
	// 	{
	// 		id: 2,
	// 		image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIJwyTAMbGOYfhuoc8l8i3jp6y2mvv4MII7lrrLbR36Q2jQX91o8QFRx9NOtE-T_8QQyM&usqp=CAU",
	// 		title: "VIET INTER HỢP TÁC CÙNG CHUỖI CỬA HÀNG THỰC PHẨM UY TÍN HÀ HIỆN CUNG...",
	// 		description: "VIET INTER HỢP TÁC CÙNG CHUỖI CỬA HÀNG THỰC PHẨM UY TÍN HÀ HIỆN CUNG CẤP THỊT SẠCH NHẬP KHẨU HÀNG ĐẦU THỊ G...",
	// 	},
	// 	{
	// 		id: 3,
	// 		image: "https://ogaly.com.vn/wp-content/uploads/2022/06/bi-quyet-tiet-kiem-thoi-gian-vao-bep-1.jpg",
	// 		title: "THỊT SẠCH TRUST FARM ĐÃ LÊN KỆ TẠI CÁC CỬA HÀNG THUỘC HỆ THỐNG SIÊU THỊ GS25",
	// 		description: "THỊT SẠCH TRUST FARM ĐÃ LÊN KỆ TẠI CÁC CỬA HÀNG THUỘC HỆ THỐNG SIÊU THỊ GS25 Trải nghiệm bà ngoại của ngài...",
	// 	},
	// 	{
	// 		id: 4,
	// 		image: "https://ogaly.com.vn/wp-content/uploads/2022/06/bi-quyet-tiet-kiem-thoi-gian-vao-bep-1.jpg",
	// 		title: "THỊT SẠCH TRUST FARM ĐÃ LÊN KỆ TẠI CÁC CỬA HÀNG THUỘC HỆ THỐNG SIÊU THỊ GS25",
	// 		description: "THỊT SẠCH TRUST FARM ĐÃ LÊN KỆ TẠI CÁC CỬA HÀNG THUỘC HỆ THỐNG SIÊU THỊ GS25 Trải nghiệm bà ngoại của ngài...",
	// 	},
	// ];

	if (!mounted) return null;
	return (
		<div className="container mx-auto my-8 px-4">
			{/* Tin mới nhất */}
			<h2 className="text-3xl font-bold mb-6">TIN MỚI NHẤT</h2>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
				{recentPosts && (
					<>
						<div>
							<img
						src={recentPosts.content.match(/<img src="([^"]+)"/)?.[1]}
						alt={recentPosts.title}
						className="w-full h-auto"
					/>
				</div>
				<div className="flex flex-col justify-center">
					<h3 className="text-xl font-bold mb-4">{recentPosts.title}</h3>
					<p className="text-sm text-gray-600">{recentPosts.description}</p>
					<Link href={`/blog/${recentPosts.id}`} className="self-start hover:underline underline">Xem Thêm</Link>
						</div>
					</>
				)}
			</div>

			<h3 className="text-2xl font-bold mb-4">Tin Xem Nhiều Nhất</h3>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
			{popularPosts.slice(0, 3).map((item, index) => (
					<div key={index}>
						<div className="p-0">
							<img src={item.content.match(/<img src="([^"]+)"/)?.[1]} alt={item.title} className="w-full h-48 object-cover" />
						</div>
						<div>
							<h4 className="font-bold mb-2">{item.title}</h4>
							<p className="text-sm text-gray-600">
								Đảm bảo vệ sinh an toàn vệ sinh thực phẩm là một trong những ưu tiên hàng đầu của các cơ sở sản xuất, chế biến thực
								phẩm...
							</p>
						</div>
						<div>
							<Link href={`/blog/${item.id}`} className="text-blue-500 text-sm mt-2 inline-block">
								XEM THÊM &gt;
							</Link>
						</div>
					</div>
				))}
			</div>

			{/* Feature News Carousel */}

			{/* <div className="bg-gray-800">
				<Swiper
					modules={[Navigation, Pagination, Autoplay]}
					spaceBetween={30}
					slidesPerView={1}
					navigation
					pagination={{ clickable: true }}
					autoplay={{ delay: 3000 }}
					breakpoints={{
						640: {
							slidesPerView: 2,
						},
						768: {
							slidesPerView: 3,
						},
					}}
					className="mySwiper ">
					{cards.map((card) => (
						<SwiperSlide key={card.id}>
							<div className="bg-gray-800 p-6 rounded-lg">
								<img src={card.image} alt={card.title} className="w-full h-48 object-cover" />
								<div className="p-4">
									<h3 className="text-lg font-semibold mb-2">{card.title}</h3>
									<p className="text-sm text-gray-600">{card.description}</p>
									<a href="#" className="text-blue-500 text-sm mt-2 inline-block">
										XEM THÊM &gt;
									</a>
								</div>
							</div>
						</SwiperSlide>
					))}
				</Swiper>
			</div> */}
			{/*  Các tin khác */}

			<h3 className="text-2xl font-bold mb-4">Các tin khác</h3>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
				{post.map((item, index) => (
					<div key={index}>
						<div className="p-0">
							<img src={item.content.match(/<img src="([^"]+)"/)?.[1]} alt={item.title} className="w-full h-48 object-cover" />
						</div>
						<div>
							<h4 className="font-bold mb-2">{item.title}</h4>
							<p className="text-sm text-gray-600">
								Đảm bảo vệ sinh an toàn vệ sinh thực phẩm là một trong những ưu tiên hàng đầu của các cơ sở sản xuất, chế biến thực
								phẩm...
							</p>
						</div>
						<div>
							<Link href={`/blog/${item.id}`} className="text-blue-500 text-sm mt-2 inline-block">
								XEM THÊM &gt;
							</Link>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export default BodyBlog;
