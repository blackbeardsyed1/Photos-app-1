require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const photoRoutes = require('./routes/photoRoutes');

const app = express();

// Replace this with your actual frontend origin
const corsOptions = {
    origin: 'https://agreeable-moss-06d73c10f.6.azurestaticapps.net',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200 // For legacy browser support
  };
  
app.use(cors(corsOptions));
  
  // Handle preflight requests for all routes
app.options('*', cors(corsOptions));



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB().then(() => {
  app.use('/api', authRoutes);
  app.use('/api', photoRoutes);

  app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
  });

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}).catch((err) => {
  console.error('❌ Failed to connect to MongoDB:', err.message);
});