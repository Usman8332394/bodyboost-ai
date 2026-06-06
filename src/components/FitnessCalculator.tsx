import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type DietRow = {
  meal: string;
  time: string;
  food: string;
  calories: string;
};

type ExerciseRow = {
  day: string;
  exercise: string;
  sets: string;
  reps: string;
  rest: string;
};

type PlanData = {
  dietPlan: DietRow[];
  exercisePlan: ExerciseRow[];
  summary: string;
};

const FitnessCalculator = () => {
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [heightUnit, setHeightUnit] = useState("cm");
  const [weightUnit, setWeightUnit] = useState("kg");
  const [goal, setGoal] = useState("general-fitness");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<PlanData | null>(null);
  const [bmi, setBmi] = useState("");

  const handleGeneratePlan = async () => {
    if (!age || !height || !weight) {
      toast.error("Please enter your age, height and weight");
      return;
    }

    setLoading(true);
    setPlan(null);
    setBmi("");

    try {
      const { data, error } = await supabase.functions.invoke('generate-fitness-plan', {
        body: {
          age: parseInt(age),
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

        <div className="max-w-4xl mx-auto space-y-8">
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

          {(loading || plan) && (
            <Card className="shadow-lg" style={{ boxShadow: 'var(--shadow-card)' }}>
              <CardHeader>
                <CardTitle className="text-2xl">Your Personalized Plan</CardTitle>
                <CardDescription className="text-lg">
                  {bmi && `Your BMI: ${bmi}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : plan ? (
                  <div className="space-y-8">
                    <p className="text-base text-muted-foreground leading-relaxed bg-secondary/30 p-4 rounded-lg">{plan.summary}</p>
                    
                    <div>
                      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <span className="text-2xl">📋</span> Daily Meal Plan
                      </h3>
                      <div className="border-2 rounded-lg overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-primary/5">
                              <TableHead className="font-bold border-r">Meal</TableHead>
                              <TableHead className="font-bold border-r">Time</TableHead>
                              <TableHead className="font-bold border-r">Food</TableHead>
                              <TableHead className="font-bold">Calories</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {plan.dietPlan.map((row, index) => (
                              <TableRow key={index} className="border-b last:border-0">
                                <TableCell className="font-semibold border-r">{row.meal}</TableCell>
                                <TableCell className="border-r">{row.time}</TableCell>
                                <TableCell className="border-r">{row.food}</TableCell>
                                <TableCell className="font-medium">{row.calories}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <span className="text-2xl">💪</span> Weekly Exercise Plan
                      </h3>
                      <div className="border-2 rounded-lg overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-primary/5">
                              <TableHead className="font-bold border-r">Day</TableHead>
                              <TableHead className="font-bold border-r">Exercise</TableHead>
                              <TableHead className="font-bold border-r">Sets</TableHead>
                              <TableHead className="font-bold border-r">Reps</TableHead>
                              <TableHead className="font-bold">Rest</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {plan.exercisePlan.map((row, index) => (
                              <TableRow key={index} className="border-b last:border-0">
                                <TableCell className="font-semibold border-r">{row.day}</TableCell>
                                <TableCell className="border-r">{row.exercise}</TableCell>
                                <TableCell className="border-r text-center">{row.sets}</TableCell>
                                <TableCell className="border-r text-center">{row.reps}</TableCell>
                                <TableCell className="text-center">{row.rest}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                      <p className="text-sm text-muted-foreground mt-4 bg-primary/5 p-3 rounded-lg">
                        💡 View all exercises with tutorial videos on the <a href="/exercises" className="text-primary underline font-semibold">Exercises page</a>
                      </p>
                    </div>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
};

export default FitnessCalculator;
