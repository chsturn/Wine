const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const connectDB = require('./config/db');

// Load env vars
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Connect to Database
connectDB();

// Init Middleware
app.use(cors());
app.use(express.json());

// Define Routes
app.use('/api/users', require('./routes/users'));

// The original /api/wines route, for now
app.get('/api/wines', (req, res) => {
  const winesFilePath = path.join(__dirname, 'wines.json');
  fs.readFile(winesFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error reading wine data');
      return;
    }
    res.setHeader('Content-Type', 'application/json');
    res.send(data);
  });
});

// Start the server only if this file is run directly
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
}

module.exports = app;
