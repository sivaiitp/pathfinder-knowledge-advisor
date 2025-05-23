
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('OK', { headers: corsHeaders });
  }

  try {
    const { userId, assessmentId, targetRole, targetCompany, interviewDate } = await req.json();
    const { data: client } = await (req as any).getSupabaseClient();

    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    // Fetch assessment data to understand user's skill level
    const { data: assessmentData, error: assessmentError } = await client
      .from('user_assessments')
      .select('id, score, created_at')
      .eq('id', assessmentId)
      .single();

    if (assessmentError) throw assessmentError;

    // Fetch the user's quiz responses to understand their knowledge gaps
    const { data: quizResponses, error: responsesError } = await client
      .from('user_quiz_responses')
      .select('question_id, is_correct, user_answer')
      .eq('assessment_id', assessmentId);

    if (responsesError) throw responsesError;

    // Fetch the questions to understand which topics they struggled with
    const questionIds = quizResponses.map((r: any) => r.question_id);
    
    const { data: quizQuestions, error: questionsError } = await client
      .from('quiz_questions')
      .select('id, question_text, topic, difficulty')
      .in('id', questionIds);

    if (questionsError) throw questionsError;
    
    // Create a mapping to join responses with questions
    const questionsMap = new Map();
    quizQuestions.forEach((q: any) => {
      questionsMap.set(q.id, q);
    });
    
    // Analyze strengths and weaknesses
    const topicResults = new Map();
    quizResponses.forEach((r: any) => {
      const question = questionsMap.get(r.question_id);
      if (!question) return;
      
      if (!topicResults.has(question.topic)) {
        topicResults.set(question.topic, { correct: 0, total: 0 });
      }
      
      const result = topicResults.get(question.topic);
      result.total += 1;
      if (r.is_correct) {
        result.correct += 1;
      }
    });
    
    // Format topic results for the AI prompt
    const topicsAnalysis = Array.from(topicResults.entries()).map(([topic, counts]: [string, any]) => {
      const percentage = (counts.correct / counts.total) * 100;
      const level = percentage >= 70 ? 'Strong' : percentage >= 40 ? 'Average' : 'Weak';
      return { 
        topic,
        score: Math.round(percentage), 
        level,
        details: `${counts.correct}/${counts.total} questions answered correctly`
      };
    });

    // Build the prompt for OpenAI
    const prompt = {
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an expert interview preparation system. Your task is to generate a personalized learning roadmap for a candidate preparing for a technical interview. Focus on creating structured, actionable learning topics categorized by subject areas. Each topic should have a clear title, description, category, and difficulty level (1-3).`
        },
        {
          role: "user",
          content: `
Create a personalized technical interview preparation roadmap for a candidate with the following details:

Target role: ${targetRole}
${targetCompany ? `Target company: ${targetCompany}` : ''}
Overall assessment score: ${assessmentData.score}%
${interviewDate ? `Interview date: ${interviewDate} (prioritize accordingly)` : ''}

Knowledge assessment by topic:
${JSON.stringify(topicsAnalysis, null, 2)}

Based on this information:
1. Identify 15-20 learning topics grouped into 4-5 categories (like "Data Structures", "Algorithms", "System Design", etc.)
2. For each topic provide:
   - title: Clear concise name of the topic
   - description: Brief explanation of what needs to be learned
   - category: The broader subject area this belongs to
   - difficulty: Number from 1 (basic) to 3 (advanced)

Format your response as a JSON object with an array of topics:
{
  "topics": [
    {
      "title": "Topic name",
      "description": "Brief description",
      "category": "Category name", 
      "difficulty": 1-3
    },
    ...
  ]
}

Ensure the roadmap:
- Addresses weak areas thoroughly
- Builds on strengths
- Is appropriate for the target role and company
- Can be reasonably completed in the available time
`
        }
      ]
    };

    // Call OpenAI API
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(prompt)
    });

    const openAIData = await openAIResponse.json();
    
    if (!openAIData.choices || !openAIData.choices[0]) {
      throw new Error('Invalid response from OpenAI');
    }
    
    // Extract and parse the JSON from the AI's response
    const aiText = openAIData.choices[0].message.content;
    const jsonMatch = aiText.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('Could not extract valid JSON from OpenAI response');
    }
    
    const roadmapData = JSON.parse(jsonMatch[0]);

    return new Response(JSON.stringify(roadmapData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in generate-roadmap function:', error);
    
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
