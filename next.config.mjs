/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/hub',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
