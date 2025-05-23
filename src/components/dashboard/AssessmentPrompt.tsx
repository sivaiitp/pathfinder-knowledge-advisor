
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain } from "lucide-react";

interface AssessmentPromptProps {
  onStartAssessment: () => void;
}

const AssessmentPrompt: React.FC<AssessmentPromptProps> = ({ onStartAssessment }) => {
  return (
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
          onClick={onStartAssessment}
          className="bg-brand-600 hover:bg-brand-700"
        >
          Start Assessment
        </Button>
      </CardContent>
    </Card>
  );
};

export default AssessmentPrompt;
