import Navbar from "@/components/ui/Navbar";
import PageTransitionOverlay from "@/components/ui/PageTransitionOverlay";
import HeroSection from "@/components/sections/HeroSection";
import TeamScrollAnimation from "@/components/TeamScrollAnimation";
import TextHighlighted from "@/components/TextHighlighted";
import ProcessSection from "@/components/ProcessSection";
import BookInspectionSection from "@/components/BookInspectionSection";
import ContactUsSection from "@/components/ContactUsSection";
import AboutSection from "@/components/AboutSection";
import PricingSection from "@/components/PricingSection";
import ConsultationStrip from "@/components/ConsultationStrip";
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
        <TextHighlighted />
        <TeamScrollAnimation />
        <AboutSection />
        <ProcessSection />
        <BookInspectionSection />
        <ContactUsSection />
        <PricingSection />
        <ConsultationStrip />
        <FAQSection />
      </main>
      <Footer />
    </>
  );
}
