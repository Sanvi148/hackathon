import React from 'react';
import api from '../api/axios';
import { TrashIcon } from '@heroicons/react/24/outline';

// --- THIS IS THE KEY FIX (PART 3) ---
// Receive 'onTransactionDeleted' instead of 'setTransactions'
const TransactionList = ({ transactions, onTransactionDeleted }) => {
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await api.delete(`/transactions/${id}`);
        // Call the parent's function with the ID of the deleted transaction
        onTransactionDeleted(id);
      } catch (err) { 
        console.error("Failed to delete transaction", err);
      }
    }
  };

  return (
    <div className="list-container">
      <h3 className="list-title">Recent Transactions</h3>
      {transactions.length === 0 ? (
        <p className="text-gray-400 p-4 text-center">No transactions yet.</p>
      ) : (
        <div className="space-y-3">
          {transactions.map(t => (
            <div key={t._id} className="transaction-item">
              <div>
                <p className="transaction-category">{t.category}</p>
                <p className="transaction-date">{new Date(t.date).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`transaction-amount ${t.type === 'income' ? 'amount-income' : 'amount-expense'}`}>
                  {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                </span>
                <button onClick={() => handleDelete(t._id)} className="btn-delete">
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionList;
