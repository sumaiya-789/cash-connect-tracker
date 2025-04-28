
import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  ChartLegend
} from "@/components/ui/chart";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartLine, ChartPie } from "lucide-react";

const SpendingChart = ({ transactions }) => {
  const [viewMode, setViewMode] = useState('weekly');
  const [chartType, setChartType] = useState('trends');
  const isMobile = useIsMobile();

  // Process transactions by week or month for line chart
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

  // Process transactions by category for pie chart
  const processCategoryData = () => {
    if (!transactions || transactions.length === 0) {
      return [];
    }

    // Only consider expense transactions for the pie chart
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    
    // Group by category
    const categoryData = {};
    
    expenseTransactions.forEach(transaction => {
      const category = transaction.category || 'Uncategorized';
      
      if (!categoryData[category]) {
        categoryData[category] = 0;
      }
      
      categoryData[category] += transaction.amount;
    });
    
    // Convert to array format for PieChart
    return Object.entries(categoryData).map(([name, value]) => ({
      name,
      value
    }));
  };

  const trendsData = processTransactions();
  const categoryData = processCategoryData();
  
  const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', 
    '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c', '#d0ed57'
  ];

  const trendChartConfig = {
    income: {
      label: "Income",
      color: "#22c55e"
    },
    expense: {
      label: "Expense",
      color: "#ef4444"
    }
  };

  const categoryChartConfig = categoryData.reduce((config, entry, index) => {
    config[entry.name] = {
      label: entry.name,
      color: COLORS[index % COLORS.length]
    };
    return config;
  }, {});

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Spending Analysis</CardTitle>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setChartType('trends')}
              className={`p-2 rounded-md flex items-center ${
                chartType === 'trends' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-gray-100 text-gray-700'
              }`}
              title="Trends"
            >
              <ChartLine className="h-4 w-4" />
            </button>
            <button
              onClick={() => setChartType('categories')}
              className={`p-2 rounded-md flex items-center ${
                chartType === 'categories' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-gray-100 text-gray-700'
              }`}
              title="Categories"
            >
              <ChartPie className="h-4 w-4" />
            </button>
          </div>
        </div>

        {chartType === 'trends' && (
          <div className="flex mt-2">
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
        )}
      </CardHeader>
      
      <CardContent>
        <div className="h-64">
          {chartType === 'trends' ? (
            trendsData.length > 0 ? (
              <ChartContainer id="spending-trends" config={trendChartConfig} className="h-full">
                <LineChart data={trendsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey={viewMode === 'weekly' ? "week" : "month"} 
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
              </ChartContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                <p>No data available for {viewMode} view</p>
              </div>
            )
          ) : (
            categoryData.length > 0 ? (
              <ChartContainer id="spending-categories" config={categoryChartConfig} className="h-full">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={isMobile ? 70 : 90}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip 
                    content={
                      <ChartTooltipContent 
                        formatter={(value) => [`$${value.toFixed(2)}`, null]}
                      />
                    }
                  />
                  <Legend />
                </PieChart>
              </ChartContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                <p>No category data available</p>
              </div>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SpendingChart;
