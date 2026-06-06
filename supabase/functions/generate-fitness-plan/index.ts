import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { age, height, weight, heightUnit, weightUnit, goal } = await req.json();
    
    console.log('Received request:', { age, height, weight, heightUnit, weightUnit, goal });

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Convert to metric for BMI calculation
    let heightInCm = height;
    if (heightUnit === 'inches') {
      heightInCm = height * 2.54;
    }
    
    let weightInKg = weight;
    if (weightUnit === 'lbs') {
      weightInKg = weight * 0.453592;
    }

    const heightInM = heightInCm / 100;
    const bmi = (weightInKg / (heightInM * heightInM)).toFixed(1);

    const systemPrompt = `You are a certified fitness and nutrition expert. Generate personalized fitness and meal plans based on user data.

IMPORTANT: You must ONLY use these exercises in the workout plan:
- Push-ups
- Squats
- Plank
- Jumping Jacks
- Lunges
- Burpees

Return your response as a JSON object with this EXACT structure:
{
  "dietPlan": [
    {"meal": "Breakfast", "time": "7:00 AM", "food": "meal description", "calories": "number"},
    {"meal": "Mid-Morning Snack", "time": "10:00 AM", "food": "snack description", "calories": "number"},
    {"meal": "Lunch", "time": "1:00 PM", "food": "meal description", "calories": "number"},
    {"meal": "Evening Snack", "time": "4:00 PM", "food": "snack description", "calories": "number"},
    {"meal": "Dinner", "time": "7:00 PM", "food": "meal description", "calories": "number"}
  ],
  "exercisePlan": [
    {"day": "Monday", "exercise": "exercise name from allowed list", "sets": "number", "reps": "number or duration", "rest": "rest time"},
    {"day": "Monday", "exercise": "exercise name from allowed list", "sets": "number", "reps": "number or duration", "rest": "rest time"},
    ... more exercises for different days
  ],
  "summary": "Brief 2-3 sentence summary of the plan and expected results"
}

Provide 5 meals for diet plan and 5-7 exercises per week distributed across different days.`;

    const userPrompt = `Create a personalized fitness plan for someone with:
- Height: ${height} ${heightUnit}
- Weight: ${weight} ${weightUnit}
- BMI: ${bmi}
- Goal: ${goal || 'general fitness'}

Create a comprehensive plan that includes:
1. A daily meal plan with 5 meals (breakfast, mid-morning snack, lunch, evening snack, dinner) including timing, food items, and approximate calories
2. A weekly exercise routine using ONLY the allowed exercises (Push-ups, Squats, Plank, Jumping Jacks, Lunges, Burpees) with sets, reps, and rest periods
3. A brief summary of the plan

Ensure the plan is realistic, safe, and tailored to their BMI (${bmi}) and fitness goal.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits depleted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const planData = JSON.parse(data.choices[0].message.content);

    console.log('Successfully generated plan');

    return new Response(
      JSON.stringify({ plan: planData, bmi }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-fitness-plan:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
