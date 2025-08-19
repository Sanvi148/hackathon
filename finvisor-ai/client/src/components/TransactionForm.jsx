import React, { useState } from 'react';
import api from '../api/axios';

// --- THIS IS THE KEY FIX (PART 2) ---
// Destructure the new function from the props
const TransactionForm = ({ onTransactionAdded }) => {
  const [formData, setFormData] = useState({ type: 'expense', amount: '', category: '', description: '' });
  const { type, amount, category, description } = formData;
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    if (!amount || !category) return;
    try {
      const res = await api.post('/transactions', { ...formData, amount: parseFloat(amount) });
      
      // Call the parent's function with the new transaction data from the API
      onTransactionAdded(res.data);
      
      // Reset the form fields
      setFormData({ type: 'expense', amount: '', category: '', description: '' });
    } catch (err) { console.error("Failed to add transaction", err); }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg mb-8">
      <h3 className="list-title">Add a New Transaction</h3>
      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center mt-4">
        <select name="type" value={type} onChange={onChange} className="select-field">
          <option value="expense">Expense</option><option value="income">Income</option>
        </select>
        <input name="amount" type="number" value={amount} onChange={onChange} placeholder="Amount" required className="input-field" />
        <input name="category" value={category} onChange={onChange} placeholder="Category (e.g., Food)" required className="input-field" />
        <input name="description" value={description} onChange={onChange} placeholder="Description" className="input-field" />
        <button type="submit" className="btn-primary h-full">Add</button>
      </form>
    </div>
  );
};

export default TransactionForm;
