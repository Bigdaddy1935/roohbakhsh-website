import HeroSection from "@/components/home/HeroSection";
import StatsBar from "@/components/home/StatsBar";
import FreeCourses from "@/components/home/FreeCourses";
import CategoriesSection from "@/components/home/CategoriesSection";
import FeaturedCourses from "@/components/home/FeaturedCourses";
import ServicesSection from "@/components/home/ServicesSection";
import NewestCourses from "@/components/home/NewestCourses";
import LatestArticles from "@/components/home/LatestArticles";
import Testimonials from "@/components/home/Testimonials";
import AboutMission from "@/components/home/AboutMission";
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <FreeCourses />
      <CategoriesSection />
      <FeaturedCourses />
      <ServicesSection />
      <NewestCourses />
      <LatestArticles />
      <Testimonials />
      <AboutMission />
    </>
  );
}
