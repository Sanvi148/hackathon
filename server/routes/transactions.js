import express from 'express';
import auth from '../middleware/auth.js';
import Transaction from '../models/Transaction.js';

const router = express.Router();

// --- GET /api/transactions ---
// (This route for fetching transactions is likely correct, but we include it for completeness)
router.get('/', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    console.error("Error fetching transactions:", err.message);
    res.status(500).send('Server Error');
  }
});


// --- POST /api/transactions --- (THIS IS THE CRITICAL FIX)
// This route creates a new transaction and saves it to the database.
router.post('/', auth, async (req, res) => {
  try {
    const { amount, type, category, description } = req.body;

    // 1. Create a new document in memory using the Mongoose model
    const newTransaction = new Transaction({
      user: req.user.id, // Associate the transaction with the logged-in user
      amount,
      type,
      category,
      description
    });

    // 2. The most important step: Asynchronously save the document to MongoDB
    const transaction = await newTransaction.save();

    // 3. Log success to the server console for debugging
    console.log('SUCCESS: New transaction saved to MongoDB:', transaction);

    // 4. Send the newly created transaction back to the frontend
    res.json(transaction);

  } catch (err) {
    // If ANY error occurs during creation or saving, it will be caught here
    console.error("--- TRANSACTION SAVE FAILED ---");
    console.error("Error details:", err.message);
    res.status(500).send('Server Error: Could not save transaction.');
  }
});


// --- DELETE /api/transactions/:id ---
// (This route is also included for completeness)
router.delete('/:id', auth, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ msg: 'Transaction not found' });
    }
    // Ensure the user owns the transaction
    if (transaction.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await transaction.deleteOne(); // Use deleteOne() on the document instance
    res.json({ msg: 'Transaction removed' });
  } catch (err) {
    console.error("Error deleting transaction:", err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
