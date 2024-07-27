const express = require('express');
const router = express.Router();
const db = require('../db/database');

// Define the constant initial balance
const INITIAL_BALANCE = 5000;

// Get all transactions
router.get('/all', (req, res) => {
  db.all('SELECT * FROM transactions ORDER BY date DESC', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch transactions' });
    }
    res.json(rows);
  });
});

// Add a new transaction
router.post('/add', (req, res) => {
  const { type, amount, description, date } = req.body;
  if (!type || !amount || !description || !date) {
    return res.status(400).json({ error: 'Please provide all required fields' });
  }

  // Get the latest transactions to calculate the current balance
  db.all('SELECT * FROM transactions ORDER BY date DESC', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch transactions' });
    }

    // Calculate the balance based on existing transactions and initial balance
    let currentBalance = INITIAL_BALANCE;
    rows.forEach(transaction => {
      if (transaction.type === 'Credit') {
        currentBalance += transaction.amount;
      } else if (transaction.type === 'Debit') {
        currentBalance -= transaction.amount;
      }
    });

    let newBalance;
    if (type === 'Credit') {
      newBalance = currentBalance + amount;
    } else if (type === 'Debit') {
      newBalance = currentBalance - amount;
    } else {
      return res.status(400).json({ error: 'Invalid transaction type' });
    }

    // Insert the new transaction
    const stmt = db.prepare('INSERT INTO transactions (type, amount, description, date) VALUES (?, ?, ?, ?)');
    stmt.run(type, amount, description, date, function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to add transaction' });
      }
      res.status(201).json({ id: this.lastID, type, amount, description, date, balance: newBalance });
    });
    stmt.finalize();
  });
});

module.exports = router;
