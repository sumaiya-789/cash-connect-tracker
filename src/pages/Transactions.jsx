
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, PiggyBank } from 'lucide-react';
import TransactionList from '@/components/TransactionList';
import LoadingSpinner from '@/components/LoadingSpinner';
import SpendingChart from '@/components/SpendingChart';
import GoalsList from '@/components/GoalsList';
import GoalForm from '@/components/GoalForm';
import { getDummyTransactions } from '@/utils/dummyData';
import { getTransactions, saveTransactions } from '@/utils/localStorage';
import { getGoals, saveGoals } from '@/utils/goalUtils';
import BackgroundAnimation from '@/components/BackgroundAnimation';

const Transactions = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [connectedBank, setConnectedBank] = useState(null);
  const [userName, setUserName] = useState('');
  const [activeTab, setActiveTab] = useState('transactions');
  
  useEffect(() => {
    // Check if user has a name saved (from manual mode signup)
    const savedName = localStorage.getItem('userName');
    if (savedName) {
      setUserName(savedName);
    }
    
    // Load goals
    const savedGoals = getGoals();
    setGoals(savedGoals);
    
    // Check which mode was used to reach this page
    const connectedBank = localStorage.getItem('connectedBank');
    
    if (connectedBank) {
      // We came from bank connect flow - load dummy transactions
      setConnectedBank(connectedBank);
      
      setTimeout(() => {
        const dummyTransactions = getDummyTransactions();
        setTransactions(dummyTransactions);
        // Also save these transactions to localStorage
        saveTransactions(dummyTransactions);
        setIsLoading(false);
      }, 1500);
    } else {
      // We came from manual mode - load saved transactions
      const savedTransactions = getTransactions();
      setTransactions(savedTransactions);
      setIsLoading(false);
    }
  }, []);
  
  const handleAddGoal = (newGoal) => {
    const updatedGoals = [...goals, newGoal];
    setGoals(updatedGoals);
    saveGoals(updatedGoals);
  };
  
  // Calculate total income, expenses and balance
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const balance = totalIncome - totalExpenses;
  
  const handleGoBack = () => {
    if (connectedBank) {
      // Clear connected bank state when leaving the page
      localStorage.removeItem('connectedBank');
      navigate('/landing');
    } else {
      navigate('/manual-mode');
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <LoadingSpinner size="lg" text="Loading your transactions..." />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col p-6">
      <BackgroundAnimation />
      
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          {userName ? `${userName}'s ` : ''}
          {connectedBank ? `${connectedBank} Transactions` : 'Your Transactions'}
        </h1>
        <Button variant="outline" onClick={handleGoBack}>
          Back
        </Button>
      </div>
      
      <div className="grid gap-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50/80 backdrop-blur p-4 rounded-lg shadow">
            <h2 className="text-sm font-medium text-gray-600">Income</h2>
            <p className="text-2xl font-bold text-green-600">${totalIncome.toFixed(2)}</p>
          </div>
          
          <div className="bg-red-50/80 backdrop-blur p-4 rounded-lg shadow">
            <h2 className="text-sm font-medium text-gray-600">Expenses</h2>
            <p className="text-2xl font-bold text-red-600">${totalExpenses.toFixed(2)}</p>
          </div>
          
          <div className="bg-blue-50/80 backdrop-blur p-4 rounded-lg shadow">
            <h2 className="text-sm font-medium text-gray-600">Balance</h2>
            <p className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
              ${balance.toFixed(2)}
            </p>
          </div>
        </div>
        
        <SpendingChart transactions={transactions} />
        
        <Tabs 
          defaultValue="transactions" 
          value={activeTab}
          onValueChange={setActiveTab} 
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
          </TabsList>
          
          <TabsContent value="transactions" className="py-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                <h2 className="font-medium">Recent Transactions</h2>
              </div>
            </div>
            
            <TransactionList transactions={transactions} />
          </TabsContent>
          
          <TabsContent value="goals" className="py-4">
            <div className="space-y-6">
              <div className="flex items-center mb-2">
                <PiggyBank className="h-5 w-5 text-gray-500 mr-2" />
                <h2 className="font-medium">Financial Goals</h2>
              </div>
              
              <GoalsList goals={goals} />
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Add New Goal</h3>
                <GoalForm onAddGoal={handleAddGoal} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Transactions;
