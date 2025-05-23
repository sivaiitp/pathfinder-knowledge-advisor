
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
    const { userId, assessmentId, targetCompany, targetRole, count } = await req.json();
    const { data: client } = await (req as any).getSupabaseClient();

    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    // Fetch assessment data
    const { data: assessmentData, error: assessmentError } = await client
      .from('user_assessments')
      .select('id, score')
      .eq('id', assessmentId)
      .single();

    if (assessmentError) throw assessmentError;

    // Fetch the user's quiz responses
    const { data: quizResponses, error: responsesError } = await client
      .from('user_quiz_responses')
      .select('question_id, is_correct')
      .eq('assessment_id', assessmentId);

    if (responsesError) throw responsesError;

    // Fetch the questions to understand which topics they struggled with
    const questionIds = quizResponses.map((r: any) => r.question_id);
    
    const { data: quizQuestions, error: questionsError } = await client
      .from('quiz_questions')
      .select('id, topic')
      .in('id', questionIds);

    if (questionsError) throw questionsError;
    
    // Analyze topic performance
    const topicResults = new Map();
    
    quizResponses.forEach((r: any) => {
      const matchingQuestion = quizQuestions.find((q: any) => q.id === r.question_id);
      if (!matchingQuestion) return;
      
      const topic = matchingQuestion.topic;
      if (!topicResults.has(topic)) {
        topicResults.set(topic, { correct: 0, total: 0 });
      }
      
      const result = topicResults.get(topic);
      result.total += 1;
      if (r.is_correct) {
        result.correct += 1;
      }
    });
    
    // Find weaker areas to focus on
    const weakerTopics = Array.from(topicResults.entries())
      .filter(([_, counts]: [string, any]) => (counts.correct / counts.total) < 0.7)
      .map(([topic, _]) => topic);
    
    // Build the prompt for OpenAI
    const prompt = {
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an expert interview preparation system. Your task is to generate tailored practice problems for a candidate preparing for a technical interview. Each problem should have a title, description, difficulty level ("Easy", "Medium", "Hard"), relevant tags, and company relevance level.`
        },
        {
          role: "user",
          content: `
Generate ${count || 5} technical interview practice problems for a candidate with the following profile:

Target role: ${targetRole}
${targetCompany ? `Target company: ${targetCompany}` : ''}
Overall assessment score: ${assessmentData.score}%
${weakerTopics.length > 0 ? `Weaker areas: ${weakerTopics.join(', ')}` : ''}

For each problem provide:
1. title: A clear, descriptive name for the problem
2. description: A detailed problem statement that includes requirements and examples
3. difficulty: One of "Easy", "Medium", or "Hard"
4. tags: Array of relevant topics/concepts (e.g., "Arrays", "Dynamic Programming")
5. company_relevance: How relevant this problem is to the target company ("Low", "Medium", "High")

Format your response as a JSON object with an array of problems:
{
  "problems": [
    {
      "title": "Problem name",
      "description": "Detailed problem description with examples",
      "difficulty": "Easy|Medium|Hard",
      "tags": ["Topic1", "Topic2"],
      "company_relevance": "Low|Medium|High"
    },
    ...
  ]
}

Ensure the problems:
- Focus on weaker areas when available
- Are realistic and relevant to the target role and company
- Have varying difficulty levels appropriate for the candidate's skill level
- Have clear, detailed descriptions with examples
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
    
    const problemsData = JSON.parse(jsonMatch[0]);

    return new Response(JSON.stringify(problemsData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in generate-practice-problems function:', error);
    
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
