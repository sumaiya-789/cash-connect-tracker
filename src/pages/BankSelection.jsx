
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const banks = [
  { id: 'hdfc', name: 'HDFC Bank', logo: '🏦' },
  { id: 'sbi', name: 'State Bank of India', logo: '🏦' },
  { id: 'icici', name: 'ICICI Bank', logo: '🏦' },
  { id: 'axis', name: 'Axis Bank', logo: '🏦' },
  { id: 'kotak', name: 'Kotak Mahindra Bank', logo: '🏦' },
  { id: 'yes', name: 'Yes Bank', logo: '🏦' },
];

const BankSelection = () => {
  const navigate = useNavigate();
  
  const handleSelectBank = (bank) => {
    // Store selected bank in session storage for next step
    sessionStorage.setItem('selectedBank', JSON.stringify(bank));
    navigate('/consent-screen');
  };
  
  return (
    <div className="min-h-screen flex flex-col p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Select Your Bank</h1>
        <Button variant="outline" onClick={() => navigate('/bank-connect')}>
          Back
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        {banks.map((bank) => (
          <div 
            key={bank.id}
            onClick={() => handleSelectBank(bank)}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6 cursor-pointer border border-gray-100 hover:border-primary flex items-center space-x-4"
          >
            <span className="text-3xl">{bank.logo}</span>
            <span className="text-lg font-medium">{bank.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BankSelection;
