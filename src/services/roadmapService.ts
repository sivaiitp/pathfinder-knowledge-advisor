
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

export interface LearningTopic {
  id: string;
  title: string;
  description: string | null;
  category: string;
  difficulty: number;
  created_at: string;
  completed?: boolean; // Used when joining with user_progress
}

export interface UserProgress {
  id: string;
  user_id: string;
  topic_id: string;
  completed: boolean;
  started_at: string;
  completed_at: string | null;
}

export interface RoadmapSection {
  id: string;
  title: string;
  completed: number;
  total: number;
  topics: {
    id: string;
    name: string;
    completed: boolean;
    description?: string | null;
  }[];
}

// Fetch learning topics and user progress
export const fetchUserRoadmap = async (userId: string): Promise<RoadmapSection[] | null> => {
  try {
    // Fetch all topics
    const { data: topicsData, error: topicsError } = await supabase
      .from('learning_topics')
      .select('*')
      .order('difficulty', { ascending: true });

    if (topicsError) throw topicsError;
    
    // Fetch user progress for these topics
    const { data: progressData, error: progressError } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId);
    
    if (progressError) throw progressError;
    
    // Create a map of topic_id -> completed status
    const topicProgressMap = new Map();
    progressData?.forEach(progress => {
      topicProgressMap.set(progress.topic_id, progress.completed);
    });
    
    // Group topics by category and build roadmap sections
    const categoriesMap = new Map<string, LearningTopic[]>();
    
    topicsData?.forEach(topic => {
      if (!categoriesMap.has(topic.category)) {
        categoriesMap.set(topic.category, []);
      }
      
      // Add completed status to topic
      const topicWithProgress = {
        ...topic,
        completed: topicProgressMap.has(topic.id) ? topicProgressMap.get(topic.id) : false
      };
      
      categoriesMap.get(topic.category)?.push(topicWithProgress);
    });
    
    // Convert map to array of roadmap sections
    const roadmap: RoadmapSection[] = [];
    
    categoriesMap.forEach((topics, category) => {
      const completedCount = topics.filter(topic => topic.completed).length;
      
      roadmap.push({
        id: category.toLowerCase().replace(/\s+/g, '-'),
        title: category,
        completed: completedCount,
        total: topics.length,
        topics: topics.map(topic => ({
          id: topic.id,
          name: topic.title,
          completed: topic.completed || false,
          description: topic.description
        }))
      });
    });
    
    return roadmap;
  } catch (error: any) {
    console.error('Error fetching roadmap:', error);
    toast.error('Failed to load your learning roadmap');
    return null;
  }
};

// Update user progress for a specific topic
export const updateTopicProgress = async (userId: string, topicId: string, completed: boolean): Promise<boolean> => {
  try {
    // Check if there's already a progress entry for this topic
    const { data: existingProgress } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('topic_id', topicId)
      .maybeSingle();
    
    if (existingProgress) {
      // Update existing progress
      const { error } = await supabase
        .from('user_progress')
        .update({ 
          completed,
          completed_at: completed ? new Date().toISOString() : null
        })
        .eq('id', existingProgress.id);
      
      if (error) throw error;
    } else {
      // Create new progress entry
      const { error } = await supabase
        .from('user_progress')
        .insert({
          user_id: userId,
          topic_id: topicId,
          completed,
          completed_at: completed ? new Date().toISOString() : null
        });
      
      if (error) throw error;
    }
    
    return true;
  } catch (error: any) {
    console.error('Error updating topic progress:', error);
    toast.error('Failed to update your progress');
    return false;
  }
};
