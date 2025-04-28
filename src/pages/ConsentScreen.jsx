
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { toast } from "sonner";
import LoadingSpinner from '@/components/LoadingSpinner';

const ConsentScreen = () => {
  const navigate = useNavigate();
  const [bank, setBank] = useState(null);
  const [isConsenting, setIsConsenting] = useState(false);
  const [consent, setConsent] = useState(false);
  
  useEffect(() => {
    // Get selected bank from session storage
    const selectedBank = sessionStorage.getItem('selectedBank');
    if (selectedBank) {
      setBank(JSON.parse(selectedBank));
    } else {
      navigate('/bank-selection');
    }
  }, [navigate]);
  
  const handleConsent = () => {
    if (!consent) {
      toast.error("You must agree to the terms to continue");
      return;
    }
    
    setIsConsenting(true);
    
    // Simulate fetching data
    setTimeout(() => {
      fetch('/dummyData.json')
        .then(response => {
          // Implementation is simplified - in production you'd have proper error handling
          toast.success("Bank connected successfully!");
          setIsConsenting(false);
          
          // Save info about the connected bank
          localStorage.setItem('connectedBank', bank?.name || 'Your Bank');
          navigate('/transactions');
        })
        .catch(error => {
          console.error('Error fetching transactions:', error);
          toast.error("Failed to connect bank. Please try again.");
          setIsConsenting(false);
        });
    }, 2000);
  };
  
  if (!bank) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Bank Authorization</h1>
        <Button variant="outline" onClick={() => navigate('/bank-selection')}>
          Back
        </Button>
      </div>
      
      <div className="max-w-md mx-auto w-full bg-white rounded-lg shadow-md p-6 mt-4">
        <div className="text-center mb-6">
          <div className="bg-blue-100 p-4 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
            <span className="text-4xl">{bank.logo}</span>
          </div>
          <h2 className="text-xl font-bold mt-4">{bank.name}</h2>
        </div>
        
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold">Cha-Ching would like to:</h3>
            <ul className="list-disc list-inside mt-2 space-y-2">
              <li>Access your transaction history</li>
              <li>View your account balance</li>
              <li>See your account details</li>
            </ul>
          </div>
          
          <div className="flex items-start space-x-3">
            <Checkbox 
              id="consent" 
              checked={consent} 
              onCheckedChange={setConsent} 
            />
            <div className="space-y-1">
              <Label htmlFor="consent">
                I authorize Cha-Ching to access my banking information securely
              </Label>
              <p className="text-xs text-gray-500">
                Your data is encrypted and never stored on our servers. You can revoke access at any time.
              </p>
            </div>
          </div>
          
          <Button 
            onClick={handleConsent} 
            disabled={isConsenting} 
            className="w-full"
          >
            {isConsenting ? (
              <div className="flex items-center justify-center space-x-2">
                <LoadingSpinner size="sm" text="" />
                <span>Connecting...</span>
              </div>
            ) : (
              "Authorize Access"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConsentScreen;
