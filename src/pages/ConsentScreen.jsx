import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { toast } from "sonner";
import LoadingSpinner from '@/components/LoadingSpinner';
import { CheckCircle } from 'lucide-react';

const ConsentScreen = () => {
  const navigate = useNavigate();
  const [bank, setBank] = useState(null);
  const [isConsenting, setIsConsenting] = useState(false);
  const [consent, setConsent] = useState(false);

  useEffect(() => {
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

    setTimeout(() => {
      fetch('/dummyData.json')
        .then(response => {
          toast.success("Bank connected successfully!");
          setIsConsenting(false);
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
        
        <h1 className="text-2xl font-bold text-gray-800">Account Aggregator Consent</h1>
        <Button variant="outline" onClick={() => navigate('/bank-selection')}>
          Back
        </Button>
      </div>

      <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
        {/* Account Aggregator Info */}
        <div className="text-center mb-6">
  <div className="flex justify-center mb-2">
    <div className="bg-teal-100 rounded-full p-3">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0-2.5 1.5-4.5 4-5 1.9-.4 3.7 1 4 3 .3 1.7-.4 3.3-1.5 4.5-.8.8-1.6 1.7-2.2 2.7-1.2 2-3.3 2.8-4.8 2.8s-3.6-.8-4.8-2.8c-.6-1-1.4-1.9-2.2-2.7C3.4 12.3 2.7 10.7 3 9c.3-2 2.1-3.4 4-3 2.5.5 4 2.5 4 5z" />
      </svg>
    </div>
  </div>
  <h1 className="text-2xl font-semibold text-gray-800">Account Aggregator Consent</h1>
  <p className="text-sm text-gray-600 mt-1">
    Securely link your bank accounts to access your financial data
  </p>
</div>

        <div className="bg-blue-50 p-4 rounded-lg mb-4 border border-blue-100">
          <h2 className="font-semibold mb-1">🔒 What is an Account Aggregator?</h2>
          <p className="text-sm text-gray-700">
            An Account Aggregator is a new type of RBI regulated entity that helps individuals securely share their financial data with third parties.
          </p>
        </div>

        {/* Security Info */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4">
          <h3 className="font-semibold mb-2">🔐 Your Data Stays Secure</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500" /> Your data is encrypted end-to-end</li>
            <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500" /> We don't store your banking credentials</li>
            <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500" /> You control what data is shared and for how long</li>
            <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500" /> Revoke access anytime through the app</li>
          </ul>
        </div>

        {/* Consent Checkbox */}
        <div className="flex items-start space-x-3 mb-6">
          <Checkbox id="consent" checked={consent} onCheckedChange={setConsent} />
          <Label htmlFor="consent" className="text-sm">
            I consent to RupeeFlow accessing my financial data through the Account Aggregator framework
          </Label>
        </div>

        {/* Consent Button */}
        <Button onClick={handleConsent} disabled={isConsenting} className="w-full">
          {isConsenting ? (
            <div className="flex items-center justify-center space-x-2">
              <LoadingSpinner size="sm" />
              <span>Connecting...</span>
            </div>
          ) : (
            "Authorize Access"
          )}
        </Button>
      </div>
    </div>
  );
};

export default ConsentScreen;
