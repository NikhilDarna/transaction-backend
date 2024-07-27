const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const transactions = require('./routes/transaction'); // Ensure this path is correct

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

app.use('/transactions', transactions);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
