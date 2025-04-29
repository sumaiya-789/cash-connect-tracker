
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Define all supported currencies
export type CurrencyType = "USD" | "EUR" | "GBP" | "JPY" | "CAD";

type CurrencySymbol = {
  [key in CurrencyType]: string;
};

export const CURRENCY_SYMBOLS: CurrencySymbol = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  CAD: "C$",
};

type AppContextType = {
  currency: CurrencyType;
  setCurrency: (currency: CurrencyType) => void;
  currencySymbol: string;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
};

const defaultContext: AppContextType = {
  currency: "USD",
  setCurrency: () => {},
  currencySymbol: "$",
  isDarkMode: false,
  toggleDarkMode: () => {},
};

const AppContext = createContext<AppContextType>(defaultContext);

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrency] = useState<CurrencyType>(() => {
    const saved = localStorage.getItem("currency");
    return (saved as CurrencyType) || "USD";
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved === "true" || false;
  });
  
  const currencySymbol = CURRENCY_SYMBOLS[currency];
  
  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };
  
  // Update currency in localStorage when it changes
  useEffect(() => {
    localStorage.setItem("currency", currency);
  }, [currency]);
  
  // Update dark mode in localStorage and apply class to document
  useEffect(() => {
    localStorage.setItem("darkMode", isDarkMode.toString());
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <AppContext.Provider 
      value={{ 
        currency, 
        setCurrency, 
        currencySymbol, 
        isDarkMode, 
        toggleDarkMode
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
