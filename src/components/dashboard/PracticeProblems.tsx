
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PracticeProblem } from "@/services/practiceService";

interface PracticeProblemsProps {
  problems: PracticeProblem[];
  isLoading: boolean;
  onGenerateProblems: () => Promise<void>;
  onProblemAction: (problemId: string, completed: boolean) => Promise<void>;
}

const PracticeProblems: React.FC<PracticeProblemsProps> = ({ 
  problems, 
  isLoading, 
  onGenerateProblems,
  onProblemAction
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recommended Practice Problems</CardTitle>
          <CardDescription>
            Based on your role and target company
          </CardDescription>
        </div>
        {problems.length > 0 && (
          <Button 
            size="sm" 
            onClick={onGenerateProblems}
            variant="outline"
            className="border-brand-500 text-brand-600 hover:bg-brand-50"
          >
            Generate More
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
          </div>
        ) : problems.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No practice problems available yet.</p>
            <Button 
              onClick={onGenerateProblems}
              className="bg-brand-600 hover:bg-brand-700"
            >
              Generate Problems
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {problems.map((problem) => (
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
                    onClick={() => onProblemAction(problem.id, !problem.completed)}
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
        )}
      </CardContent>
    </Card>
  );
};

export default PracticeProblems;
