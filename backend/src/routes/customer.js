const express = require('express');
const router = express.Router();
const {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerLedger,
  getCustomerStatement,
  importCustomers,
  exportCustomers
} = require('../controllers/customerController');

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

// Customer CRUD routes
router.get('/', authenticateToken, getCustomers);
router.post('/', authenticateToken, createCustomer);
router.get('/export', authenticateToken, exportCustomers);
router.post('/import', authenticateToken, importCustomers);
router.get('/:id', authenticateToken, getCustomerById);
router.put('/:id', authenticateToken, updateCustomer);
router.delete('/:id', authenticateToken, deleteCustomer);

// Customer reports
router.get('/:id/ledger', authenticateToken, getCustomerLedger);
router.get('/:id/statement', authenticateToken, getCustomerStatement);

module.exports = router;