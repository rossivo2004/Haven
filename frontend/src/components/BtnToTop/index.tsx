'use client'
import { useState, useEffect } from 'react';
import VerticalAlignTopIcon from '@mui/icons-material/VerticalAlignTop';

function BtnToTop() {
    const [isVisible, setIsVisible] = useState(false);

    // Hàm cuộn lên đầu trang
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth', // Cuộn mượt mà
        });
    };

    // Hàm kiểm tra vị trí cuộn và hiển thị nút
    const toggleVisibility = () => {
        if (window.scrollY > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);

        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    return (
        <div className="fixed lg:bottom-10 lg:right-10 bottom-20 right-6 z-50">
            {isVisible && (
                <button
                    onClick={scrollToTop}
                    className="btn-to-top w-14 h-14 rounded-full bg-black text-white hover:bg-gray-700 transition-all duration-300"
                >
                    <VerticalAlignTopIcon />
                </button>
            )}
        </div>
    );
}

export default BtnToTop;
