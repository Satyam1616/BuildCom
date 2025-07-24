const express = require('express');
const jwt = require('jsonwebtoken');
const Invoice = require('../models/Invoice');
const User = require('../models/User');

const router = express.Router();

// Auth middleware
function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// Create invoice
router.post('/', auth, async (req, res) => {
  try {
    const { customerName, customerEmail, items, total, gstAmount, invoiceDate, dueDate, status } = req.body;
    const invoice = await Invoice.create({
      customerName,
      customerEmail,
      items,
      total,
      gstAmount,
      invoiceDate,
      dueDate,
      status,
      createdBy: req.user.id
    });
    res.status(201).json(invoice);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// List invoices for user
router.get('/', auth, async (req, res) => {
  try {
    const invoices = await Invoice.find({ createdBy: req.user.id });
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get invoice by id
router.get('/:id', auth, async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ _id: req.params.id, createdBy: req.user.id });
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update invoice
router.put('/:id', auth, async (req, res) => {
  try {
    const invoice = await Invoice.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      req.body,
      { new: true }
    );
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Delete invoice
router.delete('/:id', auth, async (req, res) => {
  try {
    const invoice = await Invoice.findOneAndDelete({ _id: req.params.id, createdBy: req.user.id });
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json({ message: 'Invoice deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router; 