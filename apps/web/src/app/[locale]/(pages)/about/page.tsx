import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import AboutHero from "@/components/features/about/AboutHero";
import AboutMission from "@/components/features/about/AboutMission";
import AboutValues from "@/components/features/about/AboutValues";
import AboutTeam from "@/components/features/about/AboutTeam";
import AboutCta from "@/components/features/about/AboutCta";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });
  return {
    title: t("about_title"),
    description: t("about_description"),
    alternates: { canonical: `/${locale}/about` },
  };
}

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutMission />
      <AboutValues />
      <AboutTeam />
      <AboutCta />
    </>
  );
}
