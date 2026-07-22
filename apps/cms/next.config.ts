import type { NextConfig } from "next";
import { join } from "path";

const nextConfig: NextConfig = {
  // خروجی standalone برای ایمیج داکر کوچک (server.js خوداتکا)
  output: "standalone",
  // در مونوریپو، ریشه‌ی trace را repo root بگذار تا وابستگی‌های workspace درست بسته‌بندی شوند
  outputFileTracingRoot: join(__dirname, "../../"),
  transpilePackages: ["@roohbakhsh/shared"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
};

export default nextConfig;
