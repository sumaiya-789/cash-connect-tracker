
// Function to get transactions from localStorage
export const getTransactions = () => {
  try {
    const transactions = localStorage.getItem('transactions');
    return transactions ? JSON.parse(transactions) : [];
  } catch (error) {
    console.error('Error getting transactions from localStorage:', error);
    return [];
  }
};

// Function to save transactions to localStorage
export const saveTransactions = (transactions) => {
  try {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  } catch (error) {
    console.error('Error saving transactions to localStorage:', error);
  }
};
