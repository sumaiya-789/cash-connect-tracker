
import React from "react";
import { Goal, calculateProgress, calculateSuggestedMonthlySaving } from "@/utils/goalUtils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Target } from "lucide-react";
import { useAppContext } from "@/context/AppContext";

interface GoalItemProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDelete: (goalId: string) => void;
  onUpdateAmount: (goalId: string, amount: number) => void;
}

const GoalItem: React.FC<GoalItemProps> = ({ goal, onEdit, onDelete, onUpdateAmount }) => {
  const { currencySymbol } = useAppContext();
  const progress = calculateProgress(goal);
  const monthlySavings = calculateSuggestedMonthlySaving(goal);
  
  // Format deadline
  const deadlineDate = new Date(goal.deadline);
  const formattedDeadline = deadlineDate.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
  
  // Determine priority color
  const priorityColors = {
    low: "bg-blue-200 dark:bg-blue-900 text-blue-900 dark:text-blue-200",
    medium: "bg-orange-200 dark:bg-orange-900 text-orange-900 dark:text-orange-200",
    high: "bg-red-200 dark:bg-red-900 text-red-900 dark:text-red-200"
  };
  
  // Handle contribution
  const handleContribute = () => {
    const amount = window.prompt(`How much would you like to add to "${goal.name}"?`, "");
    if (amount === null) return;
    
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert("Please enter a valid positive number.");
      return;
    }
    
    onUpdateAmount(goal.id, goal.currentAmount + numAmount);
  };

  return (
    <Card className="border-2 transition-all hover:border-primary dark:border-gray-700 dark:hover:border-primary">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">{goal.name}</h3>
            <div className="flex items-center space-x-2">
              <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[goal.priority]}`}>
                {goal.priority.charAt(0).toUpperCase() + goal.priority.slice(1)}
              </span>
              <span className="text-sm text-muted-foreground">Due {formattedDeadline}</span>
            </div>
          </div>
          <div className="flex space-x-1">
            <Button variant="ghost" size="icon" onClick={() => onEdit(goal)}>
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(goal.id)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span>Progress:</span>
            <span className="font-semibold">{currencySymbol}{goal.currentAmount} of {currencySymbol}{goal.targetAmount}</span>
          </div>
          
          <Progress 
            value={progress} 
            className="h-2" 
          />
          
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center text-sm">
                <Target className="h-4 w-4 mr-1 text-primary" />
                <span>Monthly target: </span>
              </div>
              <p className="text-lg font-semibold">{currencySymbol}{monthlySavings.toFixed(2)}</p>
            </div>
            <Button size="sm" onClick={handleContribute}>Add Funds</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalItem;
