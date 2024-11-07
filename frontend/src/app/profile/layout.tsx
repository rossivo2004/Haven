'use client'
import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import {Spinner} from "@nextui-org/react";
import Profile_SideMenu from '@/src/components/ProfileSideMenu/Profile_SideMenu';
import { hiddenMenuPaths } from '@/src/utils';


const Layout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname(); 
  const [isMobile, setIsMobile] = useState<boolean | null>(null);




  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 640);
    };

    checkScreenSize(); 
    window.addEventListener('resize', checkScreenSize); 

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  if (isMobile === null) {
    // return <div className='w-full h-screen flex items-center justify-center'><Spinner /></div>; 
  }

  if (isMobile) {
    if (pathname === '/profile') {
      return (
        <div className="max-w-screen-xl lg:my-10 md:my-10 my-2 mb-6 mx-auto px-4 h-auto">
          <Profile_SideMenu />
        </div>
      );
    }

    if (hiddenMenuPaths.includes(pathname)) {
      return (
        <div className="max-w-screen-xl lg:my-10 md:my-10 my-2 mb-6 mx-auto px-4 h-auto flex gap-4 w-full">
          <main className="flex-1">
            {children}
          </main>
        </div>
      );
    }
  }

  return (
    <div className="max-w-screen-xl lg:my-10 md:my-10 my-2 mb-6 mx-auto px-4 h-auto flex gap-4 w-full">
      <Profile_SideMenu />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default Layout;