const express = require('express');
const cors = require('cors');
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
app.use('/api/wines', require('./routes/wines'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/geo', require('./routes/geo'));

// Start the server only if this file is run directly
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
}

module.exports = app;
