import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dumbbell, Calculator } from "lucide-react";

const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <Dumbbell className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              FitGenius
            </span>
          </Link>
          
          <div className="flex gap-2">
            <Button
              variant={location.pathname === "/" ? "default" : "ghost"}
              asChild
            >
              <Link to="/" className="flex items-center gap-2">
                <Calculator className="w-4 h-4" />
                AI Planner
              </Link>
            </Button>
            <Button
              variant={location.pathname === "/exercises" ? "default" : "ghost"}
              asChild
            >
              <Link to="/exercises" className="flex items-center gap-2">
                <Dumbbell className="w-4 h-4" />
                Exercises
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
