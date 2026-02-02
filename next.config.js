/** @type {import('next').NextConfig} */
const nextConfig = {
	output: 'export',
	staticPageGenerationTimeout: 180, // Increase timeout to 3 minutes
};

module.exports = nextConfig;
