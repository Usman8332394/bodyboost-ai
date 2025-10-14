import { Button } from "@/components/ui/button";
import { Activity } from "lucide-react";
import heroImage from "@/assets/hero-fitness.jpg";

const Hero = () => {
  const scrollToCalculator = () => {
    document.getElementById('fitness-calculator')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${heroImage})`,
          filter: 'brightness(0.4)'
        }}
      />
      <div className="absolute inset-0" style={{ background: 'var(--gradient-hero)' }} />
      
      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30 mb-6 animate-fade-in">
          <Activity className="w-4 h-4 text-primary-foreground" />
          <span className="text-sm font-medium text-primary-foreground">Your Fitness Journey Starts Here</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-primary-foreground animate-fade-in" style={{ animationDelay: '0.1s' }}>
          Transform Your Body,
          <br />
          <span style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Transform Your Life
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
          Get AI-powered personalized fitness and nutrition plans tailored to your unique goals
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <Button 
            size="lg" 
            onClick={scrollToCalculator}
            className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all"
            style={{ 
              background: 'var(--gradient-primary)',
              transition: 'var(--transition-smooth)'
            }}
          >
            Get Your Plan Now
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            onClick={() => document.getElementById('exercises')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-lg px-8 py-6 bg-background/10 backdrop-blur-sm border-primary-foreground/30 text-primary-foreground hover:bg-background/20"
          >
            Explore Exercises
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
