
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TransactionForm from '@/components/TransactionForm';
import TransactionList from '@/components/TransactionList';
import { saveTransactions, getTransactions } from '@/utils/localStorage';

const ManualMode = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  
  // Load transactions from localStorage on component mount
  useEffect(() => {
    const savedTransactions = getTransactions();
    setTransactions(savedTransactions);
  }, []);
  
  const handleAddTransaction = (newTransaction) => {
    const updatedTransactions = [...transactions, newTransaction];
    setTransactions(updatedTransactions);
    saveTransactions(updatedTransactions);
  };
  
  // Calculate total income, expenses and balance
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const balance = totalIncome - totalExpenses;
  
  return (
    <div className="min-h-screen flex flex-col p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Manual Mode</h1>
        <Button variant="outline" onClick={() => navigate('/landing')}>
          Back
        </Button>
      </div>
      
      <div className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 p-4 rounded-lg shadow">
            <h2 className="text-sm font-medium text-gray-600">Income</h2>
            <p className="text-2xl font-bold text-green-600">${totalIncome.toFixed(2)}</p>
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg shadow">
            <h2 className="text-sm font-medium text-gray-600">Expenses</h2>
            <p className="text-2xl font-bold text-red-600">${totalExpenses.toFixed(2)}</p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg shadow">
            <h2 className="text-sm font-medium text-gray-600">Balance</h2>
            <p className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
              ${balance.toFixed(2)}
            </p>
          </div>
        </div>
        
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
