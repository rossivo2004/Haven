'use client';

import React from 'react';
import BreadcrumbNav from '@/components/Breadcrumb/Breadcrumb';
import BodyDashboard from '@/components/BodyDashboard';

const Home: React.FC = () => {
  return (
    <div className="">
      {/* <div className="py-5 h-[62px]">
        <BreadcrumbNav
          items={[
            { name: 'Trang chủ', link: '/' },
          ]}
        />
      </div> */}
      <BodyDashboard />
    </div>
  );
};

export default Home;
