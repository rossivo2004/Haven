'use client'
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar, User } from "@nextui-org/react";
import { Badge, Switch } from "@nextui-org/react";
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useEffect, useState } from "react";
import { fetchUserProfile } from '@/configs/token';
import Cookies from 'js-cookie'; // Import js-cookie for cookie management

const Header: React.FC = () => {
  const [isInvisible, setIsInvisible] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const token = Cookies.get('access_token');

  const fetchUserProfileA = async () => {
    const profile = await fetchUserProfile();
    setUserProfile(profile);
  };

  useEffect(() => {
    fetchUserProfileA();
  }, []);

  console.log(userProfile);

  const handleLogout = () => {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    window.location.href = '/signin';
  };

  return (
    <header className="fixed top-0 left-0 w-full z-10 bg-[#f5f8ff] dark:bg-[#0F172A] p-2 flex items-center justify-between h-[90px] pr-14 lg:pr-4 md:pr-4">
      <div className="flex items-center">
        <div className="text-xl font-bold dark:text-white">NERVE</div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center gap-6">
          <div>
            <Badge color="danger" content={5} isInvisible={isInvisible} shape="circle">
              <NotificationsIcon className="fill-current" />
            </Badge>
          </div>
          <div className="">
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  isBordered
                  as="button"
                  className="transition-transform"
                  src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="profile" className="h-14 gap-2">
                  <p className="font-semibold">Signed in as</p>
                  <p className="font-semibold">{userProfile?.email}</p>
                </DropdownItem>
                <DropdownItem key="logout" color="danger" onClick={handleLogout}>
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        {/* <div className="hidden md:flex items-center text-sm md:text-md text-black dark:text-white">
          Admin
        </div> */}
      </div>
    </header>
  );
};

export default Header;
