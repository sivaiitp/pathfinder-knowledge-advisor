
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2 } from "lucide-react";
import { RoadmapSection } from "@/services/roadmapService";

interface RoadmapViewProps {
  roadmapData: RoadmapSection[];
  isLoading: boolean;
  onTopicStatusChange: (topicId: string, completed: boolean) => Promise<void>;
}

const RoadmapView: React.FC<RoadmapViewProps> = ({ roadmapData, isLoading, onTopicStatusChange }) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  return (
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
              {section.topics.map((topic) => (
                <li key={topic.id} className="flex items-center">
                  <div
                    className="mr-2 cursor-pointer"
                    onClick={() => onTopicStatusChange(topic.id, !topic.completed)}
                  >
                    {topic.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border border-gray-300 hover:border-brand-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <span className={topic.completed ? "line-through text-muted-foreground" : ""}>
                      {topic.name}
                    </span>
                    {topic.description && (
                      <p className="text-xs text-gray-500 mt-0.5">{topic.description}</p>
                    )}
                  </div>
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
  );
};

export default RoadmapView;
