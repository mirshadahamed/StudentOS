require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const taskRoutes = require('./routes/tasks');
const aiRoutes = require('./routes/ai');
const focusRoutes = require('./routes/focus');

const app = express();

// 1. CORS Policy - Allows your Next.js frontend to connect
app.use(cors({
  origin: '*', // Allow all origins for development
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: false,
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// 2. Body Parsers - Essential for reading JSON from the frontend
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('🍃 MongoDB connected successfully'))
  .catch(err => console.error('❌ MongoDB error:', err.message));

// 4. Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/focus', focusRoutes);

// 5. Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', server: 'StudentOS Backend', port: process.env.PORT || 5000 });
});

// 6. Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 StudentOS Backend running on http://localhost:${PORT}`);
});