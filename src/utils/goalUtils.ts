
export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string; // ISO date string
  priority: 'low' | 'medium' | 'high';
  createdAt: string; // ISO date string
}

export const saveGoals = (goals: Goal[]) => {
  localStorage.setItem('userGoals', JSON.stringify(goals));
};

export const getGoals = (): Goal[] => {
  const goals = localStorage.getItem('userGoals');
  return goals ? JSON.parse(goals) : [];
};

export const calculateProgress = (current: number, target: number): number => {
  if (target <= 0) return 0;
  const progress = (current / target) * 100;
  return Math.min(Math.max(progress, 0), 100);
};

export const calculateMonthlySavings = (targetAmount: number, currentAmount: number, deadline: string): number => {
  const today = new Date();
  const deadlineDate = new Date(deadline);
  
  if (deadlineDate <= today) return 0;
  
  const remainingAmount = targetAmount - currentAmount;
  if (remainingAmount <= 0) return 0;
  
  // Calculate months between now and deadline
  const months = (deadlineDate.getFullYear() - today.getFullYear()) * 12 + 
                 (deadlineDate.getMonth() - today.getMonth());
  
  if (months <= 0) return remainingAmount;
  
  return remainingAmount / months;
};

export const priorityColors = {
  low: 'bg-blue-500',
  medium: 'bg-yellow-500',
  high: 'bg-red-500',
};
