
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

export interface AssessmentResult {
  id: string;
  userId: string;
  score: number;
  completed: boolean;
  createdAt: string;
}

// Check if a user has completed the assessment
export const checkUserAssessment = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_assessments')
      .select('*')
      .eq('user_id', userId)
      .eq('completed', true)
      .maybeSingle();

    if (error) throw error;
    return data;
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
  responses: Array<{
    questionId: string;
    userAnswer: string;
    isCorrect: boolean;
  }>
) => {
  try {
    // Create a new assessment record
    const { data, error } = await supabase
      .from('user_assessments')
      .insert([
        { user_id: userId, score, completed: true }
      ])
      .select();

    if (error) {
      toast.error('Failed to save assessment result');
      return null;
    }

    // Safely access the id property by first checking if data exists
    if (!data || data.length === 0) {
      toast.error('Failed to get assessment data');
      return null;
    }
    
    // Access the id field safely
    const assessmentId = data[0].id;
    
    if (!assessmentId) {
      toast.error('Failed to get valid assessment ID');
      return null;
    }

    const responsesWithAssessmentId = responses.map(response => ({
      assessment_id: assessmentId,
      question_id: response.questionId,
      user_answer: response.userAnswer,
      is_correct: response.isCorrect
    }));

    // Save the quiz responses
    const { error: responsesError } = await supabase
      .from('user_quiz_responses')
      .insert(responsesWithAssessmentId);

    if (responsesError) {
      toast.error('Failed to save quiz responses');
      return null;
    }

    return assessmentId;
  } catch (error: any) {
    console.error('Error saving quiz results:', error);
    toast.error('Failed to save quiz results: ' + (error.message || 'Unknown error'));
    return null;
  }
};

// Save AI-generated questions to the database
export const saveQuizQuestions = async (questions: QuizQuestion[]) => {
  try {
    const formattedQuestions = questions.map(q => ({
      question_text: q.question,
      options: q.options,
      correct_answer: q.correctAnswer,
      difficulty: q.difficulty,
      topic: q.topic
    }));

    // Insert questions into database
    const { data, error } = await supabase
      .from('quiz_questions')
      .insert(formattedQuestions)
      .select();

    if (error) {
      throw error;
    }
    
    if (!data || data.length === 0) {
      return questions; // Return the original questions if no data was returned
    }
    
    // Map the returned IDs to the original questions
    return questions.map((question, index) => {
      const questionWithId = { ...question };
      if (data[index]) {
        questionWithId.id = data[index].id;
      }
      return questionWithId;
    });
  } catch (error: any) {
    console.error('Error saving questions:', error);
    toast.error('Failed to save quiz questions');
    return questions; // Return the original questions without IDs
  }
};
