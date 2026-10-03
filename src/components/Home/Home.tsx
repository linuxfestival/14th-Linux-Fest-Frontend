import Footer from "../Footer/Footer";
import ActivityTicker from "./components/ActivityTicker";
import HeroSection from "./components/HeroSection";
import PathwaysSection from "./components/PathwaysSection";
import ProgramsSection from "./components/ProgramsSection";
import SponsorsSection from "./components/SponsorsSection";

const Home = () => (
  <main className="overflow-hidden bg-text-white text-primary">
    <HeroSection />
    <ActivityTicker />
    <PathwaysSection />
    <ProgramsSection />
    <SponsorsSection />
    <Footer />
  </main>
);

export default Home;
