
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Banknote, CreditCard } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center p-6">
      <div className="w-full max-w-md space-y-10 mt-10">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-800">Choose Your Mode</h1>
          <p className="text-gray-600">How would you like to track your finances?</p>
        </div>
        
        <div className="grid gap-6">
          <div 
            onClick={() => navigate('/manual-mode')}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer border-2 border-transparent hover:border-primary"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-primary bg-opacity-10 p-3 rounded-full">
                <Banknote className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Manual Mode</h2>
                <p className="text-gray-600">Add your transactions manually</p>
              </div>
            </div>
          </div>
          
          <div 
            onClick={() => navigate('/bank-connect')}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer border-2 border-transparent hover:border-secondary"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-secondary bg-opacity-10 p-3 rounded-full">
                <CreditCard className="h-8 w-8 text-secondary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Bank Connect Mode</h2>
                <p className="text-gray-600">Connect your bank account</p>
              </div>
            </div>
          </div>
        </div>
        
        <Button 
          variant="outline"
          className="w-full" 
          onClick={() => navigate('/')}
        >
          Go Back
        </Button>
      </div>
    </div>
  );
};

export default Landing;
