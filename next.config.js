// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    output: 'export',
    webpack: (config) => {
        config.resolve.alias.canvas = false;

        return config;
    },
}

module.exports = nextConfig;
