
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Goal } from '@/utils/goalUtils';
import { useCurrency } from '@/contexts/CurrencyContext';
import { toast } from 'sonner';

interface GoalFormProps {
  onAddGoal: (goal: Goal) => void;
}

const GoalForm: React.FC<GoalFormProps> = ({ onAddGoal }) => {
  const { currency } = useCurrency();
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Please enter a goal name');
      return;
    }
    
    if (!targetAmount || parseFloat(targetAmount) <= 0) {
      toast.error('Please enter a valid target amount');
      return;
    }
    
    if (!deadline) {
      toast.error('Please select a deadline');
      return;
    }
    
    const deadlineDate = new Date(deadline);
    if (deadlineDate <= new Date()) {
      toast.error('Deadline must be in the future');
      return;
    }
    
    const newGoal: Goal = {
      id: Date.now().toString(),
      name: name.trim(),
      targetAmount: parseFloat(targetAmount),
      currentAmount: 0,
      deadline,
      priority,
      createdAt: new Date().toISOString(),
    };
    
    onAddGoal(newGoal);
    toast.success('Goal added successfully!');
    
    // Reset form
    setName('');
    setTargetAmount('');
    setDeadline('');
    setPriority('medium');
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="goalName">Goal Name</Label>
        <Input
          id="goalName"
          placeholder="e.g., Buy a new car"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      
      <div>
        <Label htmlFor="targetAmount">Target Amount ({currency.symbol})</Label>
        <Input
          id="targetAmount"
          type="number"
          min="0"
          step="0.01"
          placeholder={`${currency.symbol}1000`}
          value={targetAmount}
          onChange={(e) => setTargetAmount(e.target.value)}
        />
      </div>
      
      <div>
        <Label htmlFor="deadline">Deadline</Label>
        <Input
          id="deadline"
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
        />
      </div>
      
      <div>
        <Label htmlFor="priority">Priority</Label>
        <Select value={priority} onValueChange={(value: 'low' | 'medium' | 'high') => setPriority(value)}>
          <SelectTrigger id="priority">
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Button type="submit" className="w-full">Add Goal</Button>
    </form>
  );
};

export default GoalForm;
