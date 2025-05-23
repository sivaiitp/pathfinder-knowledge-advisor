import React, { useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";
import AssessmentSetup from "@/components/AssessmentSetup";
import Quiz from "@/components/Quiz";
import { useAuth } from "@/contexts/AuthContext";
import { generateQuiz, saveQuizResults, saveQuizQuestions, checkUserAssessment, QuizQuestion } from "@/services/quizService";
import { fetchUserRoadmap, updateTopicProgress, RoadmapSection, generateAIRoadmap } from "@/services/roadmapService";
import { fetchUserPracticeProblems, updateProblemProgress, PracticeProblem, generatePracticeProblems } from "@/services/practiceService";

// Import the refactored components
import UserHeader from "@/components/dashboard/UserHeader";
import DashboardContent from "@/components/dashboard/DashboardContent";

const Dashboard = () => {
  const [progress, setProgress] = useState(0);
  const { user } = useAuth();
  const [hasCompletedAssessment, setHasCompletedAssessment] = useState<boolean | null>(null);
  const [isLoadingAssessment, setIsLoadingAssessment] = useState(true);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);
  const [currentView, setCurrentView] = useState<'dashboard' | 'setup' | 'quiz'>('dashboard');
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [roadmapData, setRoadmapData] = useState<RoadmapSection[]>([]);
  const [practiceProblems, setPracticeProblems] = useState<PracticeProblem[]>([]);
  const [isLoadingRoadmap, setIsLoadingRoadmap] = useState(false);
  const [isLoadingProblems, setIsLoadingProblems] = useState(false);
  const [userInfoLoading, setUserInfoLoading] = useState(true);
  const [latestAssessment, setLatestAssessment] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState({
    name: "",
    role: "",
    company: "",
    daysLeft: 14
  });
  
  useEffect(() => {
    const checkAssessment = async () => {
      if (user) {
        setIsLoadingAssessment(true);
        const assessment = await checkUserAssessment(user.id);
        setHasCompletedAssessment(!!assessment);
        
        if (assessment) {
          setLatestAssessment(assessment.id);
          // After confirming assessment is done, load roadmap data and practice problems
          loadUserRoadmap();
          loadPracticeProblems();
        }
        
        setIsLoadingAssessment(false);
      }
    };
    
    const fetchUserInfo = async () => {
      if (user) {
        try {
          setUserInfoLoading(true);
          // Use the user metadata if available
          const name = user.user_metadata?.full_name || "User";
          const role = user.user_metadata?.role || "Software Engineer";
          const company = user.user_metadata?.company || "Not specified";
          const daysLeft = user.user_metadata?.daysLeft || 14;
          
          setUserInfo({
            name,
            role,
            company,
            daysLeft
          });
        } catch (error) {
          console.error("Error fetching user info:", error);
        } finally {
          setUserInfoLoading(false);
        }
      }
    };
    
    checkAssessment();
    fetchUserInfo();
  }, [user]);
  
  // Load roadmap data from the database
  const loadUserRoadmap = async () => {
    if (!user) return;
    
    try {
      setIsLoadingRoadmap(true);
      const roadmap = await fetchUserRoadmap(user.id);
      
      if (roadmap) {
        setRoadmapData(roadmap);
        
        // Calculate overall progress based on completed topics
        const totalTopics = roadmap.reduce((acc, section) => acc + section.total, 0);
        const completedTopics = roadmap.reduce((acc, section) => acc + section.completed, 0);
        
        setProgress(Math.round((completedTopics / totalTopics) * 100));
      }
    } catch (error) {
      console.error("Error loading roadmap:", error);
      toast.error("Failed to load your learning roadmap");
    } finally {
      setIsLoadingRoadmap(false);
    }
  };
  
  // Load practice problems from the database
  const loadPracticeProblems = async () => {
    if (!user) return;
    
    try {
      setIsLoadingProblems(true);
      const problems = await fetchUserPracticeProblems(user.id);
      
      if (problems) {
        setPracticeProblems(problems);
      }
    } catch (error) {
      console.error("Error loading practice problems:", error);
      toast.error("Failed to load practice problems");
    } finally {
      setIsLoadingProblems(false);
    }
  };
  
  // Generate a personalized roadmap using AI
  const generatePersonalizedRoadmap = async () => {
    if (!user || !latestAssessment) {
      toast.error("Assessment information not available");
      console.error("Cannot generate roadmap: missing user or assessment ID", {
        user: user?.id,
        assessmentId: latestAssessment
      });
      return;
    }

    try {
      setIsGeneratingRoadmap(true);
      toast.info("Generating your personalized roadmap...");
      
      console.log('Generating roadmap with data:', {
        userId: user.id,
        assessmentId: latestAssessment,
        targetRole: userInfo.role,
        targetCompany: userInfo.company !== "Not specified" ? userInfo.company : undefined,
        interviewDate: new Date(Date.now() + (userInfo.daysLeft * 24 * 60 * 60 * 1000)).toISOString()
      });
      
      const result = await generateAIRoadmap({
        userId: user.id,
        assessmentId: latestAssessment,
        targetRole: userInfo.role,
        targetCompany: userInfo.company !== "Not specified" ? userInfo.company : undefined,
        interviewDate: new Date(Date.now() + (userInfo.daysLeft * 24 * 60 * 60 * 1000)).toISOString()
      });
      
      if (result.success) {
        console.log('Roadmap generated successfully:', result);
        toast.success("Personalized roadmap created!");
        
        // Generate practice problems also
        await generatePersonalizedProblems();
        
        // Reload the roadmap data to show new topics
        loadUserRoadmap();
      } else {
        console.error('Roadmap generation failed:', result);
        toast.error("Failed to create personalized roadmap");
      }
    } catch (error) {
      console.error("Error generating roadmap:", error);
      toast.error("Failed to create personalized roadmap");
    } finally {
      setIsGeneratingRoadmap(false);
    }
  };
  
  // Generate personalized practice problems using AI
  const generatePersonalizedProblems = async () => {
    if (!user || !latestAssessment) {
      toast.error("Assessment information not available");
      return;
    }

    try {
      toast.info("Generating practice problems...");
      
      const problems = await generatePracticeProblems(
        user.id,
        latestAssessment,
        userInfo.company !== "Not specified" ? userInfo.company : "Generic",
        userInfo.role,
        5 // Generate 5 problems by default
      );
      
      if (problems) {
        toast.success("Practice problems created!");
        
        // Reload problems
        loadPracticeProblems();
      }
    } catch (error) {
      console.error("Error generating problems:", error);
      toast.error("Failed to create practice problems");
    }
  };
  
  const handleTopicStatusChange = async (topicId: string, completed: boolean) => {
    if (!user) {
      toast.error("You need to be logged in to track progress");
      return;
    }
    
    const success = await updateTopicProgress(user.id, topicId, completed);
    
    if (success) {
      // Refresh roadmap data to update the UI
      loadUserRoadmap();
      toast.success(completed ? "Topic marked as complete!" : "Topic marked as incomplete");
    }
  };
  
  const handleProblemAction = async (problemId: string, completed: boolean) => {
    if (!user) {
      toast.error("You need to be logged in to track progress");
      return;
    }
    
    const success = await updateProblemProgress(user.id, problemId, completed);
    
    if (success) {
      // Refresh practice problem data to update the UI
      loadPracticeProblems();
      toast.success(completed ? "Problem marked as complete!" : "You can try this problem again");
    }
  };
  
  const handleStartAssessment = () => {
    setCurrentView('setup');
  };
  
  const handleStartQuiz = async (preferences: {
    userLevel: string;
    targetCompany: string;
    role: string;
    topics: string[];
    questionsCount: number;
  }) => {
    try {
      setIsGeneratingQuiz(true);
      const questions = await generateQuiz(preferences);
      
      if (questions && questions.length > 0) {
        // Save the generated questions to the database
        const questionsWithIds = await saveQuizQuestions(questions);
        // Ensure the questionsWithIds is of type QuizQuestion[]
        setQuizQuestions(questionsWithIds as QuizQuestion[]);
        setCurrentView('quiz');
      } else {
        toast.error("Failed to generate quiz questions. Please try again.");
      }
    } catch (error) {
      console.error("Error starting quiz:", error);
      toast.error("An error occurred while generating the quiz.");
    } finally {
      setIsGeneratingQuiz(false);
    }
  };
  
  const handleQuizComplete = async (score: number, responses: Array<{
    questionId: string;
    userAnswer: string;
    isCorrect: boolean;
  }>) => {
    if (!user) {
      toast.error("User not authenticated");
      return;
    }
    
    try {
      console.log('Quiz completed. Saving results:', {
        user: user.id,
        score,
        responsesCount: responses.length
      });
      
      const assessmentId = await saveQuizResults(user.id, score, responses);
      
      if (assessmentId) {
        console.log('Assessment saved successfully with ID:', assessmentId);
        setHasCompletedAssessment(true);
        setLatestAssessment(assessmentId);
        
        // Switch back to dashboard and show roadmap generation option
        setCurrentView('dashboard');
        toast.success("Assessment completed! Score: " + score + "%");
        
        // Automatically start generating the roadmap
        setTimeout(() => {
          console.log('Automatically generating roadmap with assessment ID:', assessmentId);
          generatePersonalizedRoadmap();
        }, 1500);
      } else {
        console.error('Failed to save assessment - no assessment ID returned');
        toast.error("Failed to save assessment results.");
      }
    } catch (error) {
      console.error("Error saving quiz results:", error);
      toast.error("Failed to save your assessment results.");
    }
  };
  
  const renderContent = () => {
    if (currentView === 'setup') {
      return <AssessmentSetup onStartQuiz={handleStartQuiz} isLoading={isGeneratingQuiz} />;
    }
    
    if (currentView === 'quiz') {
      return <Quiz questions={quizQuestions} onComplete={handleQuizComplete} />;
    }
    
    // Default dashboard view
    return (
      <DashboardContent
        hasCompletedAssessment={hasCompletedAssessment}
        isLoadingAssessment={isLoadingAssessment}
        isGeneratingRoadmap={isGeneratingRoadmap}
        roadmapData={roadmapData}
        isLoadingRoadmap={isLoadingRoadmap}
        progress={progress}
        practiceProblems={practiceProblems}
        isLoadingProblems={isLoadingProblems}
        onStartAssessment={handleStartAssessment}
        onGenerateRoadmap={generatePersonalizedRoadmap}
        onGenerateProblems={generatePersonalizedProblems}
        onTopicStatusChange={handleTopicStatusChange}
        onProblemAction={handleProblemAction}
      />
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <UserHeader userInfo={userInfo} />
        {renderContent()}
      </main>

      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} PrepPath. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
