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
  async headers() {
    return [
      {
        // Google sign-in opens a popup via the Firebase SDK; without this,
        // some browsers default to a COOP policy that blocks the opener
        // from reading popup.closed / calling popup.close().
        source: "/(.*)",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
        ],
      },
    ];
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.istockphoto.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};
