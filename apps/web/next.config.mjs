import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@roohbakhsh/shared"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "roohbakhshac.ir" },
      { protocol: "https", hostname: "dl.poshtybanman.ir" },
      { protocol: "https", hostname: "s3.eseminar.tv" },
      { protocol: "https", hostname: "secure.gravatar.com" },
    ],
  },
};

export default withNextIntl(nextConfig);
