'use client';
import React, { useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Import the carousel styles
import './style.css'

interface ImageSwiperProps {
    imgDemo: string[];
}

const ImageSwiper: React.FC<ImageSwiperProps> = ({ imgDemo }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <Carousel 
            showArrows={true} 
            infiniteLoop 
            swipeable={true}
            emulateTouch={true}
            showStatus={false} 
            dynamicHeight={true}
            useKeyboardArrows={true}
            onChange={(index) => setActiveIndex(index)}
        >
            {imgDemo.map((image, index) => (
                <div 
                    key={index} 
                    className={`slide ${index === activeIndex ? 'active' : 'inactive'}`} // Apply classes based on active index
                >
                    <img src={image} alt={`Slide ${index + 1}`} />
                </div>
            ))}
        </Carousel>
    );
};

export default ImageSwiper;
