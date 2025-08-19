import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import api from '../api/axios';

// Import all child components
import SummaryCards from '../components/SummaryCards';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import SpendingChart from '../components/SpendingChart';
import AIAssistant from '../components/AIAssistant';

const DashboardPage = () => {
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  // Fetch initial transactions when the page loads
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await api.get('/transactions');
        setTransactions(res.data);
      } catch (err) {
        console.error("Failed to fetch transactions", err);
      }
    };
    fetchTransactions();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // --- THIS IS THE KEY FIX (PART 1) ---
  // This function will be called by the TransactionForm component
  const handleTransactionAdded = (newTransaction) => {
    // Add the new transaction to the top of the existing list, triggering a re-render
    setTransactions([newTransaction, ...transactions]);
  };

  // This function will be called by the TransactionList component
  const handleTransactionDeleted = (deletedTransactionId) => {
    // Remove the deleted transaction from the list, triggering a re-render
    setTransactions(transactions.filter(t => t._id !== deletedTransactionId));
  };

  return (
    <div className="p-4 md:p-8 bg-gray-900 min-h-screen">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Welcome Back, User!</h1>
          <p className="text-gray-400">Here's your complete financial overview.</p>
        </div>
        <button onClick={handleLogout} className="btn-secondary">Logout</button>
      </header>
      
      <main>
        <SummaryCards transactions={transactions} />
        
        {/* Pass the callback function to the form */}
        <TransactionForm onTransactionAdded={handleTransactionAdded} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2">
            {/* Pass the callback function to the list */}
            <TransactionList transactions={transactions} onTransactionDeleted={handleTransactionDeleted} />
          </div>
          <div>
            <SpendingChart transactions={transactions} />
            <div className="mt-8">
              <AIAssistant transactions={transactions} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
