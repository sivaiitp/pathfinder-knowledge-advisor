
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RoadmapSection } from "@/services/roadmapService";

interface UserProgressProps {
  progress: number;
  roadmapData: RoadmapSection[];
}

const UserProgress: React.FC<UserProgressProps> = ({ progress, roadmapData }) => {
  const completedTopics = roadmapData.reduce((acc, section) => acc + section.completed, 0);
  const totalTopics = roadmapData.reduce((acc, section) => acc + section.total, 0);
  
  return (
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
              {completedTopics}/{totalTopics} topics
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
  );
};

export default UserProgress;
