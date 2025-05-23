
// No changes needed for the generate-quiz function
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not found');
    }

    const { userLevel, targetCompany, role, topics, questionsCount = 10 } = await req.json();
    
    if (!userLevel || !targetCompany || !role) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const systemPrompt = `
      You are an expert technical interviewer specializing in software engineering interviews.
      Generate a quiz to assess a ${userLevel} level candidate applying for a ${role} position at ${targetCompany}.
      The quiz should focus on these topics: ${topics || 'Data Structures, Algorithms, System Design'}.
      
      For each question:
      1. Provide a well-formulated question
      2. Provide exactly 4 possible answers
      3. Indicate which answer is correct
      4. Include a brief explanation for the correct answer
      5. Assign a difficulty level (1-3, where 1 is easy, 2 is medium, 3 is hard)
      
      Return the quiz as a JSON array with the following structure for each question:
      {
        "question": "The question text",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": "The correct option",
        "explanation": "Brief explanation of the correct answer",
        "difficulty": 2,
        "topic": "The topic this question covers"
      }

      IMPORTANT: Return ONLY the JSON array, without any surrounding text or comments.
    `;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Generate ${questionsCount} interview questions tailored for ${targetCompany} focusing on what they typically look for in ${role} candidates.` }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message || 'Error generating quiz');
    }
    
    // Parse the response content as JSON
    let quiz;
    try {
      const content = data.choices[0].message.content;
      // Sometimes GPT returns the JSON with markdown code blocks
      const jsonContent = content.replace(/```json|```/g, '').trim();
      quiz = JSON.parse(jsonContent);
      
      // Log success for debugging
      console.log(`Successfully parsed quiz with ${quiz.length} questions`);
    } catch (error) {
      console.error('Error parsing quiz JSON:', error);
      console.log('Raw content:', data.choices[0].message.content);
      throw new Error('Failed to parse quiz data');
    }

    return new Response(
      JSON.stringify({ quiz }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'An unexpected error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
