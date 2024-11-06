'use client'
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar, User } from "@nextui-org/react";
import { Badge, Switch } from "@nextui-org/react";
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useState } from "react";

const Header: React.FC = () => {
  const [isInvisible, setIsInvisible] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-10 bg-[#fafafa] dark:bg-[#0F172A] p-2 flex items-center justify-between h-16 pr-14 lg:pr-4 md:pr-4">
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
                  <p className="font-semibold">zoey@example.com</p>
                </DropdownItem>
                <DropdownItem key="settings">
                  My Settings
                </DropdownItem>
                <DropdownItem key="team_settings">Team Settings</DropdownItem>
                <DropdownItem key="analytics">
                  Analytics
                </DropdownItem>
                <DropdownItem key="system">System</DropdownItem>
                <DropdownItem key="configurations">Configurations</DropdownItem>
                <DropdownItem key="help_and_feedback">
                  Help & Feedback
                </DropdownItem>
                <DropdownItem key="logout" color="danger">
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <div className="hidden md:flex items-center text-sm md:text-md text-black dark:text-white">
          John Doe
        </div>
      </div>
    </header>
  );
};

export default Header;
