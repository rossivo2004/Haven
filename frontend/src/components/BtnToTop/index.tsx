'use client';
import { useState, useEffect } from 'react';
import VerticalAlignTopIcon from '@mui/icons-material/VerticalAlignTop';
import './style.scss';

function BtnToTop() {
    const [isVisible, setIsVisible] = useState(false);
    const [isSliding, setIsSliding] = useState(false); // Trạng thái trượt

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
            if (!isVisible) {
                setIsVisible(true);
                setTimeout(() => setIsSliding(true), 0); // Bắt đầu trượt lên
            }
        } else {
            if (isVisible) {
                setIsSliding(false); // Bắt đầu trượt xuống
                setTimeout(() => setIsVisible(false), 300); // Thời gian trượt (phải khớp với thời gian CSS)
            }
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);

        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, [isVisible]);

    return (
        <div className="fixed lg:bottom-10 lg:right-10 bottom-20 right-6 z-50">
            {isVisible && (
                <button
                    onClick={scrollToTop}
                    className={`btn-to-top w-14 h-14 rounded-full bg-black text-white hover:bg-gray-700 transition-all duration-300 transform ${isSliding ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
                >
                    <VerticalAlignTopIcon />
                </button>
            )}
        </div>
    );
}

export default BtnToTop;
