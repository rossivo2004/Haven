const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains:['th.bing.com', 'res.cloudinary.com'],
      },
      reactStrictMode: false,
      poweredByHeader: false,
}

module.exports = withNextIntl(nextConfig);
