import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  env: {
    NEXT_PUBLIC_APP_NAME: "NagrikSeva AI",
    ALLOW_DEMO_CREDENTIALS: process.env.ALLOW_DEMO_CREDENTIALS || "true",
    NEXT_PUBLIC_ALLOW_DEMO_CREDENTIALS: process.env.NEXT_PUBLIC_ALLOW_DEMO_CREDENTIALS || "true",
    OFFICER_AUTH_SECRET: process.env.OFFICER_AUTH_SECRET || "9f83b271d44a2c5e03947b1e8461b2e6734d8a1c905e32b45f1a7d6e8b2c9a1f",
    NEXT_PUBLIC_RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_ToAhkTKBIwxENQ",
    RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || "vZzX2lR01orHItU0C3ORL5Sq",
    PAYMENT_WEBHOOK_SECRET: process.env.PAYMENT_WEBHOOK_SECRET || "vZzX2lR01orHItU0C3ORL5Sq",
  },
  async headers() {
    return [
      {
        source: "/manifest.json",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET, OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Accept" },
        ],
      },
      {
        source: "/icon.svg",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET, OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Accept" },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
          { key: "Permissions-Policy", value: "camera=(self), microphone=(self), geolocation=(self)" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://translate.google.com https://translate.googleapis.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://translate.googleapis.com",
              "font-src 'self' data: https://fonts.gstatic.com",
              "img-src 'self' data: blob: https://api.qrserver.com https://translate.google.com https://translate.googleapis.com https://*.google.com https://*.gstatic.com https://badgen.net",
              "connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://*.cloudfunctions.net https://api.razorpay.com https://translate.googleapis.com",
              "frame-src 'self' https://api.razorpay.com https://checkout.razorpay.com",
              "media-src 'self' blob: data: https://translate.google.com",
              "worker-src 'self' blob:",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
