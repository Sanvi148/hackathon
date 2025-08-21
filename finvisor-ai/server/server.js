import dotenv from 'dotenv';
dotenv.config();

// You can remove the test console.log now if you want
console.log('--- DOTENV TEST ---');
console.log('My Gemini Key is:', process.env.GEMINI_API_KEY);
console.log('--- END OF TEST ---');


import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import authRoutes from './routes/auth.js';
import transactionRoutes from './routes/transactions.js';
// Import the CREATOR FUNCTION, not the router
import createAiRouter from './routes/ai.js';

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

// --- THIS IS THE KEY CHANGE ---
// Create the AI router by calling the function and passing the keys
const aiRouter = createAiRouter(process.env.GEMINI_API_KEY,process.env.FINNHUB_API_KEY);

// --- Use the routers ---
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/ai', aiRouter); // Use the router that was returned by the function

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
