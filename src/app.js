const express = require('express');
const cors = require('cors');

// Import routes
const userRoutes = require('./routes/user.routes');
const complaintRoutes = require('./routes/complaint.routes');
const projectRoutes = require('./routes/project.routes');

const app = express();

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get('/', (req, res) => {
  res.status(200).send('Smart Village Backend API is running!');
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Smart Village Backend is running!' 
  });
});

// Mount application API routes
app.use('/api/users', userRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/projects', projectRoutes);

// Global 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

module.exports = app;

// Enable CORS so React can send requests
app.use(cors({
  origin: true, // Allows requests from your Vite frontend URL
  credentials: true
}));

app.use(express.json());