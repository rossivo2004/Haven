'use client';
import React, { useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Import the carousel styles
import './style.css';
import {Spinner} from "@nextui-org/react";

interface ImageSwiperProps {
    imgDemo: string[]; // Assure this is an array of strings
}

const ImageSwiper: React.FC<ImageSwiperProps> = ({ imgDemo }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    if (!imgDemo || imgDemo.length === 0) {
        return <div className='w-full h-full flex items-center justify-center'><Spinner/></div>;
    }

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
                    <img src={image} alt={`Slide ${index + 1}`} className='rounded-lg !object-contain'/>
                </div>
            ))}
        </Carousel>
    );
};

export default ImageSwiper;
