import express from 'express';
import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';
import auth from '../middleware/auth.js';
import Transaction from '../models/Transaction.js';

// This function now accepts the Finnhub key
const createAiRouter = (geminiApiKey, finnhubApiKey) => {
  const router = express.Router();
  
  if (!geminiApiKey) throw new Error("FATAL: Gemini API Key is missing.");
  const genAI = new GoogleGenerativeAI(geminiApiKey);

  // NEW: Reliable market data fetcher using Finnhub.io
  async function getMarketData() {
    if (!finnhubApiKey) {
      console.log("Finnhub API key not configured. Skipping market data.");
      return null;
    }

    const symbols = ['SPY', 'QQQ']; // Key market ETFs
    let marketDataString = "### Real-Time Market Snapshot\n";
    let success = false;

    try {
      for (const symbol of symbols) {
        const response = await axios.get(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${finnhubApiKey}`);
        const quote = response.data;
        if (quote && quote.c) { // 'c' is the current price
          marketDataString += `*   **${symbol}:** Current Price $${quote.c}, Change ${quote.d} (${quote.dp.toFixed(2)}%)\n`;
          success = true;
        }
      }
      return success ? marketDataString : null;
    } catch (error) {
      console.error("Failed to fetch Finnhub market data:", error.message);
      return null; // Return null on any error
    }
  }

  router.get('/advice', auth, async (req, res) => {
    try {
      const [transactions, marketData] = await Promise.all([
        Transaction.find({ user: req.user.id }).limit(100),
        getMarketData() // Fetch market data concurrently
      ]);

      const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
      const expenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
      
      let prompt;

      // --- CONDITIONAL PROMPT LOGIC ---
      if (marketData) {
        // --- PROMPT 1: When real-time data IS available ---
        prompt = `
          You are FinVisor, an expert AI financial coach. A user has this summary:
          - Income: $${income.toFixed(2)}, Expenses: $${expenses.toFixed(2)}
          
          ${marketData}

          Analyze BOTH their personal finances AND the real-time market data to provide advice.
          Structure your response in HTML (<h3>, <ul>, <li>).
          Your response MUST contain three sections:
          1.  **Savings & Budgeting:** A tip based on their income/expenses.
          2.  **Tax Insight:** A relevant tax optimization tip.
          3.  **Investment Opportunities:** Suggest 1-2 specific investment ideas directly related to the provided market data (e.g., "Given the market is up, consider...").
          
          Keep the tone professional and encouraging. End with a disclaimer.
        `;
      } else {
        // --- PROMPT 2: Fallback when real-time data IS NOT available ---
        prompt = `
          You are FinVisor, an expert AI financial coach. A user has this summary:
          - Income: $${income.toFixed(2)}, Expenses: $${expenses.toFixed(2)}

          Real-time market data is currently unavailable.
          Provide clear, general advice based ONLY on their personal finances.
          Structure your response in HTML (<h3>, <ul>, <li>).
          Your response MUST contain three sections:
          1.  **Savings & Budgeting:** A tip based on their income/expenses.
          2.  **Tax Insight:** A relevant tax optimization tip.
          3.  **General Investment Strategy:** Since market data is unavailable, recommend a timeless strategy like diversification or dollar-cost averaging into index funds.
          
          Keep the tone professional and encouraging. End with a disclaimer.
        `;
      }

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      const adviceText = result.response.text();

      res.json({ advice: adviceText });

    } catch (err) {
      console.error("AI Generation Failed:", err);
      res.status(500).json({ msg: 'AI service failed.' });
    }
  });

  return router;
};

export default createAiRouter;
