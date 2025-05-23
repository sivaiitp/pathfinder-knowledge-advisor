
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

export interface PracticeProblem {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  tags: string[];
  company_relevance: string;
  solution?: string | null;
  created_at: string;
  completed?: boolean; // Used when joining with user attempts
}

export interface UserProblemAttempt {
  id: string;
  user_id: string;
  problem_id: string;
  completed: boolean;
  code_submission: string | null;
  submitted_at: string;
}

// Fetch practice problems with user progress
export const fetchUserPracticeProblems = async (userId: string): Promise<PracticeProblem[] | null> => {
  try {
    // Fetch all practice problems
    const { data: problemsData, error: problemsError } = await supabase
      .from('practice_problems')
      .select('*')
      .order('difficulty');
    
    if (problemsError) throw problemsError;
    if (!problemsData) return [];
    
    // Fetch user attempts for these problems
    const { data: attemptsData, error: attemptsError } = await supabase
      .from('user_problem_attempts')
      .select('*')
      .eq('user_id', userId);
    
    if (attemptsError) throw attemptsError;
    
    // Create a map of problem_id -> completed status
    const problemAttemptsMap = new Map();
    if (attemptsData) {
      attemptsData.forEach((attempt: any) => {
        problemAttemptsMap.set(attempt.problem_id, attempt.completed);
      });
    }
    
    // Add completed status to each problem
    const problemsWithStatus = problemsData.map((problem: any) => ({
      ...problem,
      completed: problemAttemptsMap.has(problem.id) ? problemAttemptsMap.get(problem.id) : false
    }));
    
    return problemsWithStatus as PracticeProblem[];
  } catch (error: any) {
    console.error('Error fetching practice problems:', error);
    toast.error('Failed to load practice problems');
    return null;
  }
};

// Update user progress for a specific practice problem
export const updateProblemProgress = async (
  userId: string, 
  problemId: string, 
  completed: boolean,
  codeSubmission?: string
): Promise<boolean> => {
  try {
    // Check if there's already an attempt for this problem
    const { data: existingAttempt, error: selectError } = await supabase
      .from('user_problem_attempts')
      .select('*')
      .eq('user_id', userId)
      .eq('problem_id', problemId)
      .maybeSingle();
    
    if (selectError) throw selectError;
    
    if (existingAttempt) {
      // Update existing attempt
      const { error: updateError } = await supabase
        .from('user_problem_attempts')
        .update({ 
          completed,
          code_submission: codeSubmission || (existingAttempt.code_submission ?? null),
          submitted_at: new Date().toISOString()
        })
        .eq('id', existingAttempt.id);
      
      if (updateError) throw updateError;
    } else {
      // Create new attempt
      const { error: insertError } = await supabase
        .from('user_problem_attempts')
        .insert({
          user_id: userId,
          problem_id: problemId,
          completed,
          code_submission: codeSubmission || null
        });
      
      if (insertError) throw insertError;
    }
    
    return true;
  } catch (error: any) {
    console.error('Error updating problem progress:', error);
    toast.error('Failed to update your progress');
    return false;
  }
};

// Get a single practice problem by ID
export const getPracticeProblem = async (problemId: string): Promise<PracticeProblem | null> => {
  try {
    const { data, error } = await supabase
      .from('practice_problems')
      .select('*')
      .eq('id', problemId)
      .maybeSingle();
    
    if (error) throw error;
    if (!data) return null;
    
    return data as PracticeProblem;
  } catch (error: any) {
    console.error('Error fetching practice problem:', error);
    toast.error('Failed to load practice problem');
    return null;
  }
};

// Generate AI practice problems based on assessment results
export const generatePracticeProblems = async (
  userId: string,
  assessmentId: string,
  targetCompany: string,
  targetRole: string,
  count: number = 5
): Promise<PracticeProblem[] | null> => {
  try {
    // Call the edge function to generate practice problems
    const { data: problemsData, error } = await supabase.functions.invoke('generate-practice-problems', {
      body: { 
        userId,
        assessmentId,
        targetCompany,
        targetRole,
        count
      }
    });

    if (error) throw error;
    if (!problemsData || !problemsData.problems || !Array.isArray(problemsData.problems)) {
      throw new Error('Invalid response format from AI');
    }
    
    // Store the generated problems in the database
    const { error: insertError } = await supabase
      .from('practice_problems')
      .insert(problemsData.problems);
      
    if (insertError) throw insertError;
    
    // Return the newly created problems
    return problemsData.problems as PracticeProblem[];
  } catch (error: any) {
    console.error('Error generating practice problems:', error);
    toast.error('Failed to generate practice problems');
    return null;
  }
};
