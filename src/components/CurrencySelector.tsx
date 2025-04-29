
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppContext, CurrencyType, CURRENCY_SYMBOLS } from "@/context/AppContext";

const CurrencySelector = () => {
  const { currency, setCurrency } = useAppContext();

  const handleCurrencyChange = (value: string) => {
    setCurrency(value as CurrencyType);
  };

  return (
    <Select value={currency} onValueChange={handleCurrencyChange}>
      <SelectTrigger className="w-[90px] h-9">
        <SelectValue placeholder={currency} />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(CURRENCY_SYMBOLS).map(([code, symbol]) => (
          <SelectItem key={code} value={code}>
            {symbol} {code}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CurrencySelector;
