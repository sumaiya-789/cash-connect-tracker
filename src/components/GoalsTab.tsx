
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Goal, getGoals, saveGoals } from '@/utils/goalUtils';
import GoalForm from './GoalForm';
import GoalList from './GoalList';

const GoalsTab: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  
  useEffect(() => {
    const savedGoals = getGoals();
    setGoals(savedGoals);
  }, []);
  
  const handleAddGoal = (newGoal: Goal) => {
    const updatedGoals = [...goals, newGoal];
    setGoals(updatedGoals);
    saveGoals(updatedGoals);
  };
  
  const handleUpdateGoal = (updatedGoal: Goal) => {
    const updatedGoals = goals.map(goal => 
      goal.id === updatedGoal.id ? updatedGoal : goal
    );
    setGoals(updatedGoals);
    saveGoals(updatedGoals);
  };
  
  const handleDeleteGoal = (goalId: string) => {
    const updatedGoals = goals.filter(goal => goal.id !== goalId);
    setGoals(updatedGoals);
    saveGoals(updatedGoals);
  };
  
  return (
    <Tabs defaultValue="view" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="view">View Goals</TabsTrigger>
        <TabsTrigger value="add">Add New Goal</TabsTrigger>
      </TabsList>
      <TabsContent value="view" className="py-4">
        <GoalList 
          goals={goals} 
          onUpdateGoal={handleUpdateGoal} 
          onDeleteGoal={handleDeleteGoal}
        />
      </TabsContent>
      <TabsContent value="add" className="py-4">
        <GoalForm onAddGoal={handleAddGoal} />
      </TabsContent>
    </Tabs>
  );
};

export default GoalsTab;
