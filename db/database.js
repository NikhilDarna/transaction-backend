const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:'); // Use ':memory:' for in-memory database or specify a file path for persistent storage

db.serialize(() => {
  db.run(`CREATE TABLE transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    amount REAL NOT NULL,
    description TEXT NOT NULL,
    date TEXT NOT NULL
  )`);

  // Add initial credit transaction with the fixed balance
  const stmt = db.prepare("INSERT INTO transactions (type, amount, description, date) VALUES (?, ?, ?, ?)");
  
  stmt.finalize();
});

module.exports = db;
