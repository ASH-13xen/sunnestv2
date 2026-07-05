import Navbar from "@/components/ui/Navbar";
import PageTransitionOverlay from "@/components/ui/PageTransitionOverlay";
import HeroSection from "@/components/sections/HeroSection";
import TeamScrollAnimation from "@/components/TeamScrollAnimation";
import ProductsSection from "@/components/ProductsSection";
import BookInspectionSection from "@/components/BookInspectionSection";
import AboutSection from "@/components/AboutSection";
import ProcessSection from "@/components/ProcessSection";
import ConsultationStrip from "@/components/ConsultationStrip";
import ContactUsSection from "@/components/ContactUsSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <PageTransitionOverlay />
      <main>
        <div id="hero">
          <HeroSection />
        </div>
        <TeamScrollAnimation />
        <ProductsSection />
        <BookInspectionSection />
        <AboutSection />
        <ProcessSection />
        <ConsultationStrip />
        <ContactUsSection />
        <FAQSection />
      </main>
      <Footer />
    </>
  );
}
