'use client'
import Image from "next/image";
import { formatVND } from "@/src/utils";
import Link from "next/link";
import { ProductProps } from "@/src/interface";

function BoxProduct({ product }: { product: ProductProps }) {
    const {id, name, price, discount, images } = product;
    const discountedPrice = price * (1 - discount / 100);

    return (
        <Link href={`/product/${id}`}>
        <div className="w-full h-auto lg:h-[380px] flex flex-col group">
            <div className="w-full h-[140px] object-cover lg:h-[250px] flex items-center justify-center overflow-hidden rounded-lg">
                <img
                    src={images[0]}
                    alt="Product as"
                    className="w-full h-full object-cover group-hover:scale-110 transition-all"
                />
            </div>
            <div className="w-full lg:h-[110px] h-auto flex flex-col justify-between mt-4">
                <div className="font-semibold lg:text-xl text-base text-start group-hover:text-main">
                    {name}
                </div>
                <div className="flex justify-between items-center gap-2">
                    <div className="font-bold lg:text-[18px] text-base text-red-600 flex-nowrap">
                    {formatVND(parseFloat(discountedPrice.toFixed(0)))} <span className="underline"></span>
                    </div>
                    {discount > 0 && ( 
                        <div className="lg:text-right text-left">
                            <div className="font-normal lg:text-sm text-[8px] text-[#666666] line-through">
                                {formatVND(price)} <span></span>
                            </div>
                            <div className="font-semibold lg:text-sm text-[8px] text-red-600">
                                Khuyến mãi <span>{discount}%</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
        </Link>
    );
}

export default BoxProduct;
