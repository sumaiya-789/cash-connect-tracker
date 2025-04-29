
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import CurrencySelector from '@/components/CurrencySelector';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 gradient-bg">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <CurrencySelector />
        <ThemeToggle />
      </div>
      
      <div className="w-full max-w-md bg-white dark:bg-card rounded-2xl shadow-xl p-8 space-y-8 text-center">
        <div className="animate-bounce mb-4">
          <div className="h-24 w-24 mx-auto bg-primary rounded-full flex items-center justify-center neon-box">
            <span className="text-4xl font-bold text-white neon-text">$</span>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 neon-text">Welcome to Cha-Ching</h1>
        
        <p className="text-gray-600 dark:text-gray-300">
          Your personal finance tracker that helps you manage expenses, income, and reach your financial goals with ease.
        </p>
        
        <Button 
          className="w-full py-6 text-lg font-medium" 
          onClick={() => navigate('/landing')}
        >
          Get Started <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default Welcome;
