'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation'
import { Avatar } from "@nextui-org/react";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import DiscountOutlinedIcon from '@mui/icons-material/DiscountOutlined';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import { hiddenMenuPaths } from '@/src/utils';
import Cookies from 'js-cookie';
import axios from 'axios';
import apiConfig from '@/src/config/api';
import { User } from '@/src/interface';
import { useEffect, useState } from 'react';


function Profile_SideMenu() {
    const pathname = usePathname()
    const userId = Cookies.get('user_id'); // Get user ID from cookies
    const [user, setUser] = useState<User | null>(null); 

    const fetchUser = async () => {
        try {
            const response = await axios.get(`${apiConfig.user.getUserById}${userId}`, { withCredentials: true });
            console.log('Fetched cart data:', response.data);
            if (response.data) {
                setUser(response.data);
            } else {
                console.warn('No cart items found in response');
            }
        } catch (error) {
            console.error('Error fetching user cart:', error);
        }
    };
    useEffect(() => {
    fetchUser();
  }, [userId]);


    return (
        <div>
          
            <aside className="lg:w-[320px] w-full">
                <nav>
                    <ul>
                        <li className="mb-6">
                            <div className='flex items-center gap-4'>
                                <div><Avatar src="https://i.pravatar.cc/150?u=a04258114e29026302d" size="lg" /></div>
                                <div className='flex flex-col'>
                                    <div className='text-base font-normal'>Tài khoản của</div>
                                    <div className='text-2xl font-medium'>{user?.name}</div>
                                </div>
                            </div>
                        </li>
                        <li className=" border-b border-black py-4">
                            <Link href={`${hiddenMenuPaths[0]}`}>
                                <div className={`flex items-center gap-4 ${pathname === `${hiddenMenuPaths[0]}` ? 'active_nav_profile' : ''}`}>
                                    <div><PersonOutlineOutlinedIcon /></div>
                                    <div>Thông tin tài khoản</div>
                                </div>
                            </Link>
                        </li>
                        <li className=" border-b border-black py-4">
                            <Link href={`${hiddenMenuPaths[3]}`}>
                                <div className={`flex items-center gap-4 ${pathname === `${hiddenMenuPaths[3]}`  ? 'active_nav_profile' : ''}`}>
                                    <div><DiscountOutlinedIcon /></div>
                                    <div>Quản lí đơn hàng</div>
                                </div>
                            </Link>
                        </li>
                    </ul>
                </nav>
            </aside>
        </div>
    );
}

export default Profile_SideMenu;