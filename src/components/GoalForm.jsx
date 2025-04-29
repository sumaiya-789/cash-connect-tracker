
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const GoalForm = ({ onAddGoal }) => {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [savedAmount, setSavedAmount] = useState('');
  const [deadline, setDeadline] = useState();
  const [priority, setPriority] = useState('medium');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!name || !targetAmount || !deadline) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const newGoal = {
      id: Date.now(),
      name,
      targetAmount: parseFloat(targetAmount),
      savedAmount: parseFloat(savedAmount || 0),
      deadline: deadline.toISOString(),
      priority,
      createdAt: new Date().toISOString(),
    };
    
    onAddGoal(newGoal);
    
    // Reset form
    setName('');
    setTargetAmount('');
    setSavedAmount('');
    setDeadline(undefined);
    setPriority('medium');
    
    toast.success('Goal added successfully!');
  };
  
  // Minimal date is today
  const minDate = new Date();
  
  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Goal Name *</Label>
              <Input 
                id="name" 
                placeholder="e.g., Buy a car"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="targetAmount">Target Amount *</Label>
              <Input 
                id="targetAmount" 
                type="number"
                min="1"
                step="0.01"
                placeholder="5000"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="savedAmount">Already Saved Amount</Label>
              <Input 
                id="savedAmount" 
                type="number"
                min="0"
                step="0.01"
                placeholder="1000"
                value={savedAmount}
                onChange={(e) => setSavedAmount(e.target.value)}
              />
            </div>
            
            <div>
              <Label>Deadline *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !deadline && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {deadline ? format(deadline, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={deadline}
                    onSelect={setDeadline}
                    disabled={(date) => date < minDate}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <Label>Priority</Label>
              <RadioGroup 
                defaultValue="medium" 
                value={priority}
                onValueChange={setPriority}
                className="flex space-x-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="low" id="low" />
                  <Label htmlFor="low" className="text-blue-500">Low</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="medium" />
                  <Label htmlFor="medium" className="text-yellow-500">Medium</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="high" id="high" />
                  <Label htmlFor="high" className="text-red-500">High</Label>
                </div>
              </RadioGroup>
            </div>
            
            <Button type="submit" className="w-full">Add Goal</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default GoalForm;
