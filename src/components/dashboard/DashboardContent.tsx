
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, LayoutGrid } from "lucide-react";
import { PracticeProblem } from "@/services/practiceService";
import { RoadmapSection } from "@/services/roadmapService";

import UserProgress from './UserProgress';
import RoadmapView from './RoadmapView';
import PracticeProblems from './PracticeProblems';
import AssessmentPrompt from './AssessmentPrompt';
import RoadmapGenerator from './RoadmapGenerator';

interface DashboardContentProps {
  hasCompletedAssessment: boolean | null;
  isLoadingAssessment: boolean;
  isGeneratingRoadmap: boolean;
  roadmapData: RoadmapSection[];
  isLoadingRoadmap: boolean;
  progress: number;
  practiceProblems: PracticeProblem[];
  isLoadingProblems: boolean;
  onStartAssessment: () => void;
  onGenerateRoadmap: () => void;
  onGenerateProblems: () => Promise<void>;
  onTopicStatusChange: (topicId: string, completed: boolean) => Promise<void>;
  onProblemAction: (problemId: string, completed: boolean) => Promise<void>;
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  hasCompletedAssessment,
  isLoadingAssessment,
  isGeneratingRoadmap,
  roadmapData,
  isLoadingRoadmap,
  progress,
  practiceProblems,
  isLoadingProblems,
  onStartAssessment,
  onGenerateRoadmap,
  onGenerateProblems,
  onTopicStatusChange,
  onProblemAction
}) => {
  
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
  
  return (
    <>
      {!hasCompletedAssessment && (
        <AssessmentPrompt onStartAssessment={onStartAssessment} />
      )}
      
      {hasCompletedAssessment && roadmapData.length === 0 && !isLoadingRoadmap && (
        <RoadmapGenerator 
          onGenerateRoadmap={onGenerateRoadmap}
          isGenerating={isGeneratingRoadmap}
        />
      )}
      
      {hasCompletedAssessment && roadmapData.length > 0 && (
        <>
          <UserProgress progress={progress} roadmapData={roadmapData} />

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
            
            <TabsContent value="roadmap" className="space-y-4">
              <RoadmapView 
                roadmapData={roadmapData}
                isLoading={isLoadingRoadmap}
                onTopicStatusChange={onTopicStatusChange}
              />
            </TabsContent>
            
            <TabsContent value="practice" className="space-y-4">
              <PracticeProblems 
                problems={practiceProblems}
                isLoading={isLoadingProblems}
                onGenerateProblems={onGenerateProblems}
                onProblemAction={onProblemAction}
              />
            </TabsContent>
          </Tabs>
        </>
      )}
    </>
  );
};

export default DashboardContent;
