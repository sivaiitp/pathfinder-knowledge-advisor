
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, HelpCircle } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { QuizQuestion } from '@/services/quizService';

interface QuizProps {
  questions: QuizQuestion[];
  onComplete: (score: number, responses: Array<{
    questionId: string;
    userAnswer: string;
    isCorrect: boolean;
  }>) => void;
}

const Quiz: React.FC<QuizProps> = ({ questions, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  
  const currentQuestion = questions[currentQuestionIndex];
  const progress = (currentQuestionIndex + 1) / questions.length * 100;
  
  const handleAnswerSelect = (answer: string) => {
    if (!isReviewing) {
      setSelectedAnswers(prev => ({
        ...prev,
        [currentQuestionIndex]: answer
      }));
    }
  };

  const isCurrentQuestionAnswered = selectedAnswers[currentQuestionIndex] !== undefined;
  const isCorrect = isCurrentQuestionAnswered && 
                   selectedAnswers[currentQuestionIndex] === currentQuestion.correctAnswer;

  const handleNext = () => {
    if (!isCurrentQuestionAnswered && !isReviewing) {
      toast.error("Please select an answer before proceeding");
      return;
    }
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowExplanation(false);
    } else if (!isReviewing) {
      // All questions answered, calculate score
      const score = Object.entries(selectedAnswers).reduce((total, [index, answer]) => {
        const question = questions[parseInt(index)];
        return total + (answer === question.correctAnswer ? 1 : 0);
      }, 0);
      
      const scorePercentage = Math.round((score / questions.length) * 100);
      
      const responses = Object.entries(selectedAnswers).map(([index, answer]) => {
        const question = questions[parseInt(index)];
        return {
          questionId: question.id || index,
          userAnswer: answer,
          isCorrect: answer === question.correctAnswer
        };
      });
      
      // Call the parent's onComplete function with the score and responses
      onComplete(scorePercentage, responses);
      
      // Start review mode
      setIsReviewing(true);
      setCurrentQuestionIndex(0);
      setShowExplanation(true);
      toast.success(`Assessment completed! Your score: ${score}/${questions.length} (${scorePercentage}%)`);
    } else {
      // End of review
      toast.info("You've completed the review of all questions");
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      if (isReviewing) setShowExplanation(true);
    }
  };

  const toggleExplanation = () => {
    if (isReviewing || isCurrentQuestionAnswered) {
      setShowExplanation(prev => !prev);
    } else {
      toast.error("Please select an answer to see the explanation");
    }
  };

  const getDifficultyLabel = (level: number) => {
    switch (level) {
      case 1: return "Easy";
      case 2: return "Medium";
      case 3: return "Hard";
      default: return "Medium";
    }
  };

  const getDifficultyColor = (level: number) => {
    switch (level) {
      case 1: return "text-green-600";
      case 2: return "text-yellow-600";
      case 3: return "text-red-600";
      default: return "text-yellow-600";
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">
            {isReviewing ? "Review Mode" : "Technical Assessment"}
          </CardTitle>
          <span className="text-sm text-muted-foreground">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
        </div>
        <CardDescription className="flex items-center justify-between">
          <span>Topic: <span className="capitalize font-medium">{currentQuestion.topic}</span></span>
          <span className={`${getDifficultyColor(currentQuestion.difficulty)} font-medium`}>
            {getDifficultyLabel(currentQuestion.difficulty)}
          </span>
        </CardDescription>
        <Progress value={progress} className="h-2" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-lg font-medium">{currentQuestion.question}</div>
        
        <RadioGroup 
          value={selectedAnswers[currentQuestionIndex]} 
          onValueChange={handleAnswerSelect}
          className="space-y-3"
        >
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswers[currentQuestionIndex] === option;
            const isCorrectOption = option === currentQuestion.correctAnswer;
            
            let optionClassName = "rounded-lg border p-3 flex items-center space-x-3 cursor-pointer";
            
            if (isReviewing || (isSelected && showExplanation)) {
              if (isCorrectOption) {
                optionClassName += " border-green-500 bg-green-50";
              } else if (isSelected && !isCorrectOption) {
                optionClassName += " border-red-500 bg-red-50";
              }
            } else if (isSelected) {
              optionClassName += " border-brand-500 bg-brand-50";
            } else {
              optionClassName += " hover:bg-muted";
            }
            
            return (
              <div key={index} className={optionClassName}>
                <RadioGroupItem 
                  id={`option-${index}`} 
                  value={option} 
                  disabled={isReviewing}
                  className="mt-0"
                />
                <Label 
                  htmlFor={`option-${index}`} 
                  className="flex-1 cursor-pointer font-normal"
                >
                  {option}
                </Label>
                
                {(isReviewing || showExplanation) && isSelected && (
                  <span className="ml-2">
                    {isCorrectOption ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                  </span>
                )}
              </div>
            );
          })}
        </RadioGroup>
        
        {(showExplanation || isReviewing) && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium flex items-center">
              <HelpCircle className="h-4 w-4 mr-2 text-blue-600" />
              Explanation:
            </h4>
            <p className="mt-1 text-gray-700">{currentQuestion.explanation}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>
          
          {(isCurrentQuestionAnswered || isReviewing) && (
            <Button 
              variant="outline"
              onClick={toggleExplanation}
            >
              {showExplanation ? "Hide Explanation" : "Show Explanation"}
            </Button>
          )}
        </div>
        
        <Button onClick={handleNext}>
          {currentQuestionIndex < questions.length - 1 ? "Next" : (isReviewing ? "Finish Review" : "Complete")}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Quiz;
