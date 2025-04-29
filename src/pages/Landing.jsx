
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Banknote, CreditCard } from 'lucide-react';
import BackgroundAnimation from '@/components/BackgroundAnimation';
import ThemeToggle from '@/components/ThemeToggle';
import CurrencySelector from '@/components/CurrencySelector';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center p-6 relative overflow-hidden">
      <BackgroundAnimation />
      
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <CurrencySelector />
        <ThemeToggle />
      </div>
      
      <div className="w-full max-w-md space-y-10 mt-10 z-10">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 neon-text">Choose Your Mode</h1>
          <p className="text-gray-600 dark:text-gray-300">How would you like to track your finances?</p>
        </div>
        
        <div className="grid gap-6">
          <div 
            onClick={() => navigate('/manual-mode')}
            className="bg-white/80 dark:bg-card/80 backdrop-blur-sm rounded-xl shadow-md hover:shadow-lg transition-all p-6 cursor-pointer border-2 border-transparent hover:border-primary dark:hover:neon-box transform hover:scale-105 duration-300"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-primary bg-opacity-10 dark:bg-opacity-20 p-3 rounded-full">
                <Banknote className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Manual Mode</h2>
                <p className="text-gray-600 dark:text-gray-300">Add your transactions manually</p>
              </div>
            </div>
          </div>
          
          <div 
            onClick={() => navigate('/bank-connect')}
            className="bg-white/80 dark:bg-card/80 backdrop-blur-sm rounded-xl shadow-md hover:shadow-lg transition-all p-6 cursor-pointer border-2 border-transparent hover:border-secondary dark:hover:neon-box transform hover:scale-105 duration-300"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-secondary bg-opacity-10 dark:bg-opacity-20 p-3 rounded-full">
                <CreditCard className="h-8 w-8 text-secondary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Bank Connect Mode</h2>
                <p className="text-gray-600 dark:text-gray-300">Connect your bank account</p>
              </div>
            </div>
          </div>
        </div>
        
        <Button 
          variant="outline"
          className="w-full backdrop-blur-sm bg-white/70 dark:bg-card/70 hover:bg-white/90 dark:hover:bg-card/90 transition-all" 
          onClick={() => navigate('/')}
        >
          Go Back
        </Button>
      </div>
    </div>
  );
};

export default Landing;
