
import { CurrencyType } from "../context/AppContext";

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string; // ISO date string
  priority: "low" | "medium" | "high";
  category?: string;
  currency: CurrencyType;
}

export const calculateProgress = (goal: Goal): number => {
  if (goal.targetAmount <= 0) return 0;
  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  return Math.min(Math.max(progress, 0), 100);
};

export const calculateSuggestedMonthlySaving = (goal: Goal): number => {
  // Calculate months between now and deadline
  const today = new Date();
  const deadline = new Date(goal.deadline);
  
  if (deadline <= today) return 0;
  
  const monthsLeft = (deadline.getFullYear() - today.getFullYear()) * 12 + 
    (deadline.getMonth() - today.getMonth());
  
  const amountLeft = goal.targetAmount - goal.currentAmount;
  
  if (monthsLeft <= 0 || amountLeft <= 0) return 0;
  
  // Calculate suggested monthly saving to meet the goal by the deadline
  return amountLeft / Math.max(monthsLeft, 1);
};

export const saveGoals = (goals: Goal[]): void => {
  localStorage.setItem("goals", JSON.stringify(goals));
};

export const getGoals = (): Goal[] => {
  const savedGoals = localStorage.getItem("goals");
  if (!savedGoals) return [];
  
  try {
    return JSON.parse(savedGoals);
  } catch (error) {
    console.error("Failed to parse goals from localStorage:", error);
    return [];
  }
};
