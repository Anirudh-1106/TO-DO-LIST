const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const taskRoutes = require('./routes/tasks');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/todo-app';

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/tasks', taskRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected (using in-memory fallback)',
    message: 'Backend server is running',
  });
});

// Attempt MongoDB connection with 3-second timeout so server starts without hanging
mongoose
  .connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 3000,
  })
  .then(() => {
    console.log(`[MongoDB] Connected successfully to ${MONGODB_URI}`);
  })
  .catch((err) => {
    console.warn(`[MongoDB] Could not connect to ${MONGODB_URI}: ${err.message}`);
    console.log(`[MongoDB] Running with in-memory fallback until MongoDB is available.`);
  });

app.listen(PORT, () => {
  console.log(`[Server] Backend listening on http://localhost:${PORT}`);
});
