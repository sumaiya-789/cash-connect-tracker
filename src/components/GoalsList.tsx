
import React, { useState } from "react";
import { Goal } from "@/utils/goalUtils";
import GoalItem from "./GoalItem";
import GoalForm from "./GoalForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface GoalsListProps {
  goals: Goal[];
  setGoals: React.Dispatch<React.SetStateAction<Goal[]>>;
}

const GoalsList: React.FC<GoalsListProps> = ({ goals, setGoals }) => {
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  const handleAddGoal = (newGoal: Goal) => {
    if (editingGoal) {
      // Update existing goal
      setGoals((prev) => prev.map((g) => (g.id === newGoal.id ? newGoal : g)));
      setEditingGoal(null);
    } else {
      // Add new goal
      setGoals((prev) => [...prev, newGoal]);
    }
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
  };

  const handleCancelEdit = () => {
    setEditingGoal(null);
  };

  const handleDeleteGoal = (goalId: string) => {
    if (window.confirm("Are you sure you want to delete this goal?")) {
      setGoals((prev) => prev.filter((g) => g.id !== goalId));
      toast.success("Goal deleted!");
    }
  };

  const handleUpdateAmount = (goalId: string, newAmount: number) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === goalId) {
          if (newAmount > g.targetAmount) {
            toast.success("Goal completed! 🎉");
            return { ...g, currentAmount: g.targetAmount };
          }
          return { ...g, currentAmount: newAmount };
        }
        return g;
      })
    );
    toast.success("Amount updated!");
  };

  return (
    <Tabs defaultValue="list" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="list">My Goals</TabsTrigger>
        <TabsTrigger value="add">{editingGoal ? "Edit Goal" : "Add New Goal"}</TabsTrigger>
      </TabsList>
      <TabsContent value="list" className="py-4">
        {goals.length === 0 ? (
          <Card className="p-6 text-center">
            <p>You don't have any financial goals yet.</p>
            <p className="text-muted-foreground mt-1">Click on "Add New Goal" to create one!</p>
          </Card>
        ) : (
          <div className="grid gap-4 grid-cols-1">
            {goals.map((goal) => (
              <GoalItem
                key={goal.id}
                goal={goal}
                onEdit={handleEditGoal}
                onDelete={handleDeleteGoal}
                onUpdateAmount={handleUpdateAmount}
              />
            ))}
          </div>
        )}
      </TabsContent>
      <TabsContent value="add" className="py-4">
        <Card className="p-6">
          <GoalForm 
            onAddGoal={handleAddGoal} 
            editGoal={editingGoal} 
            onCancelEdit={handleCancelEdit}
          />
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default GoalsList;
