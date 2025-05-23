
import React, { useState } from "react";
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
} from "lucide-react";
import Navbar from "@/components/Navbar";

const Dashboard = () => {
  const [progress, setProgress] = useState(28);
  
  // Sample data
  const userInfo = {
    name: "Alex",
    role: "Entry-Level Engineer",
    company: "Google",
    daysLeft: 14
  };
  
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

  // Practice problems based on user level and company
  const practiceProblems = [
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
                  {mockRoadmap.reduce((acc, section) => acc + section.completed, 0)}/
                  {mockRoadmap.reduce((acc, section) => acc + section.total, 0)} topics
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
              {mockRoadmap.map((section) => (
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
