
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
import CurrencySelector from '@/components/CurrencySelector';
import GoalsTab from '@/components/GoalsTab';
import { useCurrency } from '@/contexts/CurrencyContext';

const ManualMode = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [userData, setUserData] = useState(null);
  const { formatAmount } = useCurrency();
  
  // Load user data and transactions from localStorage on component mount
  useEffect(() => {
    const savedTransactions = getTransactions();
    setTransactions(savedTransactions);
    const savedUserData = localStorage.getItem('userData');
    if (savedUserData) {
      setUserData(JSON.parse(savedUserData));
    }
  }, []);
  
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
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome, {userData.name}! 👋
          </h1>
          <p className="text-gray-600 text-sm">{userData.email}</p>
        </div>
        <div className="flex gap-2 items-center">
          <CurrencySelector />
          <Button variant="outline" onClick={() => navigate('/landing')}>
            Back
          </Button>
          <Button variant="ghost" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-green-50/80 backdrop-blur">
            <CardContent className="pt-4">
              <h2 className="text-sm font-medium text-gray-600">Income</h2>
              <p className="text-2xl font-bold text-green-600">{formatAmount(totalIncome)}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-red-50/80 backdrop-blur">
            <CardContent className="pt-4">
              <h2 className="text-sm font-medium text-gray-600">Expenses</h2>
              <p className="text-2xl font-bold text-red-600">{formatAmount(totalExpenses)}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-blue-50/80 backdrop-blur">
            <CardContent className="pt-4">
              <h2 className="text-sm font-medium text-gray-600">Balance</h2>
              <p className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                {formatAmount(balance)}
              </p>
            </CardContent>
          </Card>
        </div>
        
        <SpendingChart transactions={transactions} />
        
        <Tabs defaultValue="transactions" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
          </TabsList>
          
          <TabsContent value="transactions" className="py-4">
            <Tabs defaultValue="list" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="list">Transaction List</TabsTrigger>
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
          
          <TabsContent value="goals" className="py-4">
            <GoalsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ManualMode;
