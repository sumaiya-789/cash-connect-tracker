
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import TransactionList from '@/components/TransactionList';
import LoadingSpinner from '@/components/LoadingSpinner';
import SpendingChart from '@/components/SpendingChart';
import { getDummyTransactions } from '@/utils/dummyData';
import { getTransactions, saveTransactions } from '@/utils/localStorage';
import BackgroundAnimation from '@/components/BackgroundAnimation';

const Transactions = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [connectedBank, setConnectedBank] = useState(null);
  const [userName, setUserName] = useState('');
  
  useEffect(() => {
    // Check if user has a name saved (from manual mode signup)
    const savedName = localStorage.getItem('userName');
    if (savedName) {
      setUserName(savedName);
    }
    
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
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          {userName ? `${userName}'s ` : ''}
          {connectedBank ? `${connectedBank} Transactions` : 'Your Transactions'}
        </h1>
        <Button variant="outline" onClick={handleGoBack}>
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
        
        <SpendingChart transactions={transactions} />
        
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-gray-500 mr-2" />
            <h2 className="font-medium">Recent Transactions</h2>
          </div>
        </div>
        
        <TransactionList transactions={transactions} />
      </div>
      
      <BackgroundAnimation />
    </div>
  );
};

export default Transactions;
