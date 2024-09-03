'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const Profile = () => {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState<boolean | null>(null); 

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreenSize(); 
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  useEffect(() => {
    if (isMobile === false) {
      router.replace('/profile/account');
    }
  }, [isMobile, router]);

  return (
    <div>
      <h1>Profile Page</h1>
    </div>
  );
};

export default Profile;
