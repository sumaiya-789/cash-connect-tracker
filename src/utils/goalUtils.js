
// Function to save goals to localStorage
export const saveGoals = (goals) => {
  try {
    localStorage.setItem('goals', JSON.stringify(goals));
  } catch (error) {
    console.error('Error saving goals to localStorage:', error);
  }
};

// Function to get goals from localStorage
export const getGoals = () => {
  try {
    const goals = localStorage.getItem('goals');
    return goals ? JSON.parse(goals) : [];
  } catch (error) {
    console.error('Error getting goals from localStorage:', error);
    return [];
  }
};

// Calculate suggested monthly savings
export const calculateSuggestedMonthlySavings = (targetAmount, deadline) => {
  const currentDate = new Date();
  const deadlineDate = new Date(deadline);
  
  // Calculate months between now and deadline
  const monthsLeft = (deadlineDate.getFullYear() - currentDate.getFullYear()) * 12 + 
                     (deadlineDate.getMonth() - currentDate.getMonth());
  
  // If deadline is in the past or today, return the full amount
  if (monthsLeft <= 0) {
    return targetAmount;
  }
  
  // Calculate and round to 2 decimal places
  return (targetAmount / monthsLeft).toFixed(2);
};

// Calculate progress percentage
export const calculateProgressPercentage = (savedAmount, targetAmount) => {
  if (targetAmount <= 0) return 0;
  const percentage = (savedAmount / targetAmount) * 100;
  return Math.min(Math.max(percentage, 0), 100); // Clamp between 0-100
};

// Get progress color based on percentage
export const getProgressColor = (percentage) => {
  if (percentage < 25) return "bg-red-500";
  if (percentage < 75) return "bg-yellow-500";
  return "bg-green-500";
};

// Get priority color
export const getPriorityColor = (priority) => {
  switch (priority.toLowerCase()) {
    case 'low':
      return 'text-blue-500';
    case 'medium':
      return 'text-yellow-500';
    case 'high':
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
};

// Get priority badge background
export const getPriorityBadgeBg = (priority) => {
  switch (priority.toLowerCase()) {
    case 'low':
      return 'bg-blue-100 text-blue-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'high':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
