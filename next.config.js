/** @type {import('next').NextConfig} */
module.exports = {
    async redirects() {
        return [
            {
                source: '/profile',
                destination: '/profile/myProperties',
                permanent: true,
            },
        ]
    },
    typescript: {
        // !! WARN !!
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        // !! WARN !!
        ignoreBuildErrors: true,
    },
    images: {
        domains: ["firebasestorage.googleapis.com", "yt3.googleusercontent.com"]
    },
    "compilerOptions": {
        "baseUrl": ".",
        "paths": {
            "@/*": ["*"]
        }
    }
}

// module.exports = nextConfig
