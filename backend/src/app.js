const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/accounting_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
const authRouter = require('./routes/auth');
app.use('/api/auth', authRouter);

const invoiceRouter = require('./routes/invoice');
app.use('/api/invoices', invoiceRouter);

const expenseRouter = require('./routes/expense');
app.use('/api/expenses', expenseRouter);

// Import other route files
try {
  const customerRouter = require('./routes/customer');
  app.use('/api/customers', customerRouter);

  const vendorRouter = require('./routes/vendor');
  app.use('/api/vendors', vendorRouter);

  const itemRouter = require('./routes/item');
  app.use('/api/items', itemRouter);

  const purchaseRouter = require('./routes/purchase');
  app.use('/api/purchases', purchaseRouter);

  const bankRouter = require('./routes/bank');
  app.use('/api/banking', bankRouter);

  const companyRouter = require('./routes/company');
  app.use('/api/company', companyRouter);

  const reportsRouter = require('./routes/reports');
  app.use('/api/reports', reportsRouter);

  const dashboardRouter = require('./routes/dashboard');
  app.use('/api/dashboard', dashboardRouter);
} catch (error) {
  console.log('Some route files not yet created, will add them shortly');
}

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Small Firm Accounting API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed');
    process.exit(0);
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Small Firm Accounting Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 API Documentation: http://localhost:${PORT}/api/health`);
});
