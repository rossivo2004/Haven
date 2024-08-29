import Image from "next/image";
import { formatVND } from "@/src/utils";
import Link from "next/link";
import { ProductProps } from "@/src/interface";

function BoxProduct({ product }: { product: ProductProps }) {
    const {id, name, price, discount, image } = product;
    const discountedPrice = price * (1 - discount / 100);

    return (
        <Link href={`/productDetails/${id}`}>
        <div className="w-full h-auto lg:h-[422px] flex flex-col">
            <div className="w-full h-[250px] flex items-center justify-center overflow-hidden">
                <Image
                    src={image}
                    layout="intrinsic"
                    width={250}
                    height={250}
                    objectFit="contain"
                    alt="Product Image"
                />
            </div>
            <div className="w-full lg:h-[122px] h-auto flex flex-col justify-between mt-4">
                <div className="font-semibold lg:text-xl text-base text-start">
                    {name}
                </div>
                <div className="flex justify-between items-center mt-4 gap-2">
                    <div className="font-bold lg:text-[22px] text-base text-red-600 flex-nowrap">
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
