
import React, { useState, useEffect } from "react";
import { useAppContext, CurrencyType } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Goal } from "@/utils/goalUtils";

interface GoalFormProps {
  onAddGoal: (goal: Goal) => void;
  editGoal?: Goal | null;
  onCancelEdit?: () => void;
}

const GoalForm: React.FC<GoalFormProps> = ({ onAddGoal, editGoal = null, onCancelEdit }) => {
  const { currency, currencySymbol } = useAppContext();
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  
  // Fill form with edit goal data if provided
  useEffect(() => {
    if (editGoal) {
      setName(editGoal.name);
      setTargetAmount(editGoal.targetAmount.toString());
      setCurrentAmount(editGoal.currentAmount.toString());
      setDeadline(editGoal.deadline);
      setPriority(editGoal.priority);
    }
  }, [editGoal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!name || !targetAmount || !deadline) {
      toast.error("Please fill in all required fields.");
      return;
    }
    
    const targetAmountNum = Number(targetAmount);
    const currentAmountNum = Number(currentAmount || 0);
    
    if (isNaN(targetAmountNum) || targetAmountNum <= 0) {
      toast.error("Please enter a valid target amount.");
      return;
    }
    
    if (isNaN(currentAmountNum) || currentAmountNum < 0) {
      toast.error("Please enter a valid current amount.");
      return;
    }
    
    if (currentAmountNum > targetAmountNum) {
      toast.error("Current amount cannot be greater than target amount.");
      return;
    }
    
    const deadlineDate = new Date(deadline);
    if (deadlineDate <= new Date()) {
      toast.error("Deadline must be in the future.");
      return;
    }
    
    // Create goal object
    const goal: Goal = {
      id: editGoal?.id || Date.now().toString(),
      name,
      targetAmount: targetAmountNum,
      currentAmount: currentAmountNum,
      deadline,
      priority,
      currency: currency as CurrencyType,
    };
    
    // Add goal and reset form
    onAddGoal(goal);
    toast.success(editGoal ? "Goal updated!" : "Goal added!");
    
    if (!editGoal) {
      // Only reset form for new goals
      setName("");
      setTargetAmount("");
      setCurrentAmount("");
      setDeadline("");
      setPriority("medium");
    } else if (onCancelEdit) {
      onCancelEdit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Goal Name</Label>
        <Input
          id="name"
          placeholder="E.g., Buy a car"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="targetAmount">Target Amount</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
            {currencySymbol}
          </span>
          <Input
            id="targetAmount"
            type="number"
            min="0"
            step="0.01"
            className="pl-8"
            placeholder="0.00"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="currentAmount">Current Savings</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
            {currencySymbol}
          </span>
          <Input
            id="currentAmount"
            type="number"
            min="0"
            step="0.01"
            className="pl-8"
            placeholder="0.00"
            value={currentAmount}
            onChange={(e) => setCurrentAmount(e.target.value)}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="deadline">Deadline</Label>
        <Input
          id="deadline"
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          required
          min={new Date().toISOString().split("T")[0]}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="priority">Priority</Label>
        <Select value={priority} onValueChange={(value) => setPriority(value as "low" | "medium" | "high")}>
          <SelectTrigger>
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex gap-3">
        <Button type="submit" className="w-full">
          {editGoal ? "Update Goal" : "Add Goal"}
        </Button>
        {editGoal && onCancelEdit && (
          <Button type="button" variant="outline" className="w-full" onClick={onCancelEdit}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};

export default GoalForm;
