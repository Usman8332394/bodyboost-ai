import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Calculator, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const FitnessCalculator = () => {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [heightUnit, setHeightUnit] = useState("cm");
  const [weightUnit, setWeightUnit] = useState("kg");
  const [goal, setGoal] = useState("general-fitness");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState("");
  const [bmi, setBmi] = useState("");

  const handleGeneratePlan = async () => {
    if (!height || !weight) {
      toast.error("Please enter your height and weight");
      return;
    }

    setLoading(true);
    setPlan("");
    setBmi("");

    try {
      const { data, error } = await supabase.functions.invoke('generate-fitness-plan', {
        body: {
          height: parseFloat(height),
          weight: parseFloat(weight),
          heightUnit,
          weightUnit,
          goal: goal.replace('-', ' ')
        }
      });

      if (error) throw error;

      if (data.error) {
        toast.error(data.error);
        return;
      }

      setPlan(data.plan);
      setBmi(data.bmi);
      toast.success("Your personalized plan is ready!");
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to generate plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="fitness-calculator" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            AI-Powered Fitness Calculator
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Enter your details to get a personalized fitness and nutrition plan
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          <Card className="shadow-lg" style={{ boxShadow: 'var(--shadow-card)' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-primary" />
                Your Metrics
              </CardTitle>
              <CardDescription>Tell us about yourself</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="height">Height</Label>
                <div className="flex gap-2">
                  <Input
                    id="height"
                    type="number"
                    placeholder="Enter height"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="flex-1"
                  />
                  <Select value={heightUnit} onValueChange={setHeightUnit}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cm">cm</SelectItem>
                      <SelectItem value="inches">in</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">Weight</Label>
                <div className="flex gap-2">
                  <Input
                    id="weight"
                    type="number"
                    placeholder="Enter weight"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="flex-1"
                  />
                  <Select value={weightUnit} onValueChange={setWeightUnit}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">kg</SelectItem>
                      <SelectItem value="lbs">lbs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="goal">Fitness Goal</Label>
                <Select value={goal} onValueChange={setGoal}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your fitness goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weight-loss">Weight Loss</SelectItem>
                    <SelectItem value="muscle-gain">Build Muscle</SelectItem>
                    <SelectItem value="endurance">Improve Endurance</SelectItem>
                    <SelectItem value="flexibility">Increase Flexibility</SelectItem>
                    <SelectItem value="general-fitness">General Fitness</SelectItem>
                    <SelectItem value="strength">Build Strength</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleGeneratePlan} 
                disabled={loading}
                className="w-full"
                size="lg"
                style={{ background: 'var(--gradient-primary)' }}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Your Plan...
                  </>
                ) : (
                  'Generate My Plan'
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg" style={{ boxShadow: 'var(--shadow-card)' }}>
            <CardHeader>
              <CardTitle>Your Personalized Plan</CardTitle>
              <CardDescription>
                {bmi && `Your BMI: ${bmi}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : plan ? (
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  {plan.split('\n\n').map((section, idx) => {
                    const isHeading = section.match(/^(#+\s|[A-Z\s]+:|\d+\.\s[A-Z])/);
                    const isBullet = section.match(/^[-•*]\s/);
                    
                    if (isHeading) {
                      return (
                        <div key={idx} className="pt-2 first:pt-0">
                          <h3 className="text-lg font-bold text-primary mb-2">
                            {section.replace(/^#+\s/, '')}
                          </h3>
                        </div>
                      );
                    }
                    
                    if (isBullet || section.includes('\n- ') || section.includes('\n• ')) {
                      const items = section.split('\n').filter(s => s.trim());
                      return (
                        <ul key={idx} className="space-y-2 ml-2">
                          {items.map((item, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-primary mt-1">•</span>
                              <span className="text-sm leading-relaxed">
                                {item.replace(/^[-•*]\s/, '')}
                              </span>
                            </li>
                          ))}
                        </ul>
                      );
                    }
                    
                    return (
                      <p key={idx} className="text-sm leading-relaxed text-muted-foreground">
                        {section}
                      </p>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-muted-foreground text-center">
                  <p>Enter your details and click "Generate My Plan" to receive your personalized fitness and nutrition plan</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FitnessCalculator;
