/**
 * Health Score Card Component
 * Displays overall health score with breakdown and trends
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Activity,
  Brain,
  Heart,
  Smile,
  Eye,
  Coffee
} from 'lucide-react';
import { HealthScore, RiskLevel, TrendDirection } from '../types/health';

interface HealthScoreCardProps {
  healthScore: HealthScore;
  className?: string;
}

export const HealthScoreCard: React.FC<HealthScoreCardProps> = ({ 
  healthScore, 
  className = '' 
}) => {
  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-500';
    if (score >= 65) return 'text-yellow-500';
    if (score >= 50) return 'text-orange-500';
    return 'text-red-500';
  };

  const getScoreBgColor = (score: number): string => {
    if (score >= 80) return 'bg-green-500/20';
    if (score >= 65) return 'bg-yellow-500/20';
    if (score >= 50) return 'bg-orange-500/20';
    return 'bg-red-500/20';
  };

  const getRiskBadgeVariant = (risk: RiskLevel): "default" | "secondary" | "destructive" | "outline" => {
    switch (risk) {
      case 'low': return 'default';
      case 'medium': return 'secondary';
      case 'high': return 'destructive';
      case 'critical': return 'destructive';
      default: return 'outline';
    }
  };

  const getTrendIcon = (trend: TrendDirection) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'declining':
        return <TrendingDown className="w-5 h-5 text-red-500" />;
      case 'fluctuating':
        return <Activity className="w-5 h-5 text-yellow-500" />;
      default:
        return <Minus className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTrendLabel = (trend: TrendDirection): string => {
    switch (trend) {
      case 'improving': return 'Improving';
      case 'declining': return 'Declining';
      case 'fluctuating': return 'Fluctuating';
      default: return 'Stable';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'neurological':
        return <Brain className="w-4 h-4" />;
      case 'cardiovascular':
        return <Heart className="w-4 h-4" />;
      case 'mentalHealth':
        return <Smile className="w-4 h-4" />;
      case 'visionHearing':
        return <Eye className="w-4 h-4" />;
      case 'lifestyle':
        return <Coffee className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getCategoryLabel = (category: string): string => {
    switch (category) {
      case 'neurological': return 'Neurological';
      case 'cardiovascular': return 'Cardiovascular';
      case 'mentalHealth': return 'Mental Health';
      case 'visionHearing': return 'Vision/Hearing';
      case 'lifestyle': return 'Lifestyle';
      default: return category;
    }
  };

  return (
    <Card className={`${className} bg-white shadow-lg border-l-4 border-blue-600`}>
      <CardHeader className="bg-gradient-to-r from-blue-50 to-white">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Activity className="w-6 h-6 text-blue-600" />
              समग्र स्वास्थ्य स्कोर | Overall Health Score
            </CardTitle>
            <CardDescription className="text-gray-600">
              Last updated: {new Date(healthScore.lastUpdated).toLocaleDateString()}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {getTrendIcon(healthScore.trend)}
            <Badge variant={getRiskBadgeVariant(healthScore.riskLevel)}>
              {healthScore.riskLevel.toUpperCase()} RISK
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 bg-white">
        {/* Overall Score */}
        <div className="text-center space-y-4">
          <div className={`text-6xl font-bold ${getScoreColor(healthScore.overall)}`}>
            {healthScore.overall}
          </div>
          <div className="space-y-2">
            <Progress 
              value={healthScore.overall} 
              className="h-3"
            />
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              {getTrendIcon(healthScore.trend)}
              <span>{getTrendLabel(healthScore.trend)}</span>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm text-gray-600 uppercase tracking-wide">
            Category Breakdown
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(healthScore.breakdown)
              .filter(([category]) => category !== 'respiratory')
              .map(([category, score]) => (
                <div
                  key={category}
                  className={`p-4 rounded-lg ${getScoreBgColor(score)} border-2 border-gray-200 bg-white shadow-sm`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(category)}
                      <span className="text-sm font-medium text-gray-900">
                        {getCategoryLabel(category)}
                      </span>
                    </div>
                    <span className={`text-lg font-bold ${getScoreColor(score)}`}>
                      {score}
                    </span>
                  </div>
                  <Progress value={score} className="h-2" />
                </div>
              ))}
          </div>
        </div>

        {/* Recommendations */}
        {healthScore.recommendations.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-gray-600 uppercase tracking-wide">
              Recommendations
            </h4>
            <div className="space-y-2">
              {healthScore.recommendations.slice(0, 3).map((rec, index) => (
                <div
                  key={index}
                  className="text-sm p-3 rounded-md bg-blue-50 border-l-4 border-blue-600 text-gray-800"
                >
                  {rec}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

