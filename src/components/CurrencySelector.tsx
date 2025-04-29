
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCurrency, currencies } from '@/contexts/CurrencyContext';

const CurrencySelector: React.FC = () => {
  const { currency, setCurrency } = useCurrency();

  const handleCurrencyChange = (value: string) => {
    const selected = currencies.find(c => c.code === value);
    if (selected) {
      setCurrency(selected);
    }
  };

  return (
    <div className="flex items-center">
      <Select value={currency.code} onValueChange={handleCurrencyChange}>
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder="Currency" />
        </SelectTrigger>
        <SelectContent>
          {currencies.map((curr) => (
            <SelectItem key={curr.code} value={curr.code}>
              {curr.symbol} {curr.code} - {curr.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CurrencySelector;
