import React from 'react';
import { ArrowUpCircleIcon, ArrowDownCircleIcon, ScaleIcon } from '@heroicons/react/24/outline';

const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

const SummaryCards = ({ transactions }) => {
  const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const expenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const balance = income - expenses;

  return (
    // Use the global class names from index.css
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="summary-card">
        <ScaleIcon className="h-10 w-10 text-cyan-400" />
        <div>
          <p className="text-gray-400">Current Balance</p>
          <p className="text-2xl font-semibold">{formatCurrency(balance)}</p>
        </div>
      </div>
      <div className="summary-card">
        <ArrowUpCircleIcon className="h-10 w-10 text-green-400" />
        <div>
          <p className="text-gray-400">Total Income</p>
          <p className="text-2xl font-semibold">{formatCurrency(income)}</p>
        </div>
      </div>
      <div className="summary-card">
        <ArrowDownCircleIcon className="h-10 w-10 text-red-400" />
        <div>
          <p className="text-gray-400">Total Expenses</p>
          <p className="text-2xl font-semibold">{formatCurrency(expenses)}</p>
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;
