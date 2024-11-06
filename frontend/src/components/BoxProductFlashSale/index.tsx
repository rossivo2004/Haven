'use client';
import Image from "next/image";
import { formatVND } from "@/src/utils";
import Link from "next/link";
import { Product, SingleProduct, Variant } from "@/src/interface";
import { useDispatch } from 'react-redux';
import { addProduct } from "@/src/store/recentlyViewedSlice";
import {Progress} from "@nextui-org/progress";

function BoxProductFlashSale({ product }: { product: Variant }) {
    // const { id, name, category, brand, variants } = product;
    const dispatch = useDispatch();

    // // Validate variants
    // const firstVariant = Array.isArray(variants) && variants.length > 0 
    //     ? variants[0] 
    //     : { price: 0, discount: 0, images: ['/path/to/fallback/image.jpg'] };

    // const { price, discount } = firstVariant;
    // const discountedPrice =  product.price * (1 - product.discount / 100);


    // console.log(product.images);


    return (
        <Link href={`/product/${product.id}`} >
            <div className="w-full h-auto lg:h-[450px] flex flex-col group mb-2 pt-2 pb-3 rounded-lg">
                <div className="w-full h-[140px] bg-[#f2f2f1] object-cover lg:h-[240px] flex items-center justify-center overflow-hidden rounded-lg">
                    <Image
                    loading="lazy"
                        src={product.image }
                        alt={product.name}
                        width={500}
                        height={500}
                        className="w-full lg:h-[260px] h-full object-cover group-hover:scale-110 transition-all"
                        
                    />
                </div>
                <div className="w-full h-auto flex flex-col justify-between mt-4">
                    <div className="dark:text-white font-semibold lg:text-[22px] lg:h-[52px] text-base text-start group-hover:text-main mb-1 overflow-hidden text-ellipsis">
                        <span className="line-clamp-2 h-[inherit]">
                            {product.name}
                        </span>
                    </div>

                    <div className="flex items-center gap-5 mb-2 lg:h-10 h-auto">
                        <div className="font-bold lg:text-[28px] text-base text-red-600 flex-nowrap">
                        {formatVND(product.FlashSalePrice ?? 0)} <span className="underline"></span>
                        </div>
                        {product.flash_sales[0].pivot.discount_percent > 0 && (
                            <div className="text-left">
                                <div className="font-normal lg:text-sm text-[8px] text-[#666666] line-through">
                                    {formatVND(product.price)} <span></span>
                                </div>
                                <div className="font-semibold lg:text-sm text-[8px] text-red-600">
                                    Khuyến mãi <span>{product.flash_sales[0].pivot.discount_percent}%</span>
                                </div>
                                {/* <div className="font-semibold lg:text-sm text-[8px] text-red-600">
                                    Khuyến mãi <span>{(100 - (product.discount / product.price) * 100).toFixed(0)}%</span>
                                </div> */}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2 mb-2 dark:text-white">
                        <span className="flex p-[2px] lg:text-sm text-xs lg:py-[2px] lg:px-1 items-center justify-center w-fit rounded-lg border border-gray-400">{product.product?.category.name}</span>
                        <span className="flex p-[2px] lg:text-sm text-xs lg:py-[2px] lg:px-1 items-center justify-center w-fit rounded-lg border border-gray-400">{product.product?.brand.name}</span>
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Image src={'/images/flashsale.png'} width={30} height={30} alt="Flashsale"/>
                            <div className="dark:text-white">Còn <span className="font-semibold text-[#FFC535]">{product.flash_sales[0].pivot.stock}</span> sản phẩm</div>
                        </div>
                        <Progress aria-label="Loading..." value={(product.flash_sales[0].pivot.sold / product.flash_sales[0].pivot.stock) * 100} 
                         classNames={{
                            base: "max-w-md",
                            indicator: "bg-gradient-to-r from-pink-500 to-yellow-500",
                            label: "tracking-wider font-medium text-default-600",
                            value: "text-foreground/60",
                          }}
                        />
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default BoxProductFlashSale;
