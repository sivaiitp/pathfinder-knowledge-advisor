
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

export interface QuizQuestion {
  id?: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: number;
  topic: string;
}

export interface QuizResponse {
  questionId: string;
  userAnswer: string;
  isCorrect: boolean;
}

export interface AssessmentResult {
  id: string;
  userId: string;
  score: number;
  completed: boolean;
  createdAt: string;
}

// Check if a user has completed the assessment
export const checkUserAssessment = async (userId: string): Promise<{ id: string; score: number } | null> => {
  try {
    const { data, error } = await supabase
      .from('user_assessments')
      .select('*')
      .eq('user_id', userId)
      .eq('completed', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;
    
    // Handle the type correctly with a type assertion
    return {
      id: (data as any).id,
      score: (data as any).score
    };
  } catch (error: any) {
    console.error('Error checking assessment:', error);
    return null;
  }
};

// Generate a quiz based on user preferences
export const generateQuiz = async (userPreferences: {
  userLevel: string;
  targetCompany: string;
  role: string;
  topics?: string[];
  questionsCount?: number;
}) => {
  try {
    const { data, error } = await supabase.functions.invoke('generate-quiz', {
      body: userPreferences
    });

    if (error) throw error;
    return data.quiz as QuizQuestion[];
  } catch (error: any) {
    console.error('Error generating quiz:', error);
    toast.error('Failed to generate quiz: ' + (error.message || 'Unknown error'));
    return [];
  }
};

// Save assessment result and quiz responses
export const saveQuizResults = async (
  userId: string,
  score: number,
  responses: QuizResponse[]
): Promise<string | null> => {
  try {
    // First create assessment record
    const { data: assessmentData, error: assessmentError } = await supabase
      .from('user_assessments')
      .insert({
        user_id: userId,
        score,
        completed: true
      })
      .select()
      .single();
    
    if (assessmentError) throw assessmentError;
    if (!assessmentData) throw new Error('Failed to create assessment record');
    
    // Type assertion to handle the id property
    const assessmentId = (assessmentData as any).id as string;
    
    // Then save all the user responses
    const userResponses = responses.map(response => ({
      assessment_id: assessmentId,
      question_id: response.questionId,
      user_answer: response.userAnswer,
      is_correct: response.isCorrect
    }));
    
    const { error: responsesError } = await supabase
      .from('user_quiz_responses')
      .insert(userResponses);
    
    if (responsesError) throw responsesError;
    
    return assessmentId;
  } catch (error: any) {
    console.error('Error saving quiz results:', error);
    toast.error('Failed to save quiz results');
    return null;
  }
};

// Save AI-generated questions to the database
export const saveQuizQuestions = async (questions: QuizQuestion[]): Promise<QuizQuestion[] | null> => {
  try {
    // Map the QuizQuestion objects to match the database schema
    const dbQuestions = questions.map(q => ({
      question_text: q.question,
      options: q.options,
      correct_answer: q.correctAnswer,
      explanation: q.explanation,
      difficulty: q.difficulty,
      topic: q.topic
    }));
    
    const { data, error } = await supabase
      .from('quiz_questions')
      .insert(dbQuestions)
      .select();
    
    if (error) throw error;
    if (!data) return null;
    
    // Map the database results back to QuizQuestion objects with proper type assertions
    return (data as any[]).map(item => ({
      id: item.id,
      question: item.question_text,
      options: item.options,
      correctAnswer: item.correct_answer,
      explanation: item.explanation || "",
      difficulty: item.difficulty,
      topic: item.topic
    }));
  } catch (error: any) {
    console.error('Error saving quiz questions:', error);
    toast.error('Failed to save quiz questions');
    return null;
  }
};
