import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import CalorieScanner from "@/components/CalorieScanner";
import FitnessCalculator from "@/components/FitnessCalculator";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <CalorieScanner />
      <FitnessCalculator />
    </div>
  );
};

export default Index;
