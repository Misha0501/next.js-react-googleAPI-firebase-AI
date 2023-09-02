/** @type {import('next').NextConfig} */
const nextConfig = {
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

module.exports = nextConfig
