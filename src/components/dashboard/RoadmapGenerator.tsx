
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Network } from "lucide-react";

interface RoadmapGeneratorProps {
  onGenerateRoadmap: () => void;
  isGenerating: boolean;
}

const RoadmapGenerator: React.FC<RoadmapGeneratorProps> = ({ onGenerateRoadmap, isGenerating }) => {
  return (
    <Card className="mb-8 border-brand-200 bg-brand-50">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Network className="mr-2 h-5 w-5 text-brand-600" />
          Generate Your Personalized Roadmap
        </CardTitle>
        <CardDescription>
          Create a customized learning roadmap based on your assessment results
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          We'll analyze your assessment results and create a personalized roadmap tailored to your target role
          and company. This will help you focus your preparation on the areas that matter most.
        </p>
        <Button 
          onClick={onGenerateRoadmap}
          className="bg-brand-600 hover:bg-brand-700"
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Roadmap"
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default RoadmapGenerator;
