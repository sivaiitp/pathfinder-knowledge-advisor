
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

export interface LearningTopic {
  id: string;
  name: string;
  description?: string | null;
  completed: boolean;
}

export interface RoadmapSection {
  id: string;
  title: string;
  topics: LearningTopic[];
  completed: number;
  total: number;
}

// Fetch user's learning roadmap from the database
export const fetchUserRoadmap = async (userId: string): Promise<RoadmapSection[] | null> => {
  try {
    // Fetch AI-generated roadmap metadata for the user
    const { data: roadmapData, error: roadmapError } = await supabase
      .from('ai_generated_roadmaps')
      .select('id, target_role, target_company, interview_date')
      .eq('user_id', userId);
    
    if (roadmapError) throw roadmapError;
    if (!roadmapData || roadmapData.length === 0) return [];
    
    // Fetch learning topics for each roadmap
    const roadmapSections: RoadmapSection[] = [];
    
    for (const roadmap of roadmapData) {
      if (!roadmap || typeof roadmap !== 'object') continue;
      
      // Safely access the roadmap ID
      const roadmapId = roadmap.id;
      if (!roadmapId) continue; // Skip if roadmap id is missing
      
      // Query user_progress to get learning topics with completion status
      const { data: userProgressData, error: progressError } = await supabase
        .from('user_progress')
        .select(`
          completed,
          topic_id,
          learning_topics:topic_id(id, title, description, category, difficulty)
        `)
        .eq('user_id', userId);
      
      if (progressError) {
        console.error("Error fetching user progress:", progressError);
        continue;
      }
      
      // Create a map of topic_id -> completed status
      const topicCompletionMap = new Map();
      if (userProgressData) {
        userProgressData.forEach((progress: any) => {
          if (progress.topic_id && progress.learning_topics) {
            topicCompletionMap.set(progress.topic_id, progress.completed);
          }
        });
      }
      
      // Get all learning topics
      const { data: topicsData, error: topicsError } = await supabase
        .from('learning_topics')
        .select('*');
      
      if (topicsError) {
        console.error("Error fetching learning topics:", topicsError);
        continue;
      }
      
      if (!topicsData) continue;
      
      // Transform the topics data into LearningTopic objects
      const learningTopics: LearningTopic[] = (topicsData as any[]).map((topic) => ({
        id: topic.id,
        name: topic.title,
        description: topic.description,
        completed: topicCompletionMap.has(topic.id) ? topicCompletionMap.get(topic.id) : false
      }));
      
      // Calculate completed and total topics
      const completedTopics = learningTopics.filter(topic => topic.completed).length;
      const totalTopics = learningTopics.length;
      
      // Add the roadmap section to the result
      if (roadmap && 'target_role' in roadmap) {
        roadmapSections.push({
          id: roadmapId,
          title: roadmap.target_role || "Custom Roadmap",
          topics: learningTopics,
          completed: completedTopics,
          total: totalTopics
        });
      } else {
        roadmapSections.push({
          id: roadmapId,
          title: "Custom Roadmap",
          topics: learningTopics,
          completed: completedTopics,
          total: totalTopics
        });
      }
    }
    
    return roadmapSections;
  } catch (error: any) {
    console.error('Error fetching user roadmap:', error);
    toast.error('Failed to load your learning roadmap');
    return null;
  }
};

// Update topic completion status in the database
export const updateTopicProgress = async (userId: string, topicId: string, completed: boolean): Promise<boolean> => {
  try {
    // We need to insert into user_progress table
    const { error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: userId,
        topic_id: topicId,
        completed,
        completed_at: completed ? new Date().toISOString() : null
      });
    
    if (error) throw error;
    return true;
  } catch (error: any) {
    console.error('Error updating topic progress:', error);
    toast.error('Failed to update topic progress');
    return false;
  }
};

// Generate a personalized roadmap using AI based on the user's assessment results
export const generateAIRoadmap = async (options: {
  userId: string;
  assessmentId: string;
  targetRole: string;
  targetCompany?: string;
  interviewDate?: string;
}): Promise<{ success: boolean; roadmapId?: string }> => {
  try {
    // Call the edge function to generate the roadmap
    const { data: roadmapData, error } = await supabase.functions.invoke('generate-roadmap', {
      body: options
    });
    
    if (error) throw error;
    
    if (!roadmapData || !roadmapData.topics) {
      throw new Error('Invalid response format from AI');
    }
    
    // First, store the roadmap metadata
    const { data: roadmapRecord, error: roadmapError } = await supabase
      .from('ai_generated_roadmaps')
      .insert({
        user_id: options.userId,
        assessment_id: options.assessmentId,
        target_role: options.targetRole,
        target_company: options.targetCompany || null,
        interview_date: options.interviewDate ? new Date(options.interviewDate).toISOString() : null
      })
      .select()
      .single();
      
    if (roadmapError) throw roadmapError;
    if (!roadmapRecord || typeof roadmapRecord !== 'object') throw new Error('Failed to create roadmap record');
    
    // Ensure roadmapRecord.id exists before using it
    if (!('id' in roadmapRecord) || !roadmapRecord.id) {
      throw new Error('Invalid roadmap ID');
    }
    
    const roadmapId = roadmapRecord.id;
    
    // Map the topics to include the roadmap ID and proper structure
    // Make sure to match the schema of the learning_topics table
    const dbTopics = roadmapData.topics.map((topic: any) => ({
      category: topic.category || "General",
      title: topic.title,
      description: topic.description || null,
      difficulty: topic.difficulty || 2
    }));
    
    // Next, store all the learning topics
    const { error: topicsError } = await supabase
      .from('learning_topics')
      .insert(dbTopics);
    
    if (topicsError) throw topicsError;
    
    // Return success
    return {
      success: true,
      roadmapId
    };
  } catch (error: any) {
    console.error('Error generating AI roadmap:', error);
    toast.error('Failed to generate your personalized roadmap');
    return { success: false };
  }
};
