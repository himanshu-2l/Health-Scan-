/**
 * Reusable Questionnaire Component
 * For PHQ-9, GAD-7, and other mental health assessments
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

export interface Question {
  id: string;
  text: string;
  options: { value: number; label: string }[];
}

interface QuestionnaireProps {
  title: string;
  description: string;
  questions: Question[];
  answers: number[];
  onAnswerChange: (questionIndex: number, value: number) => void;
  currentQuestion?: number;
}

export const Questionnaire: React.FC<QuestionnaireProps> = ({
  title,
  description,
  questions,
  answers,
  onAnswerChange,
  currentQuestion
}) => {
  const progress = questions.length > 0 
    ? ((answers.filter(a => a !== undefined && a !== null).length / questions.length) * 100)
    : 0;

  return (
    <Card className="bg-white shadow-md border-l-4 border-blue-600">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-white">
        <CardTitle className="text-gray-900">{title}</CardTitle>
        <CardDescription className="text-gray-600">{description}</CardDescription>
        <Progress value={progress} className="mt-4" />
        <p className="text-sm text-gray-600 mt-2">
          {answers.filter(a => a !== undefined && a !== null).length} of {questions.length} questions answered
        </p>
      </CardHeader>
      <CardContent className="bg-white space-y-6">
        {questions.map((question, index) => {
          const isCurrent = currentQuestion === undefined || currentQuestion === index;
          const isAnswered = answers[index] !== undefined && answers[index] !== null;

          return (
            <div
              key={question.id}
              className={`p-4 rounded-lg border-2 transition-all ${
                isCurrent && !isAnswered
                  ? 'border-blue-500 bg-blue-50'
                  : isAnswered
                  ? 'border-green-300 bg-green-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <Label className="text-base font-semibold text-gray-900 mb-3 block">
                {index + 1}. {question.text}
              </Label>
              <RadioGroup
                value={answers[index]?.toString() || ''}
                onValueChange={(value) => onAnswerChange(index, parseInt(value))}
                className="mt-3"
              >
                <div className="space-y-2">
                  {question.options.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value.toString()} id={`${question.id}-${option.value}`} />
                      <Label
                        htmlFor={`${question.id}-${option.value}`}
                        className="text-gray-700 cursor-pointer flex-1"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

