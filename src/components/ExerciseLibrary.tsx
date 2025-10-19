import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PlayCircle } from "lucide-react";
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
    sets: "3-4 sets of 10-15 reps",
    videoUrl: "https://www.youtube.com/embed/IODxDxX7oi4",
    instructions: [
      "Start in a plank position with hands slightly wider than shoulders",
      "Lower your body until your chest nearly touches the floor",
      "Keep your core engaged and body in a straight line",
      "Push back up to starting position",
      "Repeat for desired reps"
    ]
  },
  {
    name: "Squats",
    image: squatImg,
    difficulty: "Beginner",
    muscles: ["Quads", "Glutes", "Core"],
    description: "Fundamental lower body exercise for strength and stability",
    sets: "3-4 sets of 12-15 reps",
    videoUrl: "https://www.youtube.com/embed/aclHkVaku9U",
    instructions: [
      "Stand with feet shoulder-width apart",
      "Lower your body by bending knees and hips",
      "Keep chest up and weight on heels",
      "Go down until thighs are parallel to ground",
      "Push through heels to return to start"
    ]
  },
  {
    name: "Plank",
    image: plankImg,
    difficulty: "Beginner",
    muscles: ["Core", "Shoulders", "Back"],
    description: "Isometric core exercise that builds endurance",
    sets: "3-4 sets of 30-60 seconds",
    videoUrl: "https://www.youtube.com/embed/ASdvN_XEl_c",
    instructions: [
      "Start in a forearm plank position",
      "Keep your body in a straight line from head to heels",
      "Engage your core and squeeze your glutes",
      "Don't let hips sag or pike up",
      "Hold for desired time while breathing steadily"
    ]
  },
  {
    name: "Jumping Jacks",
    image: jumpingJacksImg,
    difficulty: "Beginner",
    muscles: ["Full Body", "Cardio"],
    description: "Dynamic warm-up and cardio exercise",
    sets: "3 sets of 20-30 reps",
    videoUrl: "https://www.youtube.com/embed/iSSAk4XCsRA",
    instructions: [
      "Stand with feet together and arms at sides",
      "Jump while spreading legs shoulder-width apart",
      "Simultaneously raise arms overhead",
      "Jump back to starting position",
      "Maintain a steady rhythm"
    ]
  },
  {
    name: "Lunges",
    image: lungesImg,
    difficulty: "Intermediate",
    muscles: ["Quads", "Glutes", "Hamstrings"],
    description: "Unilateral leg exercise for balance and strength",
    sets: "3 sets of 10-12 reps per leg",
    videoUrl: "https://www.youtube.com/embed/QOVaHwm-Q6U",
    instructions: [
      "Stand tall with feet hip-width apart",
      "Step forward with one leg",
      "Lower your hips until both knees are bent at 90 degrees",
      "Keep front knee over ankle, not past toes",
      "Push back to starting position and repeat"
    ]
  },
  {
    name: "Burpees",
    image: burpeesImg,
    difficulty: "Advanced",
    muscles: ["Full Body", "Cardio"],
    description: "High-intensity full body exercise for conditioning",
    sets: "3-4 sets of 8-12 reps",
    videoUrl: "https://www.youtube.com/embed/TU8QYVW0gDU",
    instructions: [
      "Start standing, then drop into a squat",
      "Place hands on ground and jump feet back to plank",
      "Perform a push-up",
      "Jump feet back to squat position",
      "Explosively jump up with arms overhead"
    ]
  },
  {
    name: "Deadlifts (Barbell)",
    image: pushupImg,
    difficulty: "Intermediate",
    muscles: ["Back", "Glutes", "Hamstrings", "Core"],
    description: "Compound exercise for total body strength and power",
    sets: "3-4 sets of 6-10 reps",
    videoUrl: "https://www.youtube.com/embed/op9kVnSso6Q",
    instructions: [
      "Stand with feet hip-width apart, barbell over mid-foot",
      "Bend down and grip the bar just outside your legs",
      "Keep back straight, chest up, and shoulders back",
      "Drive through heels and extend hips and knees",
      "Lower the bar with control back to starting position"
    ]
  },
  {
    name: "Bench Press (Barbell)",
    image: squatImg,
    difficulty: "Intermediate",
    muscles: ["Chest", "Triceps", "Shoulders"],
    description: "Classic upper body pressing movement for chest strength",
    sets: "3-4 sets of 8-12 reps",
    videoUrl: "https://www.youtube.com/embed/rT7DgCr-3pg",
    instructions: [
      "Lie flat on bench with feet planted on floor",
      "Grip barbell slightly wider than shoulder-width",
      "Lower bar to mid-chest with control",
      "Keep elbows at 45-degree angle from body",
      "Press bar up explosively until arms are extended"
    ]
  },
  {
    name: "Pull-ups",
    image: plankImg,
    difficulty: "Intermediate",
    muscles: ["Back", "Biceps", "Shoulders"],
    description: "Bodyweight pulling exercise for back and arm strength",
    sets: "3-4 sets of 6-10 reps",
    videoUrl: "https://www.youtube.com/embed/eGo4IYlbE5g",
    instructions: [
      "Hang from pull-up bar with overhand grip",
      "Keep hands slightly wider than shoulder-width",
      "Pull yourself up until chin is over the bar",
      "Keep core engaged and avoid swinging",
      "Lower yourself down with control"
    ]
  },
  {
    name: "Dumbbell Shoulder Press",
    image: jumpingJacksImg,
    difficulty: "Beginner",
    muscles: ["Shoulders", "Triceps", "Core"],
    description: "Overhead pressing movement for shoulder development",
    sets: "3-4 sets of 10-12 reps",
    videoUrl: "https://www.youtube.com/embed/qEwKCR5JCog",
    instructions: [
      "Sit on bench with back support, dumbbells at shoulder height",
      "Press dumbbells overhead until arms are fully extended",
      "Keep core engaged and avoid arching back excessively",
      "Lower dumbbells with control to shoulder level",
      "Maintain steady breathing throughout"
    ]
  },
  {
    name: "Dumbbell Rows",
    image: lungesImg,
    difficulty: "Beginner",
    muscles: ["Back", "Biceps", "Core"],
    description: "Single-arm pulling exercise for back thickness",
    sets: "3-4 sets of 10-12 reps per arm",
    videoUrl: "https://www.youtube.com/embed/roCP6wCXPqo",
    instructions: [
      "Place one knee and hand on bench for support",
      "Hold dumbbell in opposite hand, arm fully extended",
      "Pull dumbbell up to hip, keeping elbow close to body",
      "Squeeze back muscles at the top",
      "Lower with control and repeat"
    ]
  },
  {
    name: "Leg Press (Machine)",
    image: burpeesImg,
    difficulty: "Beginner",
    muscles: ["Quads", "Glutes", "Hamstrings"],
    description: "Machine-based leg exercise for lower body strength",
    sets: "3-4 sets of 12-15 reps",
    videoUrl: "https://www.youtube.com/embed/IZxyjW7MPJQ",
    instructions: [
      "Sit on leg press machine with back against pad",
      "Place feet shoulder-width apart on platform",
      "Lower weight by bending knees to 90 degrees",
      "Keep knees aligned with toes",
      "Press through heels to return to start"
    ]
  },
  {
    name: "Lat Pulldown (Machine)",
    image: pushupImg,
    difficulty: "Beginner",
    muscles: ["Back", "Biceps", "Shoulders"],
    description: "Cable machine exercise for back width",
    sets: "3-4 sets of 10-12 reps",
    videoUrl: "https://www.youtube.com/embed/CAwf7n6Luuc",
    instructions: [
      "Sit at lat pulldown machine and grip bar wide",
      "Lean back slightly and engage core",
      "Pull bar down to upper chest",
      "Squeeze shoulder blades together at bottom",
      "Control the weight back up"
    ]
  },
  {
    name: "Cable Tricep Pushdown",
    image: squatImg,
    difficulty: "Beginner",
    muscles: ["Triceps"],
    description: "Isolation exercise for tricep development",
    sets: "3-4 sets of 12-15 reps",
    videoUrl: "https://www.youtube.com/embed/2-LAMcpzODU",
    instructions: [
      "Stand facing cable machine with rope attachment",
      "Grip rope with both hands, elbows at sides",
      "Push rope down until arms are fully extended",
      "Keep elbows stationary throughout movement",
      "Control the rope back up and repeat"
    ]
  },
  {
    name: "Barbell Bicep Curls",
    image: plankImg,
    difficulty: "Beginner",
    muscles: ["Biceps", "Forearms"],
    description: "Classic arm exercise for bicep growth",
    sets: "3-4 sets of 10-12 reps",
    videoUrl: "https://www.youtube.com/embed/ykJmrZ5v0Oo",
    instructions: [
      "Stand with feet shoulder-width apart, barbell in hands",
      "Keep elbows close to sides and back straight",
      "Curl barbell up towards shoulders",
      "Squeeze biceps at the top",
      "Lower with control, don't swing the weight"
    ]
  },
  {
    name: "Mountain Climbers",
    image: jumpingJacksImg,
    difficulty: "Intermediate",
    muscles: ["Core", "Cardio", "Shoulders"],
    description: "Dynamic core and cardio conditioning exercise",
    sets: "3-4 sets of 20-30 reps",
    videoUrl: "https://www.youtube.com/embed/nmwgirgXLYM",
    instructions: [
      "Start in high plank position",
      "Drive one knee towards chest",
      "Quickly switch legs in a running motion",
      "Keep core engaged and hips level",
      "Maintain steady rhythm"
    ]
  },
  {
    name: "Russian Twists",
    image: lungesImg,
    difficulty: "Intermediate",
    muscles: ["Core", "Obliques"],
    description: "Rotational core exercise for oblique strength",
    sets: "3-4 sets of 20-30 reps (total)",
    videoUrl: "https://www.youtube.com/embed/wkD8rjkodUI",
    instructions: [
      "Sit on floor with knees bent, feet elevated",
      "Lean back slightly and engage core",
      "Rotate torso side to side, touching floor beside hips",
      "Keep chest up and maintain balance",
      "Add weight for increased difficulty"
    ]
  },
  {
    name: "Box Jumps",
    image: burpeesImg,
    difficulty: "Advanced",
    muscles: ["Quads", "Glutes", "Calves", "Power"],
    description: "Plyometric exercise for explosive leg power",
    sets: "3-4 sets of 8-10 reps",
    videoUrl: "https://www.youtube.com/embed/NBY9-kTuHEk",
    instructions: [
      "Stand facing a sturdy box or platform",
      "Bend knees and swing arms back",
      "Explosively jump onto box, landing softly",
      "Stand fully on box",
      "Step down carefully and repeat"
    ]
  }
];

const difficultyColors = {
  "Beginner": "bg-success text-success-foreground",
  "Intermediate": "bg-accent text-accent-foreground",
  "Advanced": "bg-destructive text-destructive-foreground"
};

const ExerciseLibrary = () => {
  const [selectedExercise, setSelectedExercise] = useState<typeof exercises[0] | null>(null);

  return (
    <>
      <section id="exercises" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Exercise Library
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Click any exercise to watch tutorial videos and learn proper form
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
                onClick={() => setSelectedExercise(exercise)}
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={exercise.image} 
                    alt={`${exercise.name} - Click to watch tutorial`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <PlayCircle className="w-16 h-16 text-white" />
                  </div>
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

      <Dialog open={!!selectedExercise} onOpenChange={() => setSelectedExercise(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedExercise && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedExercise.name}</DialogTitle>
                <DialogDescription>{selectedExercise.description}</DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="aspect-video w-full">
                  <iframe
                    width="100%"
                    height="100%"
                    src={selectedExercise.videoUrl}
                    title={`${selectedExercise.name} tutorial`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded-lg"
                  ></iframe>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Target Muscles</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedExercise.muscles.map((muscle, i) => (
                        <Badge key={i} variant="secondary">
                          {muscle}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Difficulty</h3>
                    <Badge className={difficultyColors[selectedExercise.difficulty as keyof typeof difficultyColors]}>
                      {selectedExercise.difficulty}
                    </Badge>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Recommended Sets & Reps</h3>
                  <p className="text-muted-foreground">{selectedExercise.sets}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Step-by-Step Instructions</h3>
                  <ol className="space-y-2">
                    {selectedExercise.instructions.map((instruction, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                          {i + 1}
                        </span>
                        <span className="text-muted-foreground">{instruction}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ExerciseLibrary;
