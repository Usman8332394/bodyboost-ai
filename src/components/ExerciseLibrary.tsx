import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import pushupImg from "@/assets/exercise-pushup.jpg";
import squatImg from "@/assets/exercise-squat.jpg";
import plankImg from "@/assets/exercise-plank.jpg";
import jumpingJacksImg from "@/assets/exercise-jumping-jacks.jpg";
import lungesImg from "@/assets/exercise-lunges.jpg";
import burpeesImg from "@/assets/exercise-burpees.jpg";

const exercises = [
  {
    name: "Push-ups",
    image: pushupImg,
    difficulty: "Beginner",
    muscles: ["Chest", "Triceps", "Shoulders"],
    description: "Classic bodyweight exercise that builds upper body strength",
    sets: "3-4 sets of 10-15 reps"
  },
  {
    name: "Squats",
    image: squatImg,
    difficulty: "Beginner",
    muscles: ["Quads", "Glutes", "Core"],
    description: "Fundamental lower body exercise for strength and stability",
    sets: "3-4 sets of 12-15 reps"
  },
  {
    name: "Plank",
    image: plankImg,
    difficulty: "Beginner",
    muscles: ["Core", "Shoulders", "Back"],
    description: "Isometric core exercise that builds endurance",
    sets: "3-4 sets of 30-60 seconds"
  },
  {
    name: "Jumping Jacks",
    image: jumpingJacksImg,
    difficulty: "Beginner",
    muscles: ["Full Body", "Cardio"],
    description: "Dynamic warm-up and cardio exercise",
    sets: "3 sets of 20-30 reps"
  },
  {
    name: "Lunges",
    image: lungesImg,
    difficulty: "Intermediate",
    muscles: ["Quads", "Glutes", "Hamstrings"],
    description: "Unilateral leg exercise for balance and strength",
    sets: "3 sets of 10-12 reps per leg"
  },
  {
    name: "Burpees",
    image: burpeesImg,
    difficulty: "Advanced",
    muscles: ["Full Body", "Cardio"],
    description: "High-intensity full body exercise for conditioning",
    sets: "3-4 sets of 8-12 reps"
  }
];

const difficultyColors = {
  "Beginner": "bg-success text-success-foreground",
  "Intermediate": "bg-accent text-accent-foreground",
  "Advanced": "bg-destructive text-destructive-foreground"
};

const ExerciseLibrary = () => {
  return (
    <section id="exercises" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Exercise Library
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Master these fundamental exercises to build a strong foundation
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exercises.map((exercise, index) => (
            <Card 
              key={index} 
              className="overflow-hidden hover-scale cursor-pointer group"
              style={{ 
                boxShadow: 'var(--shadow-card)',
                transition: 'var(--transition-smooth)'
              }}
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={exercise.image} 
                  alt={exercise.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute top-3 right-3">
                  <Badge className={difficultyColors[exercise.difficulty as keyof typeof difficultyColors]}>
                    {exercise.difficulty}
                  </Badge>
                </div>
              </div>
              
              <CardHeader>
                <CardTitle>{exercise.name}</CardTitle>
                <CardDescription>{exercise.description}</CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium mb-1">Target Muscles:</p>
                    <div className="flex flex-wrap gap-1">
                      {exercise.muscles.map((muscle, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {muscle}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Recommended:</p>
                    <p className="text-sm text-muted-foreground">{exercise.sets}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExerciseLibrary;
