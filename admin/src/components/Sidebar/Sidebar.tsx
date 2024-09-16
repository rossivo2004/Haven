// components/Sidebar/Sidebar.tsx
'use client';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import DehazeIcon from '@mui/icons-material/Dehaze';
import HomeIcon from '@mui/icons-material/Home';
import CategoryIcon from '@mui/icons-material/Category';
import WidgetsIcon from '@mui/icons-material/Widgets';
import PeopleIcon from '@mui/icons-material/People';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import DiscountIcon from '@mui/icons-material/Discount';
import BrandingWatermarkIcon from '@mui/icons-material/BrandingWatermark';
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname(); // Get current path from router

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      {/* Sidebar for desktop */}
      <aside
        ref={sidebarRef}
        className={`fixed z-50 h-screen inset-y-0 left-0 top-0 w-64 bg-gray-800 text-white transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 md:translate-x-0`}
      >
        <div className="p-4">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <nav className="mt-6">
            <ul>
              <li>
                <Link href="/">
                  <div className={`py-2 px-4 hover:bg-gray-700 rounded-lg mb-2 flex items-center ${pathname === '/' ? 'sidebar_active' : ''}`}>
                    <HomeIcon className="mr-2" /> Trang chủ
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/products">
                  <div className={`py-2 px-4 hover:bg-gray-700 rounded-lg mb-2 flex items-center ${pathname === '/products' ? 'sidebar_active' : ''}`}>
                    <WidgetsIcon className="mr-2" /> Sản phẩm
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/categories">
                  <div className={`py-2 px-4 hover:bg-gray-700 rounded-lg mb-2 flex items-center ${pathname === '/categories' ? 'sidebar_active' : ''}`}>
                    <CategoryIcon className="mr-2" /> Phân loại
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/users">
                  <div className={`py-2 px-4 hover:bg-gray-700 rounded-lg mb-2 flex items-center ${pathname === '/users' ? 'sidebar_active' : ''}`}>
                    <PeopleIcon className="mr-2" /> Users
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/orders">
                  <div className={`py-2 px-4 hover:bg-gray-700 rounded-lg mb-2 flex items-center ${pathname === '/orders' ? 'sidebar_active' : ''}`}>
                    <LocalShippingIcon className="mr-2" /> Đơn hàng
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/brand">
                  <div className={`py-2 px-4 hover:bg-gray-700 rounded-lg mb-2 flex items-center ${pathname === '/brand' ? 'sidebar_active' : ''}`}>
                    <BrandingWatermarkIcon className="mr-2" /> Thương hiệu
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/banner">
                  <div className={`py-2 px-4 hover:bg-gray-700 rounded-lg mb-2 flex items-center ${pathname === '/banner' ? 'sidebar_active' : ''}`}>
                    <ViewCarouselIcon className="mr-2" /> Banner
                  </div>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)} // Close sidebar when clicking on the overlay
        ></div>
      )}

      {/* Toggle button */}
      <button className="fixed top-4 right-4 text-black z-30 md:hidden" onClick={() => setIsOpen(!isOpen)}>
        <DehazeIcon />
      </button>
    </>
  );
}

export default Sidebar;
