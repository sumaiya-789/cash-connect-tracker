
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import TransactionForm from '@/components/TransactionForm';
import TransactionList from '@/components/TransactionList';
import { saveTransactions, getTransactions } from '@/utils/localStorage';
import UserSignupForm from '@/components/UserSignupForm';
import BackgroundAnimation from '@/components/BackgroundAnimation';

const ManualMode = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [userData, setUserData] = useState(null);
  
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
  
  // Calculate totals for overview and chart data
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const balance = totalIncome - totalExpenses;

  // Prepare data for chart
  const chartData = transactions.map(t => ({
    date: new Date(t.date).toLocaleDateString(),
    amount: t.type === 'expense' ? -t.amount : t.amount,
    type: t.type
  }));
  
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
        <Button variant="outline" onClick={() => navigate('/landing')}>
          Back
        </Button>
      </div>
      
      <div className="grid gap-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-green-50/80 backdrop-blur">
            <CardContent className="pt-4">
              <h2 className="text-sm font-medium text-gray-600">Income</h2>
              <p className="text-2xl font-bold text-green-600">${totalIncome.toFixed(2)}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-red-50/80 backdrop-blur">
            <CardContent className="pt-4">
              <h2 className="text-sm font-medium text-gray-600">Expenses</h2>
              <p className="text-2xl font-bold text-red-600">${totalExpenses.toFixed(2)}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-blue-50/80 backdrop-blur">
            <CardContent className="pt-4">
              <h2 className="text-sm font-medium text-gray-600">Balance</h2>
              <p className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                ${balance.toFixed(2)}
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Card className="bg-white/80 backdrop-blur">
          <CardContent className="pt-4">
            <h2 className="text-lg font-semibold mb-4">Transaction History</h2>
            <ChartContainer className="h-[200px]" config={{}}>
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip />
                <Area type="monotone" dataKey="amount" stroke="#8884d8" fill="#8884d8" />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="transactions" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="add">Add New</TabsTrigger>
          </TabsList>
          <TabsContent value="transactions" className="py-4">
            <TransactionList transactions={transactions} />
          </TabsContent>
          <TabsContent value="add" className="py-4">
            <TransactionForm onAddTransaction={handleAddTransaction} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ManualMode;
