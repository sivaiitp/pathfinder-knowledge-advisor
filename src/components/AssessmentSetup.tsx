
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";

interface AssessmentSetupProps {
  onStartQuiz: (preferences: {
    userLevel: string;
    targetCompany: string;
    role: string;
    topics: string[];
    questionsCount: number;
  }) => void;
  isLoading: boolean;
}

const AssessmentSetup: React.FC<AssessmentSetupProps> = ({ onStartQuiz, isLoading }) => {
  const [userLevel, setUserLevel] = useState("entry");
  const [targetCompany, setTargetCompany] = useState("");
  const [role, setRole] = useState("software engineer");
  const [questionsCount, setQuestionsCount] = useState(10);
  
  const [selectedTopics, setSelectedTopics] = useState({
    "data structures": true,
    "algorithms": true,
    "system design": true,
    "behavioral": false,
    "languages": false
  });

  const handleTopicChange = (topic: string) => {
    setSelectedTopics(prev => ({
      ...prev,
      [topic]: !prev[topic as keyof typeof prev]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!targetCompany) {
      toast.error("Please enter your target company");
      return;
    }

    const topics = Object.entries(selectedTopics)
      .filter(([_, isSelected]) => isSelected)
      .map(([topic]) => topic);

    if (topics.length === 0) {
      toast.error("Please select at least one topic");
      return;
    }

    onStartQuiz({
      userLevel,
      targetCompany,
      role,
      topics,
      questionsCount
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Assessment Setup</CardTitle>
        <CardDescription>
          Let's set up your personalized interview assessment. This will help us create a tailored roadmap for your preparation.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="level">Your Experience Level</Label>
            <Select value={userLevel} onValueChange={setUserLevel}>
              <SelectTrigger id="level">
                <SelectValue placeholder="Select your level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                <SelectItem value="mid">Mid Level (3-5 years)</SelectItem>
                <SelectItem value="senior">Senior Level (5+ years)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Target Company</Label>
            <Input 
              id="company" 
              placeholder="e.g., Google, Amazon, etc."
              value={targetCompany}
              onChange={e => setTargetCompany(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Target Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger id="role">
                <SelectValue placeholder="Select your target role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="software engineer">Software Engineer</SelectItem>
                <SelectItem value="frontend engineer">Frontend Engineer</SelectItem>
                <SelectItem value="backend engineer">Backend Engineer</SelectItem>
                <SelectItem value="fullstack engineer">Fullstack Engineer</SelectItem>
                <SelectItem value="mobile engineer">Mobile Engineer</SelectItem>
                <SelectItem value="devops engineer">DevOps Engineer</SelectItem>
                <SelectItem value="machine learning engineer">Machine Learning Engineer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Topics to Include</Label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(selectedTopics).map(([topic, isSelected]) => (
                <div key={topic} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`topic-${topic}`}
                    checked={isSelected}
                    onCheckedChange={() => handleTopicChange(topic)}
                  />
                  <Label htmlFor={`topic-${topic}`} className="capitalize">{topic}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="count">Number of Questions</Label>
            <Select value={questionsCount.toString()} onValueChange={(value) => setQuestionsCount(Number(value))}>
              <SelectTrigger id="count">
                <SelectValue placeholder="Select question count" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 Questions</SelectItem>
                <SelectItem value="10">10 Questions</SelectItem>
                <SelectItem value="15">15 Questions</SelectItem>
                <SelectItem value="20">20 Questions</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full bg-brand-600 hover:bg-brand-700" 
            disabled={isLoading}
          >
            {isLoading ? "Generating Quiz..." : "Start Assessment"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AssessmentSetup;
