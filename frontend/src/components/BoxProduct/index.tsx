'use client';
import Image from "next/image";
import { formatVND } from "@/src/utils";
import Link from "next/link";
import { ProductProps } from "@/src/interface";
import { useDispatch } from 'react-redux';
import { addProduct } from "@/src/store/recentlyViewedSlice";




function BoxProduct({ product }: { product: ProductProps }) {
    const { id, name, price, discount, images } = product;
    const discountedPrice = price * (1 - discount / 100);

    const dispatch = useDispatch();

    // Khi người dùng xem sản phẩm, thêm sản phẩm đó vào danh sách đã xem
    const handleViewProduct = () => {
      dispatch(addProduct(product));
    };

    return (
        <Link href={`/product/${id}`} onClick={handleViewProduct}>
            <div className="w-full h-auto lg:h-[420px] flex flex-col group mb-2 px-2 pt-2 pb-3 rounded-lg">
                <div className="w-full h-[140px] object-cover lg:h-[240px] flex items-center justify-center overflow-hidden rounded-lg">
                    <img
                        // src={images[0]}
                        src="/images/sp1.png"
                        alt={name}
                        className="w-full lg:h-[260px] h-full object-cover group-hover:scale-110 transition-all flex items-center justify-center"
                    />
                </div>
                <div className="w-full h-auto flex flex-col justify-between mt-4">
                    <div className="font-semibold lg:text-[22px] lg:h-[56px] text-base text-start group-hover:text-main mb-1 overflow-hidden text-ellipsis">
                        <span className="line-clamp-2">
                            {name}
                        </span>
                    </div>

                    <div className="flex items-center gap-5 mb-2">
                        <div className="font-bold lg:text-[28px] text-base text-red-600 flex-nowrap">
                            {formatVND(parseFloat(discountedPrice.toFixed(0)))} <span className="underline"></span>
                        </div>
                        {discount > 0 && (
                            <div className="text-left">
                                <div className="font-normal lg:text-sm text-[8px] text-[#666666] line-through">
                                    {formatVND(price)} <span></span>
                                </div>
                                <div className="font-semibold lg:text-sm text-[8px] text-red-600">
                                    Khuyến mãi <span>{discount}%</span>
                                </div>
                            </div>
                        )}
                    </div>

                    

                    <div className="flex gap-2">
                        <span className="flex p-[2px] lg:text-sm text-xs lg:py-[2px] lg:px-1 items-center justify-center w-fit rounded-lg border     border-gray-400">Đồ khô</span>
                        <span className="flex p-[2px] lg:text-sm text-xs lg:py-[2px] lg:px-1 items-center justify-center w-fit rounded-lg border     border-gray-400">PepsiCO</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default BoxProduct;
