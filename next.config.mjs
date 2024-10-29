/** @type {import('next').NextConfig} */
const nextConfig = {
  // if you get the Socket error
  // webpack: (config) => {
  //   config.external.push({
  //     "utf-8-validate": "commanjs-utf-8-validate",
  //     bufferutil: "commanjs bufferutil",
  //   });

  // return config
  // },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        port: "",
        pathname: "/**",
      },
    ],
    domains: ["utfs.io", "uploadthing.com"],
  },
};

export default nextConfig;
