import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const SpendingChart = ({ transactions }) => {
  // 1. Filter to get only expense transactions.
  const expenseTransactions = transactions.filter(t => t.type === 'expense');

  // 2. Group expenses by category.
  const expenseData = expenseTransactions.reduce((acc, t) => {
    const category = t.category.toLowerCase() === 'bussiness' ? 'Business' : t.category;
    acc[category] = (acc[category] || 0) + t.amount;
    return acc;
  }, {});

  // 3. Prepare data for the chart.
  const chartData = Object.keys(expenseData).map(key => ({
    name: key,
    value: expenseData[key],
  }));

  const COLORS = ['#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

  // --- THIS IS THE FINAL FIX ---
  // A new, robust label renderer that correctly handles small percentages.
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const RADIAN = Math.PI / 180;
    // Position the label slightly outside the pie for clarity
    const radius = outerRadius + 15; 
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    // Calculate the percentage and format it. Use a minimum of '<1%' for tiny values.
    const percentage = (percent * 100);
    const displayPercent = percentage < 1 && percentage > 0 ? '<1%' : `${percentage.toFixed(0)}%`;

    // Don't render a label for a 0% slice
    if (percentage === 0) return null;

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-xs font-semibold"
      >
        {`${chartData[index].name} (${displayPercent})`}
      </text>
    );
  };

  return (
    <div className="chart-card">
      <h3 className="list-title">Expense Breakdown</h3>
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart margin={{ top: 20, right: 30, left: 30, bottom: 40 }}>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false} // We are drawing our own labels
              label={renderCustomizedLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex justify-center items-center h-full text-gray-400">
          <p>No expense data to display.</p>
        </div>
      )}
    </div>
  );
};

export default SpendingChart;
