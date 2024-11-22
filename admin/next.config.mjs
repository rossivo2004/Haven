/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com', 'foodhavenadmin.vercel.app'],
  },
  reactStrictMode: false,
  // async rewrites() {
  //   return [
  //     {
  //       source: '/signin',
  //       destination: 'https://foodhavenadmin.vercel.app/signin',
  //     },
  //     {
  //       source: '/admin',
  //       destination: 'https://foodhavenadmin.vercel.app/admin',
  //     },
  //   ];
  // },
};

export default nextConfig;
