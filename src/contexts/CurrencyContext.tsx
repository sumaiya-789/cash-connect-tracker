
import React, { createContext, useContext, useState, useEffect } from 'react';

type CurrencyType = {
  code: string;
  symbol: string;
  name: string;
};

export const currencies: CurrencyType[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
];

interface CurrencyContextType {
  currency: CurrencyType;
  setCurrency: (currency: CurrencyType) => void;
  formatAmount: (amount: number) => string;
}

const defaultCurrency = currencies[0]; // USD as default

const CurrencyContext = createContext<CurrencyContextType>({
  currency: defaultCurrency,
  setCurrency: () => {},
  formatAmount: () => '',
});

export const useCurrency = () => useContext(CurrencyContext);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<CurrencyType>(() => {
    const savedCurrency = localStorage.getItem('preferredCurrency');
    return savedCurrency ? JSON.parse(savedCurrency) : defaultCurrency;
  });

  useEffect(() => {
    localStorage.setItem('preferredCurrency', JSON.stringify(currency));
  }, [currency]);

  const formatAmount = (amount: number): string => {
    return `${currency.symbol}${amount.toFixed(2)}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatAmount }}>
      {children}
    </CurrencyContext.Provider>
  );
};
