import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

export interface PracticeProblem {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  tags: string[];
  solution: string | null;
  companyRelevance: string;
}

export interface UserProblemAttempt {
  id: string;
  problemId: string;
  userId: string;
  codeSubmission: string | null;
  completed: boolean;
  submittedAt: string;
}

// Fetch user's practice problems from the database
export const fetchUserPracticeProblems = async (userId: string): Promise<PracticeProblem[] | null> => {
  try {
    // Fetch user's completed problems
    const { data: completedProblems, error: completedError } = await supabase
      .from('user_problem_attempts')
      .select('problem_id')
      .eq('user_id', userId)
      .eq('completed', true);
    
    if (completedError) {
      console.error("Error fetching completed problems:", completedError);
      return null;
    }
    
    // Create a set of completed problem IDs for quick lookup
    const completedProblemIds = new Set(completedProblems?.map(item => item.problem_id));
    
    // Fetch all practice problems
    const { data: problemsData, error: problemsError } = await supabase
      .from('practice_problems')
      .select('*');
    
    if (problemsError) {
      console.error("Error fetching practice problems:", problemsError);
      return null;
    }
    
    if (!problemsData) return null;
    
    // Transform the problems data into PracticeProblem objects
    return (problemsData as any[]).map((problem): PracticeProblem => ({
      id: problem.id,
      title: problem.title,
      description: problem.description,
      difficulty: problem.difficulty,
      tags: problem.tags || [],
      solution: problem.solution || null,
      companyRelevance: problem.company_relevance || ''
    }));
  } catch (error: any) {
    console.error('Error fetching user practice problems:', error);
    toast.error('Failed to load practice problems');
    return null;
  }
};

// Update problem completion status in the database
export const updateProblemProgress = async (userId: string, problemId: string, completed: boolean): Promise<boolean> => {
  try {
    // We need to insert into user_problem_attempts table
    const { error } = await supabase
      .from('user_problem_attempts')
      .upsert({
        user_id: userId,
        problem_id: problemId,
        completed,
        submitted_at: completed ? new Date().toISOString() : null
      });
    
    if (error) throw error;
    return true;
  } catch (error: any) {
    console.error('Error updating problem progress:', error);
    toast.error('Failed to update problem progress');
    return false;
  }
};

// Generate personalized practice problems using AI based on the user's assessment results
export const generatePracticeProblems = async (
  userId: string,
  assessmentId: string,
  targetCompany: string,
  targetRole: string,
  count: number = 5
): Promise<PracticeProblem[] | null> => {
  try {
    // Call the edge function to generate the problems
    const { data: problemsData, error } = await supabase.functions.invoke('generate-problems', {
      body: {
        userId,
        assessmentId,
        targetCompany,
        targetRole,
        count
      }
    });
    
    if (error) throw error;
    
    if (!problemsData || !problemsData.problems) {
      throw new Error('Invalid response format from AI');
    }
    
    // Map the problems to include proper structure
    const dbProblems = problemsData.problems.map((problem: any) => ({
      title: problem.title,
      description: problem.description,
      difficulty: problem.difficulty || "Medium",
      tags: problem.tags || [],
      solution: problem.solution || null,
      company_relevance: problem.company_relevance || targetCompany
    }));
    
    // Next, store all the practice problems
    const { data, error: problemsError } = await supabase
      .from('practice_problems')
      .insert(dbProblems)
      .select();
    
    if (problemsError) throw problemsError;
    if (!data) return null;
    
    // Map the database results to PracticeProblem objects
    return (data as any[]).map((item): PracticeProblem => ({
      id: item.id,
      title: item.title,
      description: item.description,
      difficulty: item.difficulty,
      tags: item.tags || [],
      solution: item.solution || null,
      companyRelevance: item.company_relevance || ''
    }));
  } catch (error: any) {
    console.error('Error generating AI practice problems:', error);
    toast.error('Failed to generate practice problems');
    return null;
  }
};
