/**
 * Smart Meal Planner for Diabetics Component
 * Regional Indian foods with cost awareness
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { 
  UtensilsCrossed, 
  MapPin,
  IndianRupee,
  TrendingDown,
  Lightbulb,
  Calendar,
} from 'lucide-react';
import {
  generateMealPlan,
  findCostAlternatives,
  getCostComparison,
  IndianRegion,
  MealPlan,
  MealItem,
} from '@/services/mealPlannerService';
import { format } from 'date-fns';

export const MealPlanner: React.FC = () => {
  const [region, setRegion] = useState<IndianRegion>('central');
  const [budgetPerDay, setBudgetPerDay] = useState<string>('150');
  const [targetCarbs, setTargetCarbs] = useState<string>('150');
  const [targetCalories, setTargetCalories] = useState<string>('1800');
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [selectedMeal, setSelectedMeal] = useState<MealItem | null>(null);

  const handleGeneratePlan = () => {
    const plans = generateMealPlan(
      region,
      parseFloat(budgetPerDay) || 150,
      parseFloat(targetCarbs) || 150,
      parseFloat(targetCalories) || 1800,
      7
    );
    setMealPlans(plans);
  };

  const getRegionLabel = (reg: IndianRegion): string => {
    const labels: Record<IndianRegion, string> = {
      'north': 'North India',
      'south': 'South India',
      'east': 'East India',
      'west': 'West India',
      'central': 'Central India',
      'northeast': 'Northeast India',
      'rajasthan': 'Rajasthan',
      'mp-chhattisgarh': 'MP & Chhattisgarh',
      'punjab-haryana': 'Punjab & Haryana',
    };
    return labels[reg];
  };

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-md border-l-4 border-orange-500 hover:shadow-lg transition-shadow">
      <CardHeader className="bg-gradient-to-r from-orange-50 to-white dark:from-orange-900/20 dark:to-gray-800 pb-3">
        <div className="flex items-center gap-2">
          <UtensilsCrossed className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          <CardTitle className="text-lg text-gray-900 dark:text-gray-100">
            Smart Meal Planner for Diabetics
          </CardTitle>
        </div>
        <CardDescription className="text-sm text-gray-700 dark:text-gray-300 mt-1">
          Personalized diabetic-friendly meals based on your region and budget
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        {/* Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 block">
              Region *
            </label>
            <Select value={region} onValueChange={(v: IndianRegion) => setRegion(v)}>
              <SelectTrigger className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:border-orange-500 focus:ring-orange-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="north">North India</SelectItem>
                <SelectItem value="south">South India</SelectItem>
                <SelectItem value="east">East India</SelectItem>
                <SelectItem value="west">West India</SelectItem>
                <SelectItem value="central">Central India</SelectItem>
                <SelectItem value="northeast">Northeast India</SelectItem>
                <SelectItem value="rajasthan">Rajasthan</SelectItem>
                <SelectItem value="mp-chhattisgarh">MP & Chhattisgarh</SelectItem>
                <SelectItem value="punjab-haryana">Punjab & Haryana</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 block">
              Daily Budget (₹) *
            </label>
            <Input
              type="number"
              value={budgetPerDay}
              onChange={(e) => setBudgetPerDay(e.target.value)}
              placeholder="150"
              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 border-gray-300 dark:border-gray-600 focus:border-orange-500 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 block">
              Target Carbs (g/day)
            </label>
            <Input
              type="number"
              value={targetCarbs}
              onChange={(e) => setTargetCarbs(e.target.value)}
              placeholder="150"
              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 border-gray-300 dark:border-gray-600 focus:border-orange-500 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 block">
              Target Calories (kcal/day)
            </label>
            <Input
              type="number"
              value={targetCalories}
              onChange={(e) => setTargetCalories(e.target.value)}
              placeholder="1800"
              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 border-gray-300 dark:border-gray-600 focus:border-orange-500 focus:ring-orange-500"
            />
          </div>
        </div>

        <Button
          onClick={handleGeneratePlan}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white"
          size="lg"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Generate 7-Day Meal Plan
        </Button>

        {/* Meal Plans */}
        {mealPlans.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 font-medium">
              <MapPin className="w-4 h-4" />
              <span>Region: <strong>{getRegionLabel(region)}</strong></span>
            </div>

            {mealPlans.map((plan, idx) => {
              return (
                <Card key={idx} className="bg-white dark:bg-gray-800 border-2 border-orange-200 dark:border-orange-800">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base text-gray-900 dark:text-gray-100">
                        {format(new Date(plan.date), 'EEEE, MMMM dd')}
                      </CardTitle>
                      <Badge className="bg-green-600 text-white">
                        Score: {plan.diabeticScore}/100
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Breakfast */}
                    {plan.breakfast.length > 0 && (
                      <div>
                        <div className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                          Breakfast
                        </div>
                        {plan.breakfast.map((meal) => (
                          <div
                            key={meal.id}
                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg mb-2"
                          >
                            <div className="flex-1">
                              <div className="font-medium text-gray-900 dark:text-gray-100">
                                {meal.name}
                                {meal.nameHindi && (
                                  <span className="text-sm text-gray-600 dark:text-gray-300 ml-2">
                                    ({meal.nameHindi})
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                                {meal.servingSize} • GI: {meal.glycemicIndex} • {meal.carbs}g carbs • {meal.calories} kcal
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className="bg-blue-600 text-white">
                                <IndianRupee className="w-3 h-3 mr-1" />
                                {meal.cost}
                              </Badge>
                              {meal.diabeticFriendly && (
                                <Badge className="bg-green-600 text-white">Diabetic-Friendly</Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Lunch */}
                    {plan.lunch.length > 0 && (
                      <div>
                        <div className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                          Lunch
                        </div>
                        {plan.lunch.map((meal) => (
                          <div
                            key={meal.id}
                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg mb-2"
                          >
                            <div className="flex-1">
                              <div className="font-medium text-gray-900 dark:text-gray-100">
                                {meal.name}
                                {meal.nameHindi && (
                                  <span className="text-sm text-gray-600 dark:text-gray-300 ml-2">
                                    ({meal.nameHindi})
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                                {meal.servingSize} • GI: {meal.glycemicIndex} • {meal.carbs}g carbs • {meal.calories} kcal
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className="bg-blue-600 text-white">
                                <IndianRupee className="w-3 h-3 mr-1" />
                                {meal.cost}
                              </Badge>
                              {meal.diabeticFriendly && (
                                <Badge className="bg-green-600 text-white">Diabetic-Friendly</Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Dinner */}
                    {plan.dinner.length > 0 && (
                      <div>
                        <div className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                          Dinner
                        </div>
                        {plan.dinner.map((meal) => {
                          const mealAlternatives = meal.alternatives 
                            ? findCostAlternatives(meal.id)
                            : [];
                          
                          return (
                            <div key={meal.id}>
                              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg mb-2">
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900 dark:text-gray-100">
                                    {meal.name}
                                    {meal.nameHindi && (
                                      <span className="text-sm text-gray-600 dark:text-gray-300 ml-2">
                                        ({meal.nameHindi})
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                                    {meal.servingSize} • GI: {meal.glycemicIndex} • {meal.carbs}g carbs • {meal.calories} kcal
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge className="bg-blue-600 text-white">
                                    <IndianRupee className="w-3 h-3 mr-1" />
                                    {meal.cost}
                                  </Badge>
                                  {meal.diabeticFriendly && (
                                    <Badge className="bg-green-600 text-white">Diabetic-Friendly</Badge>
                                  )}
                                </div>
                              </div>
                              
                              {/* Cost Alternatives */}
                              {mealAlternatives.length > 0 && (
                                <Alert className="border-green-500 bg-green-50 dark:bg-green-900/20">
                                  <TrendingDown className="h-4 w-4" />
                                  <AlertDescription>
                                    <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                                      💰 Cost-Effective Alternative:
                                    </div>
                                    {mealAlternatives.map((alt) => (
                                      <div key={alt.id} className="text-sm text-gray-700 dark:text-gray-300">
                                        {getCostComparison(meal, alt)}
                                      </div>
                                    ))}
                                  </AlertDescription>
                                </Alert>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Snacks */}
                    {plan.snacks.length > 0 && (
                      <div>
                        <div className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                          Snacks
                        </div>
                        {plan.snacks.map((meal) => (
                          <div
                            key={meal.id}
                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg mb-2"
                          >
                            <div className="flex-1">
                              <div className="font-medium text-gray-900 dark:text-gray-100">
                                {meal.name}
                                {meal.nameHindi && (
                                  <span className="text-sm text-gray-600 dark:text-gray-300 ml-2">
                                    ({meal.nameHindi})
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                                {meal.servingSize} • GI: {meal.glycemicIndex} • {meal.carbs}g carbs • {meal.calories} kcal
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className="bg-blue-600 text-white">
                                <IndianRupee className="w-3 h-3 mr-1" />
                                {meal.cost}
                              </Badge>
                              {meal.diabeticFriendly && (
                                <Badge className="bg-green-600 text-white">Diabetic-Friendly</Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Daily Summary */}
                    <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-xs text-gray-700 dark:text-gray-300 font-medium">Total Cost</div>
                          <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                            <IndianRupee className="w-4 h-4 inline" />
                            {plan.totalCost}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-700 dark:text-gray-300 font-medium">Total Carbs</div>
                          <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                            {plan.totalCarbs}g
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-700 dark:text-gray-300 font-medium">Total Calories</div>
                          <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                            {plan.totalCalories} kcal
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Info Alert */}
        <Alert className="border-blue-500 bg-blue-50 dark:bg-blue-900/20">
          <Lightbulb className="h-4 w-4" />
          <AlertDescription className="text-sm text-gray-700 dark:text-gray-300">
            <strong>Tip:</strong> All meals are selected from diabetic-friendly options with lower glycemic index. 
            Cost-effective alternatives are shown when available. Adjust portions based on your individual needs.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default MealPlanner;

