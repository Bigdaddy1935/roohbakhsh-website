import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "أكاديمية روح‌بخش الإسلامية الدولية",
    short_name: "روح‌بخش",
    description: "وجهتك الأولى لتعلّم العلوم الإسلامية باحترافية",
    start_url: "/ar",
    display: "standalone",
    orientation: "portrait",
    background_color: "#F8F9FA",
    theme_color: "#0CA789",
    lang: "ar",
    dir: "rtl",
    categories: ["education"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
