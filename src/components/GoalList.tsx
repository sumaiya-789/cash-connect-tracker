
import React from 'react';
import { Goal, calculateProgress, calculateMonthlySavings, priorityColors } from '@/utils/goalUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useCurrency } from '@/contexts/CurrencyContext';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Flag, Goal as GoalIcon } from 'lucide-react';

interface GoalListProps {
  goals: Goal[];
  onUpdateGoal: (updatedGoal: Goal) => void;
  onDeleteGoal: (goalId: string) => void;
}

const GoalList: React.FC<GoalListProps> = ({ goals, onUpdateGoal, onDeleteGoal }) => {
  const { formatAmount } = useCurrency();
  
  if (goals.length === 0) {
    return (
      <div className="py-10 text-center text-gray-500">
        <GoalIcon className="mx-auto mb-4 h-12 w-12 opacity-50" />
        <p>No goals yet. Start by adding your first financial goal!</p>
      </div>
    );
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const handleContribute = (goal: Goal) => {
    const amount = window.prompt('Enter contribution amount:');
    if (amount === null) return;
    
    const contribution = parseFloat(amount);
    if (isNaN(contribution) || contribution <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    
    const updatedGoal = {
      ...goal,
      currentAmount: goal.currentAmount + contribution
    };
    
    onUpdateGoal(updatedGoal);
  };
  
  return (
    <div className="space-y-4">
      {goals.map((goal) => {
        const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
        const monthlySavingsNeeded = calculateMonthlySavings(
          goal.targetAmount,
          goal.currentAmount,
          goal.deadline
        );
        
        return (
          <Card key={goal.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-medium">{goal.name}</CardTitle>
                <div className={`px-2 py-1 text-xs rounded ${priorityColors[goal.priority]} text-white`}>
                  {goal.priority.charAt(0).toUpperCase() + goal.priority.slice(1)} Priority
                </div>
              </div>
              <div className="text-sm text-gray-500 flex items-center gap-1">
                <CalendarIcon className="h-3 w-3" />
                Due by {formatDate(goal.deadline)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="mt-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress: {progress.toFixed(0)}%</span>
                  <span>
                    {formatAmount(goal.currentAmount)} / {formatAmount(goal.targetAmount)}
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
                
                <div className="mt-4 text-sm text-gray-500">
                  Suggested monthly savings: {formatAmount(monthlySavingsNeeded)}
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleContribute(goal)}
                  >
                    Add Contribution
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => onDeleteGoal(goal.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default GoalList;
