
import HeroSlider from "@/components/home/HeroSlider";
import BusinessShowcase from "@/components/home/BusinessShowcase";
import CorporateIntroduction from "@/components/home/CorporateIntroduction";
import CementBrands from "@/components/home/CementBrands";
import OperationsShowcase from "@/components/home/OperationsShowcase";
import LeadershipSection from "@/components/home/LeadershipSection";
import ContactCTA from "@/components/home/ContactCTA";

export default function HomePage() {
  return (
    <main>
      <HeroSlider />
      <BusinessShowcase />
      <CorporateIntroduction />
      <CementBrands />
      <OperationsShowcase />
      <LeadershipSection />
      <ContactCTA />
    </main>
  );
}
