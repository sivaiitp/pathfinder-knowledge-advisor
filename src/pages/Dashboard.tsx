import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle2,
  Clock,
  Code,
  FileText,
  LayoutGrid,
  Network,
  Brain,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import AssessmentSetup from "@/components/AssessmentSetup";
import Quiz from "@/components/Quiz";
import { useAuth } from "@/contexts/AuthContext";
import { generateQuiz, saveQuizResults, saveQuizQuestions, checkUserAssessment, QuizQuestion } from "@/services/quizService";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

// Define interfaces for our data structures
interface Topic {
  name: string;
  completed: boolean;
}

interface RoadmapSection {
  id: number;
  title: string;
  completed: number;
  total: number;
  topics: Topic[];
}

interface PracticeProblem {
  id: number;
  title: string;
  difficulty: string;
  tags: string[];
  completed: boolean;
  companyRelevance: string;
}

const Dashboard = () => {
  const [progress, setProgress] = useState(0);
  const { user } = useAuth();
  const [hasCompletedAssessment, setHasCompletedAssessment] = useState<boolean | null>(null);
  const [isLoadingAssessment, setIsLoadingAssessment] = useState(true);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [currentView, setCurrentView] = useState<'dashboard' | 'setup' | 'quiz'>('dashboard');
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [roadmapData, setRoadmapData] = useState<RoadmapSection[]>([]);
  const [practiceProblems, setPracticeProblems] = useState<PracticeProblem[]>([]);
  const [userInfoLoading, setUserInfoLoading] = useState(true);
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
          // After confirming assessment is done, load roadmap data and practice problems
          fetchRoadmapData();
          fetchPracticeProblems();
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
  
  // Fetch roadmap data from database
  const fetchRoadmapData = async () => {
    // For now, we'll use mock data since the database doesn't have a roadmap table yet
    // In a future iteration, this would be replaced with actual database queries
    const mockRoadmap = [
      {
        id: 1,
        title: "Data Structures",
        completed: 3,
        total: 8,
        topics: [
          { name: "Arrays & Strings", completed: true },
          { name: "Linked Lists", completed: true },
          { name: "Stacks & Queues", completed: true },
          { name: "Trees & Graphs", completed: false },
          { name: "Heaps", completed: false },
          { name: "Hash Tables", completed: false },
          { name: "Tries", completed: false },
          { name: "Advanced Data Structures", completed: false },
        ]
      },
      {
        id: 2,
        title: "Algorithms",
        completed: 2,
        total: 8,
        topics: [
          { name: "Searching Algorithms", completed: true },
          { name: "Sorting Algorithms", completed: true },
          { name: "Recursion", completed: false },
          { name: "Dynamic Programming", completed: false },
          { name: "Greedy Algorithms", completed: false },
          { name: "Backtracking", completed: false },
          { name: "Graph Algorithms", completed: false },
          { name: "Bit Manipulation", completed: false },
        ]
      },
      {
        id: 3,
        title: "System Design",
        completed: 0,
        total: 5,
        topics: [
          { name: "System Design Basics", completed: false },
          { name: "Scalability", completed: false },
          { name: "API Design", completed: false },
          { name: "Database Design", completed: false },
          { name: "Caching & Load Balancing", completed: false },
        ]
      },
      {
        id: 4,
        title: "Behavioral",
        completed: 0,
        total: 3,
        topics: [
          { name: "Leadership Principles", completed: false },
          { name: "Common Questions", completed: false },
          { name: "Situational Examples", completed: false },
        ]
      },
    ];
    
    setRoadmapData(mockRoadmap);
    
    // Calculate overall progress based on completed topics
    const totalTopics = mockRoadmap.reduce((acc, section) => acc + section.total, 0);
    const completedTopics = mockRoadmap.reduce((acc, section) => acc + section.completed, 0);
    
    setProgress(Math.round((completedTopics / totalTopics) * 100));
  };
  
  // Fetch practice problems from database
  const fetchPracticeProblems = async () => {
    // For now, we'll use mock data since the database doesn't have a practice problems table yet
    // In a future iteration, this would be replaced with actual database queries
    const mockProblems = [
      {
        id: 1,
        title: "Two Sum",
        difficulty: "Easy",
        tags: ["Arrays", "Hash Table"],
        completed: true,
        companyRelevance: "High"
      },
      {
        id: 2,
        title: "Merge Two Sorted Lists",
        difficulty: "Easy",
        tags: ["Linked List", "Recursion"],
        completed: false,
        companyRelevance: "High"
      },
      {
        id: 3,
        title: "Valid Parentheses",
        difficulty: "Easy",
        tags: ["Stack", "String"],
        completed: true,
        companyRelevance: "Medium"
      },
      {
        id: 4,
        title: "LRU Cache",
        difficulty: "Medium",
        tags: ["Hash Table", "Linked List", "Design"],
        completed: false,
        companyRelevance: "High"
      },
      {
        id: 5,
        title: "Number of Islands",
        difficulty: "Medium",
        tags: ["DFS", "BFS", "Union Find"],
        completed: false,
        companyRelevance: "High"
      },
    ];
    
    setPracticeProblems(mockProblems);
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
      const assessmentId = await saveQuizResults(user.id, score, responses);
      
      if (assessmentId) {
        setHasCompletedAssessment(true);
        
        // After saving assessment, load roadmap data and practice problems
        fetchRoadmapData();
        fetchPracticeProblems();
        
        // Give the user some time to review their answers before returning to dashboard
        setTimeout(() => {
          setCurrentView('dashboard');
          toast.success("Assessment results saved successfully!");
        }, 5000);
      } else {
        toast.error("Failed to save assessment results.");
      }
    } catch (error) {
      console.error("Error saving quiz results:", error);
      toast.error("Failed to save your assessment results.");
    }
  };
  
  const renderContent = () => {
    if (isLoadingAssessment) {
      return (
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto"></div>
            <p className="mt-4 text-lg">Loading your assessment status...</p>
          </div>
        </div>
      );
    }
    
    if (currentView === 'setup') {
      return <AssessmentSetup onStartQuiz={handleStartQuiz} isLoading={isGeneratingQuiz} />;
    }
    
    if (currentView === 'quiz') {
      return <Quiz questions={quizQuestions} onComplete={handleQuizComplete} />;
    }
    
    // Default dashboard view
    return (
      <>
        {!hasCompletedAssessment && (
          <Card className="mb-8 border-brand-200 bg-brand-50">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="mr-2 h-5 w-5 text-brand-600" />
                Technical Assessment Required
              </CardTitle>
              <CardDescription>
                Complete a short assessment to help us create your personalized interview roadmap
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Before we can create a tailored roadmap for your interview preparation, we need to assess your
                current skill level. This will help us identify areas where you need to focus.
              </p>
              <Button 
                onClick={handleStartAssessment}
                className="bg-brand-600 hover:bg-brand-700"
              >
                Start Assessment
              </Button>
            </CardContent>
          </Card>
        )}
        
        {hasCompletedAssessment && (
          <>
            {/* Progress Section */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Overall Progress</CardTitle>
                <CardDescription>
                  Track your interview preparation progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">
                      {progress}% Complete
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {roadmapData.reduce((acc, section) => acc + section.completed, 0)}/
                      {roadmapData.reduce((acc, section) => acc + section.total, 0)} topics
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  Based on your interview date, you should complete 2 more topics this week.
                </p>
              </CardFooter>
            </Card>

            {/* Roadmap & Practice Tabs */}
            <Tabs defaultValue="roadmap" className="space-y-4">
              <TabsList>
                <TabsTrigger value="roadmap" className="flex items-center gap-2">
                  <LayoutGrid className="h-4 w-4" />
                  <span>Roadmap</span>
                </TabsTrigger>
                <TabsTrigger value="practice" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Practice Problems</span>
                </TabsTrigger>
              </TabsList>
              
              {/* Roadmap Content */}
              <TabsContent value="roadmap" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {roadmapData.map((section) => (
                    <Card key={section.id} className="card-hover">
                      <CardHeader>
                        <CardTitle>{section.title}</CardTitle>
                        <CardDescription>
                          {section.completed}/{section.total} topics completed
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Progress 
                          value={(section.completed / section.total) * 100} 
                          className="h-2 mb-4" 
                        />
                        <ul className="space-y-2">
                          {section.topics.map((topic, index) => (
                            <li key={index} className="flex items-center">
                              {topic.completed ? (
                                <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                              ) : (
                                <div className="mr-2 h-4 w-4 rounded-full border border-gray-300" />
                              )}
                              <span className={topic.completed ? "line-through text-muted-foreground" : ""}>
                                {topic.name}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant="outline" 
                          className="w-full border-brand-500 text-brand-600 hover:bg-brand-50"
                        >
                          Start Learning
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              {/* Practice Problems Content */}
              <TabsContent value="practice" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Recommended Practice Problems</CardTitle>
                    <CardDescription>
                      Based on your role and target company
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {practiceProblems.map((problem) => (
                        <div 
                          key={problem.id} 
                          className="p-4 border border-gray-100 rounded-lg flex items-center justify-between"
                        >
                          <div>
                            <div className="flex items-center mb-1">
                              <h4 className="font-medium">
                                {problem.title}
                              </h4>
                              {problem.completed && (
                                <span className="ml-3 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                  Completed
                                </span>
                              )}
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <span className={`mr-2 px-2 py-0.5 rounded-full text-xs ${
                                problem.difficulty === "Easy" ? "bg-green-100 text-green-700" : 
                                problem.difficulty === "Medium" ? "bg-yellow-100 text-yellow-700" :
                                "bg-red-100 text-red-700"
                              }`}>
                                {problem.difficulty}
                              </span>
                              {problem.tags.map((tag, i) => (
                                <span key={i} className="mr-2">{tag}{i < problem.tags.length - 1 ? "," : ""}</span>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center">
                            <span className={`text-xs mr-4 px-2 py-1 rounded-full ${
                              problem.companyRelevance === "High" ? "bg-brand-100 text-brand-700" :
                              "bg-gray-100 text-gray-700"
                            }`}>
                              {problem.companyRelevance} relevance
                            </span>
                            <Button 
                              size="sm" 
                              variant={problem.completed ? "outline" : "default"}
                              className={problem.completed ? 
                                "border-brand-500 text-brand-600 hover:bg-brand-50" : 
                                "bg-brand-600 hover:bg-brand-700"}
                            >
                              {problem.completed ? "Review" : "Solve"}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Your Personalized Interview Roadmap
          </h1>
          <div className="flex items-center justify-between flex-wrap">
            <div className="flex items-center gap-x-6 mt-2">
              <div className="flex items-center">
                <Code className="mr-2 h-5 w-5 text-brand-600" />
                <span>{userInfo.role}</span>
              </div>
              <div className="flex items-center">
                <Network className="mr-2 h-5 w-5 text-brand-600" />
                <span>{userInfo.company}</span>
              </div>
              <div className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-brand-600" />
                <span>{userInfo.daysLeft} days until interview</span>
              </div>
            </div>
            <div className="mt-4 sm:mt-0">
              <Button className="bg-brand-600 hover:bg-brand-700">
                Update Preferences
              </Button>
            </div>
          </div>
        </div>

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
