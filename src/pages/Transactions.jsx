
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, Target } from 'lucide-react';
import TransactionList from '@/components/TransactionList';
import LoadingSpinner from '@/components/LoadingSpinner';
import SpendingChart from '@/components/SpendingChart';
import { getDummyTransactions } from '@/utils/dummyData';
import { getTransactions, saveTransactions } from '@/utils/localStorage';
import BackgroundAnimation from '@/components/BackgroundAnimation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ThemeToggle from '@/components/ThemeToggle';
import CurrencySelector from '@/components/CurrencySelector';
import GoalsList from '@/components/GoalsList';
import { getGoals, saveGoals } from '@/utils/goalUtils';
import { useAppContext } from '@/context/AppContext';

const Transactions = () => {
  const navigate = useNavigate();
  const { currencySymbol } = useAppContext();
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [connectedBank, setConnectedBank] = useState(null);
  const [userName, setUserName] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  
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
  
  // Save goals whenever they change
  useEffect(() => {
    saveGoals(goals);
  }, [goals]);
  
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
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 neon-text">
          {userName ? `${userName}'s ` : ''}
          {connectedBank ? `${connectedBank} Transactions` : 'Your Transactions'}
        </h1>
        <div className="flex gap-2">
          <CurrencySelector />
          <ThemeToggle />
          <Button variant="outline" onClick={handleGoBack}>
            Back
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="overview" className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="goals">Financial Goals</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="grid gap-6 z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg shadow">
              <h2 className="text-sm font-medium text-gray-600 dark:text-gray-300">Income</h2>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{currencySymbol}{totalIncome.toFixed(2)}</p>
            </div>
            
            <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg shadow">
              <h2 className="text-sm font-medium text-gray-600 dark:text-gray-300">Expenses</h2>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{currencySymbol}{totalExpenses.toFixed(2)}</p>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg shadow">
              <h2 className="text-sm font-medium text-gray-600 dark:text-gray-300">Balance</h2>
              <p className={`text-2xl font-bold ${balance >= 0 
                ? 'text-blue-600 dark:text-blue-400' 
                : 'text-red-600 dark:text-red-400'}`}>
                {currencySymbol}{balance.toFixed(2)}
              </p>
            </div>
          </div>
          
          <SpendingChart transactions={transactions} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-card rounded-lg shadow p-4">
              <div className="flex items-center mb-4">
                <Calendar className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                <h2 className="font-medium">Recent Transactions</h2>
              </div>
              <TransactionList transactions={transactions.slice(0, 5)} />
              {transactions.length > 5 && (
                <Button variant="link" className="mt-2" onClick={() => setActiveTab('transactions')}>
                  View all transactions
                </Button>
              )}
            </div>
            
            <div className="bg-white dark:bg-card rounded-lg shadow p-4">
              <div className="flex items-center mb-4">
                <Target className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                <h2 className="font-medium">Financial Goals</h2>
              </div>
              {goals.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No goals yet</p>
                  <Button variant="link" onClick={() => setActiveTab('goals')}>
                    Create your first goal
                  </Button>
                </div>
              ) : (
                <>
                  {goals.slice(0, 2).map(goal => (
                    <div key={goal.id} className="mb-4 last:mb-0">
                      <div className="flex justify-between">
                        <span>{goal.name}</span>
                        <span className="font-medium">{currencySymbol}{goal.currentAmount} / {currencySymbol}{goal.targetAmount}</span>
                      </div>
                      <div className="w-full bg-muted h-2 rounded-full mt-1">
                        <div 
                          className="bg-primary h-full rounded-full" 
                          style={{ width: `${Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                  {goals.length > 2 && (
                    <Button variant="link" className="mt-2" onClick={() => setActiveTab('goals')}>
                      View all goals
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="transactions" className="z-10">
          <div className="bg-white dark:bg-card rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                <h2 className="font-medium">All Transactions</h2>
              </div>
            </div>
            
            <TransactionList transactions={transactions} />
          </div>
        </TabsContent>
        
        <TabsContent value="goals" className="z-10">
          <div className="bg-white dark:bg-card rounded-lg shadow p-4">
            <GoalsList goals={goals} setGoals={setGoals} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Transactions;
