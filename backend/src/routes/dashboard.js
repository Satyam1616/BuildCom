const express = require('express');
const router = express.Router();
const { getDashboardOverview, getFinancialTrends } = require('../controllers/dashboardController');

// Middleware to authenticate user (you'll need to implement this)
const authenticateToken = (req, res, next) => {
  // Simple placeholder middleware - replace with proper JWT authentication
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }
  
  // For now, mock a user - replace with proper JWT verification
  req.user = { id: '507f1f77bcf86cd799439011' }; // Mock user ID
  next();
};

// Dashboard overview route
router.get('/overview', authenticateToken, getDashboardOverview);

// Financial trends route
router.get('/trends', authenticateToken, getFinancialTrends);

module.exports = router;