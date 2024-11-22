/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['res.cloudinary.com', 'foodhavenadmin.vercel.app'],
      },
      reactStrictMode: false,
      async rewrites() {
        return {
          fallback: [
            {
              source: '/signin',
              destination: '/admin',
              permanent: true,
            },
          ],
        }
      },
}

export default nextConfig;
