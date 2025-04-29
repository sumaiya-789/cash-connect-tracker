
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from "@/components/ui/card";
import TransactionForm from '@/components/TransactionForm';
import TransactionList from '@/components/TransactionList';
import { saveTransactions, getTransactions } from '@/utils/localStorage';
import UserSignupForm from '@/components/UserSignupForm';
import BackgroundAnimation from '@/components/BackgroundAnimation';
import SpendingChart from '@/components/SpendingChart';
import { toast } from "sonner";
import { getGoals, saveGoals } from '@/utils/goalUtils';
import GoalsList from '@/components/GoalsList';
import ThemeToggle from '@/components/ThemeToggle';
import CurrencySelector from '@/components/CurrencySelector';
import { useAppContext } from '@/context/AppContext';

const ManualMode = () => {
  const navigate = useNavigate();
  const { currencySymbol } = useAppContext();
  const [transactions, setTransactions] = useState([]);
  const [userData, setUserData] = useState(null);
  const [goals, setGoals] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Load user data, transactions and goals from localStorage on component mount
  useEffect(() => {
    const savedTransactions = getTransactions();
    setTransactions(savedTransactions);
    
    const savedUserData = localStorage.getItem('userData');
    if (savedUserData) {
      setUserData(JSON.parse(savedUserData));
    }
    
    const savedGoals = getGoals();
    setGoals(savedGoals);
  }, []);
  
  // Save goals whenever they change
  useEffect(() => {
    saveGoals(goals);
  }, [goals]);
  
  const handleAddTransaction = (newTransaction) => {
    const updatedTransactions = [...transactions, newTransaction];
    setTransactions(updatedTransactions);
    saveTransactions(updatedTransactions);
  };
  
  const handleLogout = () => {
    // In a real app, we might clear authentication tokens
    setUserData(null);
    toast.success("Logged out successfully!");
    // Note: We're not clearing transactions here to persist them between logins
  };
  
  // Calculate totals for overview and chart data
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const balance = totalIncome - totalExpenses;
  
  // If user hasn't signed up, show signup form
  if (!userData) {
    return <UserSignupForm onSignupComplete={setUserData} />;
  }
  
  return (
    <div className="relative min-h-screen flex flex-col p-6 font-inter">
      <BackgroundAnimation />
      
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 neon-text">
            Welcome, {userData.name}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-300">{userData.email}</p>
        </div>
        <div className="flex gap-2">
          <CurrencySelector />
          <ThemeToggle />
          <Button variant="outline" onClick={() => navigate('/landing')}>
            Back
          </Button>
          <Button variant="ghost" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="overview" className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="goals">Financial Goals</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6 relative z-10">
          <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-green-50/80 dark:bg-green-900/20 backdrop-blur">
                <CardContent className="pt-4">
                  <h2 className="text-sm font-medium text-gray-600 dark:text-gray-300">Income</h2>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">{currencySymbol}{totalIncome.toFixed(2)}</p>
                </CardContent>
              </Card>
              
              <Card className="bg-red-50/80 dark:bg-red-900/20 backdrop-blur">
                <CardContent className="pt-4">
                  <h2 className="text-sm font-medium text-gray-600 dark:text-gray-300">Expenses</h2>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">{currencySymbol}{totalExpenses.toFixed(2)}</p>
                </CardContent>
              </Card>
              
              <Card className="bg-blue-50/80 dark:bg-blue-900/20 backdrop-blur">
                <CardContent className="pt-4">
                  <h2 className="text-sm font-medium text-gray-600 dark:text-gray-300">Balance</h2>
                  <p className={`text-2xl font-bold ${balance >= 0 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-red-600 dark:text-red-400'}`}>
                    {currencySymbol}{balance.toFixed(2)}
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <SpendingChart transactions={transactions} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="pt-4">
                  <h2 className="font-medium mb-2">Recent Transactions</h2>
                  <TransactionList transactions={transactions.slice(0, 5)} />
                  {transactions.length > 5 && (
                    <Button variant="link" className="mt-2" onClick={() => setActiveTab('transactions')}>
                      View all transactions
                    </Button>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-4">
                  <h2 className="font-medium mb-2">Financial Goals</h2>
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
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="transactions" className="space-y-6 relative z-10">
          <Tabs defaultValue="list" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="list">Transactions</TabsTrigger>
              <TabsTrigger value="add">Add New</TabsTrigger>
            </TabsList>
            <TabsContent value="list" className="py-4">
              <TransactionList transactions={transactions} />
            </TabsContent>
            <TabsContent value="add" className="py-4">
              <TransactionForm onAddTransaction={handleAddTransaction} />
            </TabsContent>
          </Tabs>
        </TabsContent>
        
        <TabsContent value="goals" className="space-y-6 relative z-10">
          <GoalsList goals={goals} setGoals={setGoals} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManualMode;
