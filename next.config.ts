import type { NextConfig } from "next";

const MONTH = 60 * 60 * 24 * 30;

const config: NextConfig = {
  poweredByHeader: false,
  images: {
    // WebP only: AVIF costs a lot more CPU the first time each size is made, and the Hobby plan shares one small function for that.
    formats: ["image/webp"],
    // Fewer sizes means fewer variants to generate (each is a billed optimisation), and the ones left cover every layout here.
    deviceSizes: [640, 828, 1080, 1440, 1920],
    imageSizes: [160, 256, 384],
    minimumCacheTTL: MONTH,
  },
  async headers() {
    return [
      {
        // files in public/ are not fingerprinted, so by default the CDN makes every visitor re-check each one on every visit
        source: "/:path*.(webp|png|jpg|jpeg|svg|ico|woff2)",
        headers: [{ key: "Cache-Control", value: `public, max-age=${MONTH}, stale-while-revalidate=86400` }],
      },
    ];
  },
};

export default config;
