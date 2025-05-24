import HeroSection from "@/components/home/HeroSection";
import QuickSearchBar from "@/components/home/QuickSearchBar";
import FeaturedVehicles from "@/components/home/FeaturedVehicles";
import ServiceHighlights from "@/components/home/ServiceHighlights";
import VirtualShowroom from "@/components/home/VirtualShowroom";
import FinancingSection from "@/components/home/FinancingSection";
import TestDriveSection from "@/components/home/TestDriveSection";
import AIChatFeature from "@/components/home/AIChatFeature";
import TradeInEstimator from "@/components/home/TradeInEstimator";
import Testimonials from "@/components/home/Testimonials";
import CTASection from "@/components/home/CTASection";
import { Helmet } from 'react-helmet';

const Home = () => {
  return (
    <>
      <Helmet>
        <title>AutoDrive - Modern Automotive Digital Retailing</title>
        <meta 
          name="description" 
          content="Find your perfect vehicle with AutoDrive. Browse our extensive inventory, apply for financing, schedule test drives, and experience our virtual showroom."
        />
      </Helmet>
      
      <HeroSection />
      <QuickSearchBar />
      <FeaturedVehicles />
      <ServiceHighlights />
      <VirtualShowroom />
      <FinancingSection />
      <TestDriveSection />
      <AIChatFeature />
      <TradeInEstimator />
      <Testimonials />
      <CTASection />
    </>
  );
};

export default Home;
