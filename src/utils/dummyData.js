
// Generate random amount between min and max
const randomAmount = (min, max) => {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
};

// Random date within the last 30 days
const randomDate = () => {
  const now = new Date();
  const daysAgo = Math.floor(Math.random() * 30);
  const date = new Date(now);
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

// List of transaction descriptions for realistic dummy data
const expenseDescriptions = [
  { text: "Grocery Shopping", category: "Groceries" },
  { text: "Dinner at Restaurant", category: "Dining" },
  { text: "Uber Ride", category: "Transport" },
  { text: "Amazon Purchase", category: "Shopping" },
  { text: "Netflix Subscription", category: "Entertainment" },
  { text: "Electricity Bill", category: "Utilities" },
  { text: "Phone Bill", category: "Utilities" },
  { text: "Gym Membership", category: "Health" },
  { text: "Coffee Shop", category: "Food" },
  { text: "Movie Tickets", category: "Entertainment" },
];

const incomeDescriptions = [
  { text: "Salary Deposit", category: "Salary" },
  { text: "Freelance Payment", category: "Freelance" },
  { text: "Client Invoice", category: "Business" },
  { text: "Dividend Payment", category: "Investment" },
  { text: "Rental Income", category: "Property" },
  { text: "Tax Refund", category: "Tax" },
  { text: "Interest", category: "Savings" },
];

// Function to generate a list of dummy transactions
export const getDummyTransactions = (count = 15) => {
  const transactions = [];
  
  // Generate random income transactions (30% of total)
  const incomeCount = Math.floor(count * 0.3);
  for (let i = 0; i < incomeCount; i++) {
    const desc = incomeDescriptions[Math.floor(Math.random() * incomeDescriptions.length)];
    transactions.push({
      id: `income-${i}-${Date.now()}`,
      type: 'income',
      amount: randomAmount(500, 3000),
      description: desc.text,
      category: desc.category,
      date: randomDate(),
    });
  }
  
  // Generate random expense transactions (70% of total)
  const expenseCount = count - incomeCount;
  for (let i = 0; i < expenseCount; i++) {
    const desc = expenseDescriptions[Math.floor(Math.random() * expenseDescriptions.length)];
    transactions.push({
      id: `expense-${i}-${Date.now()}`,
      type: 'expense',
      amount: randomAmount(5, 200),
      description: desc.text,
      category: desc.category,
      date: randomDate(),
    });
  }
  
  // Sort by date (most recent first)
  return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
};
