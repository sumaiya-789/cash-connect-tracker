
import React from 'react';
import { format } from 'date-fns';
import { Progress } from '@/components/ui/progress';
import { Flag, Calendar, PiggyBank } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  calculateProgressPercentage,
  calculateSuggestedMonthlySavings,
  getPriorityColor,
  getPriorityBadgeBg
} from '@/utils/goalUtils';

const GoalsList = ({ goals }) => {
  if (!goals || goals.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        <PiggyBank className="w-12 h-12 mx-auto text-gray-400 mb-3" />
        <p>No financial goals yet. Add your first goal to start tracking!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {goals.map((goal) => {
        const progressPercent = calculateProgressPercentage(goal.savedAmount, goal.targetAmount);
        const monthlySavings = calculateSuggestedMonthlySavings(goal.targetAmount - goal.savedAmount, goal.deadline);
        const deadlineDate = new Date(goal.deadline);
        const priorityClass = getPriorityColor(goal.priority);
        const priorityBadgeClass = getPriorityBadgeBg(goal.priority);

        return (
          <Card key={goal.id} className="overflow-hidden border-l-4" style={{ borderLeftColor: priorityClass.replace('text', 'bg') }}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium">{goal.name}</h3>
                <span className={`text-xs rounded-full px-2 py-1 ${priorityBadgeClass}`}>
                  {goal.priority}
                </span>
              </div>
              
              <div className="mt-2 text-sm text-gray-600">
                <div className="flex items-center gap-2 mb-1">
                  <PiggyBank className="h-4 w-4" /> 
                  <span>
                    ${goal.savedAmount} saved of ${goal.targetAmount} target 
                    ({((goal.savedAmount / goal.targetAmount) * 100).toFixed(1)}%)
                  </span>
                </div>
                
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="h-4 w-4" />
                  <span>Due by {format(deadlineDate, "PPP")}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Flag className="h-4 w-4" />
                  <span>Suggested monthly savings: <strong>${monthlySavings}</strong></span>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex justify-between mb-1 text-xs">
                  <span>Progress</span>
                  <span>{progressPercent.toFixed(0)}%</span>
                </div>
                <Progress value={progressPercent} className="h-2" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default GoalsList;
