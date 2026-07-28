import Navbar from "./Navbar";
import Hero from "./Hero";
import Features from "./Features";
import Workflow from "./Workflow";
import Pricing from "./Pricing";
import FAQ from "./FAQ";
import Footer from "./Footer";
import ScrollBand from "./ScrollBand";
const Landing = () => {
  return (
    <main className="bg-black text-white overflow-x-hidden">
      <Navbar />
      <Hero />
      <ScrollBand />
      <Features />
      <Workflow />
      <Pricing />
      <FAQ />
      <Footer />
    </main>
  );
};

export default Landing;