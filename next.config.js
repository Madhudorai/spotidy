/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
	  remotePatterns: [
		{
		  protocol: 'https',
		  hostname: 'dolfnppzucqngozzpzbn.supabase.co',
		  pathname: '/**', // Matches all image paths
		},
	  ],
	},
  };
  
  module.exports = nextConfig;
  