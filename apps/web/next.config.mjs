import createNextIntlPlugin from "next-intl/plugin";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // خروجی standalone برای ایمیج داکر کوچک (server.js خوداتکا)
  output: "standalone",
  // در مونوریپو، ریشه‌ی trace را repo root بگذار تا وابستگی‌های workspace درست بسته‌بندی شوند
  outputFileTracingRoot: join(__dirname, "../../"),
  allowedDevOrigins: ["172.18.100.125"],
  transpilePackages: ["@roohbakhsh/shared"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
};

export default withNextIntl(nextConfig);
