'use client'
import apiConfig from "@/src/config/api";
import axios from "axios";
import Cookies from "js-cookie";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FavouriteItem } from "@/src/interface";
import Link from "next/link";
import FavoriteIcon from '@mui/icons-material/Favorite';
import { toast } from "react-toastify";
import { Spinner } from "@nextui-org/react";
import Loading from "../ui/Loading";
import { fetchUserProfile } from "@/src/config/token";

function ProfileFavourite() {
    const [userId, setUserId] = useState<string | null>(null); 
    const [favourite, setFavourite] = useState<FavouriteItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const getUserId = async () => {
            try {
                const userProfile = await fetchUserProfile(); // Fetch user profile using token
                setUserId(userProfile.id); // Set user ID from the fetched profile
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };

        getUserId(); // Call the function to get user ID
    }, []);

    const getFavourite = async () => {
        if (!userId) return; // Ensure userId is not null before making the API call
        setLoading(true);
        try {
            const res = await axios.get(`${apiConfig.favourite.getFavouriteById}${userId}`);
            setFavourite(res.data);
            // Check if no favorites and do not show error
            if (res.data.length === 0) {
                return; // No favorites, exit without error
            }
        } catch (error) {
            console.error('Error fetching favorites:', error);
            toast.error('Có lỗi xảy ra khi lấy danh sách yêu thích.'); // Notify error
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getFavourite();
    }, [userId]);

    // console.log(favourite)

    const handleAddToFavorites = async (productVariantId: number) => {
        
        if (!userId) {
            toast.error('Bạn cần đăng nhập để thêm sản phẩm vào yêu thích.');
            return;
        }

        const body = {
            user_id: parseInt(userId), // Parse user ID
            product_variant_id: productVariantId,
        };

        try {
                setLoading(true)
                // If already favorited, remove from favorites
                const response = await axios.post(`${apiConfig.favourite.acitonFavourite}`, body, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true, // Ensure cookies are sent
                });
                if (response.status === 204) {
                    toast.success('Sản phẩm đã được bỏ yêu thích!'); // Thông báo khi bỏ yêu thích
                    getFavourite() // Gọi lại danh sách yêu thích
                } else {
                    setLoading(false)
                }
        } catch (error: any) {
            console.error('Error updating favorites:', error);
            if (error.response) {
                console.error('Response data:', error.response.data);
                toast.error('Có lỗi xảy ra khi cập nhật yêu thích.'); // Thông báo lỗi
            }
        }
    };

    // console.log(userId)

    return (
        <div>
            <div className="text-2xl font-bold mb-4 dark:text-white">Danh sách yêu thích</div>
            <div className="grid grid-cols-3 gap-4 relative">
                {loading && (
                    <div className="flex justify-center items-center h-full col-span-3 top-[160px] relative">
                        <Loading />
                    </div>
                )}
                {!loading && favourite.length === 0 && (
                    <div className="text-center text-lg font-semibold dark:text-white col-span-3 py-20">
                        Không có sản phẩm yêu thích
                    </div>
                )}
                {!loading && favourite.map((item) => (
                    <div className="w-full h-auto px-2 lg:h-[360px] flex flex-col group mb-2 pb-3 rounded-lg re z-0" key={item.id}>
                        <Link href={`/product/${item.id}`}>
                            <div className="w-full h-[140px] object-cover lg:h-[240px] flex items-center justify-center overflow-hidden rounded-lg">
                                <Image
                                    loading="lazy"
                                    src={item.image}
                                    alt={item.name}
                                    width={500}
                                    height={500}
                                    className="w-full lg:h-[260px] h-full object-contain group-hover:scale-110 transition-all"
                                />
                            </div>
                        </Link>
                        <div className="w-full h-auto flex flex-col justify-between mt-4">
                            <div className="dark:text-white font-semibold lg:text-[22px] lg:h-[52px] text-base text-start group-hover:text-main mb-1 overflow-hidden text-ellipsis">
                                <span className="line-clamp-2 h-[inherit]">
                                    <Link href={`/product/${item.id}`}>
                                        {item.name}
                                    </Link>
                                </span>
                            </div>

                            <div className="flex items-center justify-between gap-5 mb-2 lg:h-10 h-auto">
                                <div className="font-bold lg:text-[28px] text-base text-red-600 flex-nowrap">
                                    {(item.DiscountedPrice < item.FlashSalePrice ? item.DiscountedPrice : item.FlashSalePrice).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })} <span className="underline"></span>
                                </div>
                                <div className="relative z-20">
                                    <FavoriteIcon className="text-red-600 cursor-pointer w-6 h-6" onClick={() => handleAddToFavorites(item.id)} />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProfileFavourite;