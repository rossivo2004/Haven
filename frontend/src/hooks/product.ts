// src/hooks/useProducts.ts
import { useMemo } from 'react';
import { DUMP_PRODUCTS } from '@/src/dump';
import { Product, SingleProduct } from '@/src/interface';

export const useProducts = () => {
    const flattenProducts = (products: Product[]): SingleProduct[] => {
        return products.flatMap(product =>
            product.variants.map(variant => ({
                id: variant.id,
                name: `${product.name} (${variant.name})`,
                nameva: variant.name,
                category: product.category,
                brand: product.brand,
                price: variant.price,
                discount: variant.discount,
                stock: variant.stock,
                view: variant.view,
                images: variant.images,
                variants: product.variants // Change this to variants
            }))
        );
    };
    

    // Flatten the products and return the data directly
    const flatProducts = useMemo(() => flattenProducts(DUMP_PRODUCTS), []);

    return { flatProducts };
};
