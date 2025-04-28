
import React from 'react';
import { formatDistanceToNow } from 'date-fns';

const TransactionList = ({ transactions }) => {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No transactions yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <div 
          key={transaction.id} 
          className="bg-white rounded-lg shadow p-4 flex justify-between items-center"
        >
          <div className="flex-1">
            <div className="flex justify-between">
              <h3 className="font-medium">{transaction.description}</h3>
              <span 
                className={`font-bold ${
                  transaction.type === 'expense' ? 'text-red-500' : 'text-green-500'
                }`}
              >
                {transaction.type === 'expense' ? '-' : '+'} 
                ${transaction.amount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>{transaction.category}</span>
              <span>{formatTimeAgo(transaction.date)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Helper function to format time ago
function formatTimeAgo(dateString) {
  try {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    return 'Invalid date';
  }
}

export default TransactionList;
