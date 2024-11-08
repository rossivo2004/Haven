'use client';
import Image from "next/image";
import { formatVND } from "@/src/utils";
import Link from "next/link";
import { Product, SingleProduct, Variant } from "@/src/interface";
import { useDispatch } from 'react-redux';
import { addProduct } from "@/src/store/recentlyViewedSlice";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { Langar } from "next/font/google";
import { useParams } from 'react-router-dom';

function BoxProduct({ product }: { product: Variant }) {
    const router = useRouter();
    const { id, name, stock, image } = product;
    const dispatch = useDispatch();
    const params = useParams(); 

    // Validate variants
    // const firstVariant = Array.isArray(variants) && variants.length > 0 
    //     ? variants[0] 
    //     : { price: 0, discount: 0, images: ['/path/to/fallback/image.jpg'] };

    const getLowerPrice = (discountedPrice: string | undefined, flashSalePrice: string | undefined): string => {
        const discounted = parseFloat(discountedPrice || "0");
        const flashSale = parseFloat(flashSalePrice || "0");
        return Math.min(discounted, flashSale).toLocaleString('vi-VN');
    };

    console.log(product);

    return (
        <Link href={`   /product/${id}`} >
            <div className="w-full h-auto lg:h-[420px] flex flex-col group mb-2 pb-3 rounded-lg">
                <div className="w-full h-[140px] bg-[#f2f2f1] object-cover lg:h-[240px] flex items-center justify-center overflow-hidden rounded-lg">
                    <Image
                    loading="lazy"
                        src={image}
                        alt={name}
                        width={500}
                        height={500}
                        className="w-full lg:h-[260px] h-full object-cover group-hover:scale-110 transition-all"
                        
                    />
                </div>
                <div className="w-full h-auto flex flex-col justify-between mt-4">
                    <div className="dark:text-white font-semibold lg:text-[22px] lg:h-[52px] text-base text-start group-hover:text-main mb-1 overflow-hidden text-ellipsis">
                        <span className="line-clamp-2 h-[inherit]">
                            {name}
                        </span>
                    </div>

                    <div className="flex items-center gap-5 mb-2 lg:h-10 h-auto">
                        <div className="font-bold lg:text-[28px] text-base text-red-600 flex-nowrap">
                        {getLowerPrice(product?.DiscountedPrice?.toString(), product?.FlashSalePrice?.toString())} <span className="underline"></span>
                        </div>
                        {product.flash_sales.length > 0 ? ( // Check if there are flash sales
    <div className="text-left">
        <div className="font-normal lg:text-sm text-[8px] text-[#666666] line-through">
            {formatVND(Math.floor(product.price))} <span></span>
        </div>
        <div className="font-semibold lg:text-sm text-[8px] text-red-600">
            Khuyến mãi <span>{product.flash_sales[0].pivot.discount_percent}%</span> {/* Show discount from flash sale */}
        </div>
    </div>
) : ( // For non-flash sale products
    product.discount > 0 && (
        <div className="text-left">
            <div className="font-normal lg:text-sm text-[8px] text-[#666666] line-through">
                {formatVND(Math.floor(product.price))} <span></span>
            </div>
            <div className="font-semibold lg:text-sm text-[8px] text-red-600">
                Khuyến mãi <span>{product.discount}%</span>
            </div>
        </div>
    )
)}
                    </div>

                    <div className="flex gap-2 dark:text-white">
                        <span className="flex p-[2px] lg:text-sm text-xs lg:py-[2px] lg:px-1 items-center justify-center w-fit rounded-lg border border-gray-400">{product.product?.category.tag}</span>
                        <span className="flex p-[2px] lg:text-sm text-xs lg:py-[2px] lg:px-1 items-center justify-center w-fit rounded-lg border border-gray-400">{product.product?.brand.tag}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default BoxProduct;
