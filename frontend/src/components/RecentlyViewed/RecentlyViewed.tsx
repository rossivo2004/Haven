// // components/RecentlyViewed.tsx
// import { useSelector } from 'react-redux';
// import { RootState } from '@/src/store/store';
// import BoxProduct from '../BoxProduct';

// const RecentlyViewed = () => {
//     const recentlyViewedProducts = useSelector((state: RootState) => state.recentlyViewed.products);

//     return (
//         <div>
//             <div className="lg:grid md:grid grid lg:grid-cols-4 grid-cols-2 gap-4">
//                 {recentlyViewedProducts.map((product) => (
//                     <BoxProduct key={product.id} product={product} />

//                     //           <li key={product.id}>
//                     //             <img
//                     //     src={Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : "/default-image.jpg"}  // Kiểm tra mảng và fallback nếu không có hình ảnhalt={name}
//                     //     className="w-full h-full object-cover group-hover:scale-110 transition-all"
//                     // />

//                     //             <span>{product.name}</span>
//                     //           </li>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default RecentlyViewed;
