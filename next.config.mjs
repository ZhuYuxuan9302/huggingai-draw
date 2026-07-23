/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // standalone 让 Next 把依赖打包到 .next/standalone 里，
  // Docker 镜像可以不用复制整个 node_modules 节省 ~80% 体积
  output: "standalone",
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
};

export default nextConfig;
