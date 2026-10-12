import Footer from "../Footer/Footer";
import ActivityTicker from "./components/ActivityTicker";
import HeroSection from "./components/HeroSection";
import ExperienceSection from "./components/ExperienceSection";
import BundlesSection from "./components/BundlesSection";
import ProgramsSection from "./components/ProgramsSection";
import SponsorsSection from "./components/SponsorsSection";

const Home = () => (
  <>
    <main className="overflow-clip bg-text-white text-primary">
      <HeroSection />
      <ActivityTicker />
      <BundlesSection />
      <ExperienceSection />
      <ProgramsSection />
      <SponsorsSection />
    </main>
    <Footer />
  </>
);

export default Home;
