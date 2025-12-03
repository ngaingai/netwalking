/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com", "netwalking.net", "www.netwalking.net"],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: "/:path*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.hsforms.net https://*.hsforms.net https://*.hsforms.com https://www.google.com https://google.com https://www.gstatic.com https://recaptcha.net", // HubSpot forms + reCAPTCHA Enterprise
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.hsforms.net https://*.hsforms.com", // HubSpot form styles
              "font-src 'self' https://fonts.gstatic.com data:",
              "img-src 'self' data: blob: https://res.cloudinary.com https://netwalking.net https://www.netwalking.net https://*.hsforms.net https://*.hsforms.com https://www.google.com https://google.com https://www.gstatic.com https://recaptcha.net", // reCAPTCHA images
              "connect-src 'self' https://api.cloudinary.com https://res.cloudinary.com https://*.cloudinary.com https://*.hsforms.net https://*.hsforms.com https://*.hubspot.com https://*.s3.amazonaws.com https://www.google.com https://google.com https://www.gstatic.com https://recaptcha.net", // HubSpot API calls + reCAPTCHA Enterprise
              "frame-src 'self' https://*.hsforms.net https://*.hsforms.com https://*.hubspot.com https://www.google.com https://google.com https://recaptcha.net", // HubSpot form iframes + reCAPTCHA Enterprise
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self' https://*.hsforms.net https://*.hsforms.com https://*.hubspot.com", // HubSpot form submissions
              "frame-ancestors 'self'",
              "upgrade-insecure-requests",
            ].join("; "),
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
