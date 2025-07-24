const mongoose = require('mongoose');
const moment = require('moment');
const { Invoice, Purchase, Expense, BankAccount, BankTransaction, Customer, Vendor } = require('../models');

/**
 * Get dashboard overview with key financial metrics
 */
const getDashboardOverview = async (req, res) => {
  try {
    const userId = req.user.id;
    const currentDate = new Date();
    const startOfMonth = moment().startOf('month').toDate();
    const endOfMonth = moment().endOf('month').toDate();
    const startOfYear = moment().startOf('year').toDate();

    // Parallel execution of all dashboard queries
    const [
      totalCashInOut,
      monthlyRevenue,
      monthlyExpenses,
      outstandingInvoices,
      overdueInvoices,
      billsDue,
      bankBalance,
      recentTransactions,
      topCustomers,
      topExpenseCategories,
      gstSummary,
      upcomingAlerts
    ] = await Promise.all([
      // Total cash in/out this month
      getCashInOut(userId, startOfMonth, endOfMonth),
      
      // Monthly revenue
      getMonthlyRevenue(userId, startOfMonth, endOfMonth),
      
      // Monthly expenses
      getMonthlyExpenses(userId, startOfMonth, endOfMonth),
      
      // Outstanding invoices
      getOutstandingInvoices(userId),
      
      // Overdue invoices
      getOverdueInvoices(userId),
      
      // Bills due this month
      getBillsDue(userId, endOfMonth),
      
      // Total bank balance
      getTotalBankBalance(userId),
      
      // Recent transactions
      getRecentTransactions(userId, 5),
      
      // Top customers by revenue
      getTopCustomers(userId, startOfYear),
      
      // Top expense categories
      getTopExpenseCategories(userId, startOfMonth, endOfMonth),
      
      // GST summary
      getGSTSummary(userId, startOfMonth, endOfMonth),
      
      // Upcoming alerts
      getUpcomingAlerts(userId)
    ]);

    const dashboardData = {
      financialSummary: {
        cashIn: totalCashInOut.cashIn,
        cashOut: totalCashInOut.cashOut,
        netCashFlow: totalCashInOut.cashIn - totalCashInOut.cashOut,
        monthlyRevenue: monthlyRevenue,
        monthlyExpenses: monthlyExpenses,
        netProfit: monthlyRevenue - monthlyExpenses
      },
      
      receivables: {
        outstandingAmount: outstandingInvoices.totalAmount,
        outstandingCount: outstandingInvoices.count,
        overdueAmount: overdueInvoices.totalAmount,
        overdueCount: overdueInvoices.count
      },
      
      payables: {
        billsDueAmount: billsDue.totalAmount,
        billsDueCount: billsDue.count
      },
      
      banking: {
        totalBalance: bankBalance,
        recentTransactions: recentTransactions
      },
      
      insights: {
        topCustomers: topCustomers,
        topExpenseCategories: topExpenseCategories
      },
      
      compliance: {
        gstSummary: gstSummary,
        alerts: upcomingAlerts
      },
      
      lastUpdated: currentDate
    };

    res.json(dashboardData);
  } catch (error) {
    console.error('Dashboard overview error:', error);
    res.status(500).json({ message: 'Error fetching dashboard data', error: error.message });
  }
};

/**
 * Get cash in/out for a period
 */
async function getCashInOut(userId, startDate, endDate) {
  const cashIn = await BankTransaction.aggregate([
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(userId),
        transactionDate: { $gte: startDate, $lte: endDate },
        transactionType: 'Credit'
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' }
      }
    }
  ]);

  const cashOut = await BankTransaction.aggregate([
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(userId),
        transactionDate: { $gte: startDate, $lte: endDate },
        transactionType: 'Debit'
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' }
      }
    }
  ]);

  return {
    cashIn: cashIn[0]?.total || 0,
    cashOut: cashOut[0]?.total || 0
  };
}

/**
 * Get monthly revenue
 */
async function getMonthlyRevenue(userId, startDate, endDate) {
  const revenue = await Invoice.aggregate([
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(userId),
        invoiceDate: { $gte: startDate, $lte: endDate },
        status: { $ne: 'Cancelled' }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$grandTotal' }
      }
    }
  ]);

  return revenue[0]?.total || 0;
}

/**
 * Get monthly expenses
 */
async function getMonthlyExpenses(userId, startDate, endDate) {
  const expenses = await Expense.aggregate([
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(userId),
        expenseDate: { $gte: startDate, $lte: endDate },
        status: { $ne: 'Cancelled' }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$totalAmount' }
      }
    }
  ]);

  return expenses[0]?.total || 0;
}

/**
 * Get outstanding invoices
 */
async function getOutstandingInvoices(userId) {
  const outstanding = await Invoice.aggregate([
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(userId),
        status: { $in: ['Sent', 'Partially Paid'] }
      }
    },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: '$balanceAmount' },
        count: { $sum: 1 }
      }
    }
  ]);

  return {
    totalAmount: outstanding[0]?.totalAmount || 0,
    count: outstanding[0]?.count || 0
  };
}

/**
 * Get overdue invoices
 */
async function getOverdueInvoices(userId) {
  const currentDate = new Date();
  const overdue = await Invoice.aggregate([
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(userId),
        dueDate: { $lt: currentDate },
        status: { $in: ['Sent', 'Partially Paid'] }
      }
    },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: '$balanceAmount' },
        count: { $sum: 1 }
      }
    }
  ]);

  return {
    totalAmount: overdue[0]?.totalAmount || 0,
    count: overdue[0]?.count || 0
  };
}

/**
 * Get bills due this month
 */
async function getBillsDue(userId, endDate) {
  const currentDate = new Date();
  const bills = await Purchase.aggregate([
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(userId),
        dueDate: { $gte: currentDate, $lte: endDate },
        status: { $in: ['Received', 'Partially Paid'] }
      }
    },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: '$balanceAmount' },
        count: { $sum: 1 }
      }
    }
  ]);

  return {
    totalAmount: bills[0]?.totalAmount || 0,
    count: bills[0]?.count || 0
  };
}

/**
 * Get total bank balance
 */
async function getTotalBankBalance(userId) {
  const balance = await BankAccount.aggregate([
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(userId),
        isActive: true
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$currentBalance' }
      }
    }
  ]);

  return balance[0]?.total || 0;
}

/**
 * Get recent transactions
 */
async function getRecentTransactions(userId, limit = 5) {
  return await BankTransaction.find({
    createdBy: userId
  })
  .populate('bankAccountId', 'accountName bankName')
  .sort({ transactionDate: -1 })
  .limit(limit)
  .select('transactionDate description amount transactionType category');
}

/**
 * Get top customers by revenue
 */
async function getTopCustomers(userId, startDate) {
  return await Invoice.aggregate([
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(userId),
        invoiceDate: { $gte: startDate },
        status: { $ne: 'Cancelled' }
      }
    },
    {
      $group: {
        _id: '$customerId',
        customerName: { $first: '$customerName' },
        totalRevenue: { $sum: '$grandTotal' },
        invoiceCount: { $sum: 1 }
      }
    },
    {
      $sort: { totalRevenue: -1 }
    },
    {
      $limit: 5
    }
  ]);
}

/**
 * Get top expense categories
 */
async function getTopExpenseCategories(userId, startDate, endDate) {
  return await Expense.aggregate([
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(userId),
        expenseDate: { $gte: startDate, $lte: endDate },
        status: { $ne: 'Cancelled' }
      }
    },
    {
      $group: {
        _id: '$category',
        totalAmount: { $sum: '$totalAmount' },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { totalAmount: -1 }
    },
    {
      $limit: 5
    }
  ]);
}

/**
 * Get GST summary for the month
 */
async function getGSTSummary(userId, startDate, endDate) {
  const salesGST = await Invoice.aggregate([
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(userId),
        invoiceDate: { $gte: startDate, $lte: endDate },
        status: { $ne: 'Cancelled' }
      }
    },
    {
      $group: {
        _id: null,
        totalCGST: { $sum: '$totalCGST' },
        totalSGST: { $sum: '$totalSGST' },
        totalIGST: { $sum: '$totalIGST' }
      }
    }
  ]);

  const purchaseGST = await Purchase.aggregate([
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(userId),
        billDate: { $gte: startDate, $lte: endDate },
        status: { $ne: 'Cancelled' }
      }
    },
    {
      $group: {
        _id: null,
        totalCGST: { $sum: '$totalCGST' },
        totalSGST: { $sum: '$totalSGST' },
        totalIGST: { $sum: '$totalIGST' }
      }
    }
  ]);

  const sales = salesGST[0] || { totalCGST: 0, totalSGST: 0, totalIGST: 0 };
  const purchases = purchaseGST[0] || { totalCGST: 0, totalSGST: 0, totalIGST: 0 };

  return {
    outputGST: sales.totalCGST + sales.totalSGST + sales.totalIGST,
    inputGST: purchases.totalCGST + purchases.totalSGST + purchases.totalIGST,
    netGSTPayable: (sales.totalCGST + sales.totalSGST + sales.totalIGST) - 
                   (purchases.totalCGST + purchases.totalSGST + purchases.totalIGST)
  };
}

/**
 * Get upcoming alerts and reminders
 */
async function getUpcomingAlerts(userId) {
  const currentDate = new Date();
  const oneWeekFromNow = moment().add(7, 'days').toDate();
  const oneMonthFromNow = moment().add(30, 'days').toDate();

  const alerts = [];

  // GST filing alerts (based on current date)
  const currentMonth = moment().format('MMMM YYYY');
  if (moment().date() >= 15) {
    alerts.push({
      type: 'GST Filing',
      message: `GST filing due for ${currentMonth}`,
      dueDate: moment().add(1, 'month').date(20).toDate(),
      priority: 'high'
    });
  }

  // Invoice due alerts
  const overdueInvoices = await Invoice.countDocuments({
    createdBy: userId,
    dueDate: { $lt: currentDate },
    status: { $in: ['Sent', 'Partially Paid'] }
  });

  if (overdueInvoices > 0) {
    alerts.push({
      type: 'Overdue Invoices',
      message: `${overdueInvoices} invoices are overdue`,
      priority: 'high'
    });
  }

  // Bills due alerts
  const upcomingBills = await Purchase.countDocuments({
    createdBy: userId,
    dueDate: { $gte: currentDate, $lte: oneWeekFromNow },
    status: { $in: ['Received', 'Partially Paid'] }
  });

  if (upcomingBills > 0) {
    alerts.push({
      type: 'Bills Due',
      message: `${upcomingBills} bills due within 7 days`,
      priority: 'medium'
    });
  }

  return alerts.slice(0, 5); // Return top 5 alerts
}

/**
 * Get financial trends (monthly comparison)
 */
const getFinancialTrends = async (req, res) => {
  try {
    const userId = req.user.id;
    const months = parseInt(req.query.months) || 6;
    
    const trends = [];
    
    for (let i = 0; i < months; i++) {
      const startDate = moment().subtract(i, 'months').startOf('month').toDate();
      const endDate = moment().subtract(i, 'months').endOf('month').toDate();
      const monthName = moment().subtract(i, 'months').format('MMM YYYY');
      
      const [revenue, expenses] = await Promise.all([
        getMonthlyRevenue(userId, startDate, endDate),
        getMonthlyExpenses(userId, startDate, endDate)
      ]);
      
      trends.unshift({
        month: monthName,
        revenue,
        expenses,
        profit: revenue - expenses
      });
    }
    
    res.json(trends);
  } catch (error) {
    console.error('Financial trends error:', error);
    res.status(500).json({ message: 'Error fetching financial trends', error: error.message });
  }
};

module.exports = {
  getDashboardOverview,
  getFinancialTrends
};