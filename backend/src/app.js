const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const authRouter = require('./routes/auth');
app.use('/api/auth', authRouter);

const invoiceRouter = require('./routes/invoice');
app.use('/api/invoices', invoiceRouter);

const expenseRouter = require('./routes/expense');
app.use('/api/expenses', expenseRouter);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

// Placeholder for other routes
// app.use('/api/yourroute', require('./routes/yourroute'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
