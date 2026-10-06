import Footer from "../Footer/Footer";
import ActivityTicker from "./components/ActivityTicker";
import HeroSection from "./components/HeroSection";
import ExperienceSection from "./components/ExperienceSection";
import ProgramsSection from "./components/ProgramsSection";
import SponsorsSection from "./components/SponsorsSection";

const Home = () => (
  <>
    <main className="overflow-scroll bg-text-white text-primary">
      <HeroSection />
      <ActivityTicker />
      <ExperienceSection />
      <ProgramsSection />
      <SponsorsSection />
    </main>
    <Footer />
  </>
);

export default Home;
