/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  reactStrictMode: true,
  distDir: 'build',
//   serverRuntimeConfig: {
//     PROJECT_ROOT: __dirname
// }

}

const nextConfigNew = {
  distDir: 'build',
  assetPrefix: ".", //css 開發目錄底下 dev模式下要關閉
  images: {
    loader: "imgix",
    path: "/",
  },
}

module.exports = nextConfig
