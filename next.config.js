/** @type {import('next').NextConfig} */
module.exports = {
    typescript: {
        // !! WARN !!
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        // !! WARN !!
        ignoreBuildErrors: true,
    },
    images: {
     domains: ["firebase.com"]
    },
    "compilerOptions": {
        "baseUrl": ".",
        "paths": {
            "@/*": ["*"]
        }
    }
}

// module.exports = nextConfig
