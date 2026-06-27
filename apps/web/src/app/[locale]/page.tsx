import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
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
      <Header />
      <main>
      <HeroSection />
      <NewestCourses />
      <CategoriesSection />
      <FeaturedCourses />
      <ServicesSection />
      <LatestArticles />
      <Testimonials />
      <AboutMission />
      </main>
      <Footer />
    </>
  );
}
