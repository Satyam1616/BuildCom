const { Customer } = require('../models');
const { gstUtils } = require('../utils');

/**
 * Get all customers with pagination and filtering
 */
const getCustomers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      status = '',
      customerType = ''
    } = req.query;

    const userId = req.user.id;
    const skip = (page - 1) * parseInt(limit);

    // Build filter query
    const filter = { createdBy: userId };
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { gstNumber: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status) {
      filter.status = status;
    }
    
    if (customerType) {
      filter.customerType = customerType;
    }

    // Execute query with pagination
    const [customers, totalCount] = await Promise.all([
      Customer.find(filter)
        .select('-__v')
        .sort({ name: 1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Customer.countDocuments(filter)
    ]);

    res.json({
      customers,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
        totalCount,
        hasNext: skip + customers.length < totalCount,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({ message: 'Error fetching customers', error: error.message });
  }
};

/**
 * Get customer by ID
 */
const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findOne({
      _id: req.params.id,
      createdBy: req.user.id
    });

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json(customer);
  } catch (error) {
    console.error('Get customer by ID error:', error);
    res.status(500).json({ message: 'Error fetching customer', error: error.message });
  }
};

/**
 * Create new customer
 */
const createCustomer = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      gstNumber,
      panNumber,
      address,
      customerType,
      creditLimit,
      creditDays,
      openingBalance
    } = req.body;

    // Validate required fields
    if (!name || !address?.addressLine1 || !address?.city || !address?.state || !address?.pincode) {
      return res.status(400).json({ 
        message: 'Name and complete address are required' 
      });
    }

    // Validate GST number if provided
    if (gstNumber && !gstUtils.validateGSTNumber(gstNumber)) {
      return res.status(400).json({ 
        message: 'Invalid GST number format' 
      });
    }

    // Check for duplicate GST number (if provided)
    if (gstNumber) {
      const existingCustomer = await Customer.findOne({ 
        gstNumber, 
        createdBy: req.user.id 
      });
      if (existingCustomer) {
        return res.status(400).json({ 
          message: 'Customer with this GST number already exists' 
        });
      }
    }

    // Extract state code from GST number or use provided state code
    let stateCode = address.stateCode;
    if (gstNumber) {
      stateCode = gstUtils.getStateCodeFromGST(gstNumber);
      if (!stateCode) {
        return res.status(400).json({ 
          message: 'Invalid state code in GST number' 
        });
      }
    }

    const customerData = {
      name: name.trim(),
      email: email?.trim(),
      phone: phone?.trim(),
      gstNumber: gstNumber?.trim(),
      panNumber: panNumber?.trim(),
      address: {
        ...address,
        stateCode: stateCode || address.stateCode
      },
      customerType: customerType || 'B2C',
      creditLimit: creditLimit || 0,
      creditDays: creditDays || 30,
      openingBalance: openingBalance || 0,
      createdBy: req.user.id
    };

    const customer = await Customer.create(customerData);
    
    res.status(201).json({
      message: 'Customer created successfully',
      customer
    });
  } catch (error) {
    console.error('Create customer error:', error);
    if (error.code === 11000) {
      res.status(400).json({ message: 'Customer with this GST number already exists' });
    } else {
      res.status(500).json({ message: 'Error creating customer', error: error.message });
    }
  }
};

/**
 * Update customer
 */
const updateCustomer = async (req, res) => {
  try {
    const customerId = req.params.id;
    const updates = req.body;

    // Remove fields that shouldn't be updated directly
    delete updates.createdBy;
    delete updates._id;

    // Validate GST number if being updated
    if (updates.gstNumber && !gstUtils.validateGSTNumber(updates.gstNumber)) {
      return res.status(400).json({ 
        message: 'Invalid GST number format' 
      });
    }

    // Check for duplicate GST number (if being updated)
    if (updates.gstNumber) {
      const existingCustomer = await Customer.findOne({ 
        gstNumber: updates.gstNumber, 
        createdBy: req.user.id,
        _id: { $ne: customerId }
      });
      if (existingCustomer) {
        return res.status(400).json({ 
          message: 'Another customer with this GST number already exists' 
        });
      }
    }

    // Update state code if GST number is being updated
    if (updates.gstNumber) {
      const stateCode = gstUtils.getStateCodeFromGST(updates.gstNumber);
      if (stateCode && updates.address) {
        updates.address.stateCode = stateCode;
      }
    }

    const customer = await Customer.findOneAndUpdate(
      { _id: customerId, createdBy: req.user.id },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json({
      message: 'Customer updated successfully',
      customer
    });
  } catch (error) {
    console.error('Update customer error:', error);
    if (error.code === 11000) {
      res.status(400).json({ message: 'Customer with this GST number already exists' });
    } else {
      res.status(500).json({ message: 'Error updating customer', error: error.message });
    }
  }
};

/**
 * Delete customer (soft delete by setting status to inactive)
 */
const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      { status: 'Inactive' },
      { new: true }
    );

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json({
      message: 'Customer deactivated successfully',
      customer
    });
  } catch (error) {
    console.error('Delete customer error:', error);
    res.status(500).json({ message: 'Error deleting customer', error: error.message });
  }
};

/**
 * Get customer ledger (transaction history)
 */
const getCustomerLedger = async (req, res) => {
  try {
    const customerId = req.params.id;
    const { startDate, endDate } = req.query;

    // Verify customer belongs to user
    const customer = await Customer.findOne({
      _id: customerId,
      createdBy: req.user.id
    });

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Build date filter
    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    // Get all invoices for this customer
    const Invoice = require('../models/Invoice');
    const invoices = await Invoice.find({
      customerId: customerId,
      createdBy: req.user.id,
      ...(Object.keys(dateFilter).length > 0 && { invoiceDate: dateFilter })
    })
    .sort({ invoiceDate: 1 })
    .select('invoiceNumber invoiceDate grandTotal paidAmount balanceAmount status');

    // Calculate running balance
    let runningBalance = customer.openingBalance || 0;
    const transactions = [];

    // Add opening balance entry
    transactions.push({
      date: customer.createdAt,
      description: 'Opening Balance',
      debit: customer.openingBalance > 0 ? customer.openingBalance : 0,
      credit: customer.openingBalance < 0 ? Math.abs(customer.openingBalance) : 0,
      balance: runningBalance,
      type: 'Opening'
    });

    // Add invoice transactions
    for (const invoice of invoices) {
      // Invoice created (debit to customer account)
      runningBalance += invoice.grandTotal;
      transactions.push({
        date: invoice.invoiceDate,
        description: `Invoice ${invoice.invoiceNumber}`,
        debit: invoice.grandTotal,
        credit: 0,
        balance: runningBalance,
        type: 'Invoice',
        reference: invoice._id
      });

      // Payments received (credit to customer account)
      if (invoice.paidAmount > 0) {
        runningBalance -= invoice.paidAmount;
        transactions.push({
          date: invoice.invoiceDate, // In real system, this would be payment date
          description: `Payment for Invoice ${invoice.invoiceNumber}`,
          debit: 0,
          credit: invoice.paidAmount,
          balance: runningBalance,
          type: 'Payment',
          reference: invoice._id
        });
      }
    }

    res.json({
      customer: {
        id: customer._id,
        name: customer.name,
        openingBalance: customer.openingBalance || 0
      },
      transactions,
      summary: {
        openingBalance: customer.openingBalance || 0,
        closingBalance: runningBalance,
        totalDebits: transactions.reduce((sum, t) => sum + t.debit, 0),
        totalCredits: transactions.reduce((sum, t) => sum + t.credit, 0)
      }
    });
  } catch (error) {
    console.error('Get customer ledger error:', error);
    res.status(500).json({ message: 'Error fetching customer ledger', error: error.message });
  }
};

/**
 * Get customer statements (aged receivables)
 */
const getCustomerStatement = async (req, res) => {
  try {
    const customerId = req.params.id;

    const customer = await Customer.findOne({
      _id: customerId,
      createdBy: req.user.id
    });

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const Invoice = require('../models/Invoice');
    const currentDate = new Date();

    // Get outstanding invoices
    const outstandingInvoices = await Invoice.find({
      customerId: customerId,
      createdBy: req.user.id,
      status: { $in: ['Sent', 'Partially Paid'] },
      balanceAmount: { $gt: 0 }
    })
    .sort({ invoiceDate: 1 })
    .select('invoiceNumber invoiceDate dueDate grandTotal paidAmount balanceAmount');

    // Categorize by aging
    const aging = {
      current: 0,      // 0-30 days
      days31to60: 0,   // 31-60 days
      days61to90: 0,   // 61-90 days
      over90: 0        // Over 90 days
    };

    const agedInvoices = outstandingInvoices.map(invoice => {
      const daysOverdue = invoice.dueDate 
        ? Math.floor((currentDate - invoice.dueDate) / (1000 * 60 * 60 * 24))
        : 0;

      let ageCategory = 'current';
      if (daysOverdue > 90) {
        ageCategory = 'over90';
        aging.over90 += invoice.balanceAmount;
      } else if (daysOverdue > 60) {
        ageCategory = 'days61to90';
        aging.days61to90 += invoice.balanceAmount;
      } else if (daysOverdue > 30) {
        ageCategory = 'days31to60';
        aging.days31to60 += invoice.balanceAmount;
      } else {
        aging.current += invoice.balanceAmount;
      }

      return {
        ...invoice.toObject(),
        daysOverdue: Math.max(0, daysOverdue),
        ageCategory
      };
    });

    const totalOutstanding = aging.current + aging.days31to60 + aging.days61to90 + aging.over90;

    res.json({
      customer: {
        id: customer._id,
        name: customer.name,
        creditLimit: customer.creditLimit,
        creditDays: customer.creditDays
      },
      outstandingInvoices: agedInvoices,
      aging,
      summary: {
        totalOutstanding,
        creditAvailable: Math.max(0, customer.creditLimit - totalOutstanding),
        overdueAmount: aging.days31to60 + aging.days61to90 + aging.over90
      }
    });
  } catch (error) {
    console.error('Get customer statement error:', error);
    res.status(500).json({ message: 'Error fetching customer statement', error: error.message });
  }
};

/**
 * Import customers from CSV
 */
const importCustomers = async (req, res) => {
  try {
    // This would be implemented with multer for file upload
    // For now, return a placeholder response
    res.status(501).json({ 
      message: 'Customer import functionality to be implemented with file upload' 
    });
  } catch (error) {
    console.error('Import customers error:', error);
    res.status(500).json({ message: 'Error importing customers', error: error.message });
  }
};

/**
 * Export customers to CSV
 */
const exportCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({ 
      createdBy: req.user.id 
    })
    .select('-__v -createdBy')
    .sort({ name: 1 });

    // In a real implementation, this would generate and return a CSV file
    res.json({
      message: 'Export functionality to be implemented',
      count: customers.length,
      customers: customers
    });
  } catch (error) {
    console.error('Export customers error:', error);
    res.status(500).json({ message: 'Error exporting customers', error: error.message });
  }
};

module.exports = {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerLedger,
  getCustomerStatement,
  importCustomers,
  exportCustomers
};