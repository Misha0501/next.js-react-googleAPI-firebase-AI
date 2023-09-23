/** @type {import('next').NextConfig} */
module.exports = {
  async redirects() {
    return [
      {
        source: "/profile",
        destination: "/profile/myProperties",
        permanent: true,
      },
    ];
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.istockphoto.com",
        port: "",
        pathname: "/**",
      },
    ],
    domains: [
      "firebasestorage.googleapis.com",
      "https://firebasestorage.googleapis.com",
    ],
  },
  compilerOptions: {
    baseUrl: ".",
    paths: {
      "@/*": ["*"],
    },
  },
};

// module.exports = nextConfig
