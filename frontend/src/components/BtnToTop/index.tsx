'use client';
import { useState, useEffect } from 'react';
import VerticalAlignTopIcon from '@mui/icons-material/VerticalAlignTop';
import './style.scss';

function BtnToTop() {
    const [isVisible, setIsVisible] = useState(false);
    const [isSliding, setIsSliding] = useState(false); 

    // Hàm cuộn lên đầu trang
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth', 
        });
    };

    // Kiểm tra vị trí cuộn
    const toggleVisibility = () => {
        if (window.scrollY > 300) {
            if (!isVisible) {
                setIsVisible(true);
                setTimeout(() => setIsSliding(true), 0); // Trượt lên
            }
        } else {
            if (isVisible) {
                setIsSliding(false); // Trượt xuống
                setTimeout(() => setIsVisible(false), 300); // Thời gian khớp với CSS
            }
        }
    };

    // Lắng nghe sự kiện cuộn
    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, [isVisible]);

    return (
        <div className="fixed lg:bottom-10 lg:right-10 bottom-20 right-6 z-50">
            <button
                onClick={scrollToTop}
                className={`btn-to-top w-14 h-14 rounded-full bg-black text-white hover:bg-gray-700 transition-all duration-300 transform ${isSliding ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
            >
                <VerticalAlignTopIcon />
            </button>
        </div>
    );
}

export default BtnToTop;
