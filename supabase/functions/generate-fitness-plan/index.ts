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
    const { height, weight, heightUnit, weightUnit, goal } = await req.json();
    
    console.log('Received request:', { height, weight, heightUnit, weightUnit, goal });

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

    const systemPrompt = `You are an expert fitness coach and nutritionist. Create a personalized fitness and meal plan based on the user's metrics. Be specific, practical, and motivating.`;

    const userPrompt = `Create a personalized fitness plan for someone with:
- Height: ${height} ${heightUnit}
- Weight: ${weight} ${weightUnit}
- BMI: ${bmi}
- Goal: ${goal || 'general fitness'}

Provide:
1. A brief fitness assessment
2. A weekly exercise schedule (7 days) with specific exercises and duration
3. A daily meal plan with breakfast, lunch, dinner, and snacks
4. Key nutrition tips

Format the response in a clear, structured way with sections clearly marked.`;

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
    const plan = data.choices[0].message.content;

    console.log('Successfully generated plan');

    return new Response(
      JSON.stringify({ plan, bmi }),
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
