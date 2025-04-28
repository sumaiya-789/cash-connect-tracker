
import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { useIsMobile } from "@/hooks/use-mobile";

const SpendingChart = ({ transactions }) => {
  const [viewMode, setViewMode] = useState('weekly');
  const isMobile = useIsMobile();

  // Process transactions by week or month
  const processTransactions = () => {
    if (!transactions || transactions.length === 0) {
      return [];
    }

    // Sort transactions by date
    const sortedTransactions = [...transactions].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    if (viewMode === 'weekly') {
      // Group by week
      const weeklyData = {};
      
      sortedTransactions.forEach(transaction => {
        const date = new Date(transaction.date);
        // Get week number (using Sunday as first day of week)
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        const weekKey = weekStart.toISOString().split('T')[0];
        
        if (!weeklyData[weekKey]) {
          weeklyData[weekKey] = {
            week: `Week ${new Date(weekKey).getDate()}/${new Date(weekKey).getMonth() + 1}`,
            income: 0,
            expense: 0
          };
        }
        
        if (transaction.type === 'income') {
          weeklyData[weekKey].income += transaction.amount;
        } else {
          weeklyData[weekKey].expense += transaction.amount;
        }
      });
      
      return Object.values(weeklyData);
    } else {
      // Group by month
      const monthlyData = {};
      
      sortedTransactions.forEach(transaction => {
        const date = new Date(transaction.date);
        const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
        const monthName = date.toLocaleString('default', { month: 'short' });
        
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = {
            month: monthName,
            income: 0,
            expense: 0
          };
        }
        
        if (transaction.type === 'income') {
          monthlyData[monthKey].income += transaction.amount;
        } else {
          monthlyData[monthKey].expense += transaction.amount;
        }
      });
      
      return Object.values(monthlyData);
    }
  };

  const chartData = processTransactions();
  const chartConfig = {
    income: {
      label: "Income",
      color: "#22c55e"
    },
    expense: {
      label: "Expense",
      color: "#ef4444"
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">Spending Analysis</h2>
        <div className="flex space-x-2">
          <button 
            onClick={() => setViewMode('weekly')}
            className={`px-3 py-1 text-sm rounded-md ${
              viewMode === 'weekly' 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            Weekly
          </button>
          <button 
            onClick={() => setViewMode('monthly')}
            className={`px-3 py-1 text-sm rounded-md ${
              viewMode === 'monthly' 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            Monthly
          </button>
        </div>
      </div>
      
      <div className="h-64 w-full">
        {chartData.length > 0 ? (
          <ChartContainer id="spending-analysis" config={chartConfig} className="h-full">
            {viewMode === 'weekly' ? (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="week" 
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                  height={40}
                />
                <YAxis 
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                  width={isMobile ? 35 : 60}
                  tickFormatter={(value) => `$${value}`}
                />
                <ChartTooltip 
                  content={
                    <ChartTooltipContent 
                      formatter={(value) => [`$${value}`, null]}
                    />
                  }
                />
                <Bar dataKey="income" fill="var(--color-income)" />
                <Bar dataKey="expense" fill="var(--color-expense)" />
                <Legend />
              </BarChart>
            ) : (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                />
                <YAxis 
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                  width={isMobile ? 35 : 60}
                  tickFormatter={(value) => `$${value}`}
                />
                <ChartTooltip 
                  content={
                    <ChartTooltipContent 
                      formatter={(value) => [`$${value}`, null]}
                    />
                  }
                />
                <Line 
                  type="monotone" 
                  dataKey="income" 
                  stroke="var(--color-income)" 
                  strokeWidth={2} 
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="expense" 
                  stroke="var(--color-expense)" 
                  strokeWidth={2} 
                  activeDot={{ r: 6 }}
                />
                <Legend />
              </LineChart>
            )}
          </ChartContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            <p>No data available for {viewMode} view</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpendingChart;
