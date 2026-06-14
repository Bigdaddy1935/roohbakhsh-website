import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./lib/i18n.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // پکیج مشترک را در همین مونوریپو ترنسپایل کن
  transpilePackages: ["@roohbakhsh/shared"],
};

export default withNextIntl(nextConfig);
