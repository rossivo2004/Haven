'use client';

import dynamic from 'next/dynamic';

// Sử dụng dynamic import để chỉ load BodyBlog client-side
const BodyBlog = dynamic(() => import('@/components/BodyBlog'), {
  ssr: false, // Tắt SSR để component chỉ chạy trên client
});

function Page() {
    return ( 
        <div>
            <BodyBlog />
        </div>
     );
}

export default Page;
