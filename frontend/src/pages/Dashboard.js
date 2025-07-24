import React, { useEffect, useState } from 'react';

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Mock data for now since backend might not be fully running
      const mockData = {
        financialSummary: {
          cashIn: 125000,
          cashOut: 87500,
          netCashFlow: 37500,
          monthlyRevenue: 250000,
          monthlyExpenses: 180000,
          netProfit: 70000
        },
        receivables: {
          outstandingAmount: 150000,
          outstandingCount: 12,
          overdueAmount: 45000,
          overdueCount: 3
        },
        payables: {
          billsDueAmount: 85000,
          billsDueCount: 8
        },
        banking: {
          totalBalance: 325000,
          recentTransactions: [
            { _id: 1, description: 'Customer Payment - INV-001', amount: 25000, transactionType: 'Credit', transactionDate: '2024-01-20' },
            { _id: 2, description: 'Office Rent Payment', amount: 15000, transactionType: 'Debit', transactionDate: '2024-01-19' },
            { _id: 3, description: 'Utility Bill Payment', amount: 3500, transactionType: 'Debit', transactionDate: '2024-01-18' }
          ]
        },
        compliance: {
          gstSummary: {
            outputGST: 45000,
            inputGST: 32400,
            netGSTPayable: 12600
          },
          alerts: [
            { type: 'GST Filing', message: 'GST filing due for January 2024', priority: 'high' },
            { type: 'Overdue Invoices', message: '3 invoices are overdue', priority: 'high' },
            { type: 'Bills Due', message: '5 bills due within 7 days', priority: 'medium' }
          ]
        }
      };
      
      setDashboardData(mockData);
      setError('');
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        <strong>Error:</strong> {error}
        <button onClick={fetchDashboardData} className="btn btn-primary btn-sm" style={{ marginLeft: '1rem' }}>
          Retry
        </button>
      </div>
    );
  }

  if (!dashboardData) {
    return <div>No data available</div>;
  }

  const { financialSummary, receivables, payables, banking, compliance } = dashboardData;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">📊 Dashboard</h1>
        <p className="page-subtitle">Financial overview and key business metrics</p>
        <div className="indian-flag-colors"></div>
      </div>

      {/* Financial Summary Cards */}
      <div className="dashboard-grid">
        <div className="metric-card success">
          <div className="metric-value currency">{formatCurrency(financialSummary.monthlyRevenue)}</div>
          <div className="metric-label">Monthly Revenue</div>
        </div>
        
        <div className="metric-card">
          <div className="metric-value currency">{formatCurrency(financialSummary.monthlyExpenses)}</div>
          <div className="metric-label">Monthly Expenses</div>
        </div>
        
        <div className="metric-card success">
          <div className="metric-value currency">{formatCurrency(financialSummary.netProfit)}</div>
          <div className="metric-label">Net Profit</div>
        </div>
        
        <div className="metric-card">
          <div className="metric-value currency">{formatCurrency(banking.totalBalance)}</div>
          <div className="metric-label">Total Bank Balance</div>
        </div>
      </div>

      {/* Cash Flow & Outstanding */}
      <div className="dashboard-grid">
        <div className="metric-card success">
          <div className="metric-value currency">{formatCurrency(financialSummary.cashIn)}</div>
          <div className="metric-label">Cash In (This Month)</div>
        </div>
        
        <div className="metric-card warning">
          <div className="metric-value currency">{formatCurrency(financialSummary.cashOut)}</div>
          <div className="metric-label">Cash Out (This Month)</div>
        </div>
        
        <div className="metric-card warning">
          <div className="metric-value currency">{formatCurrency(receivables.outstandingAmount)}</div>
          <div className="metric-label">Outstanding Receivables</div>
        </div>
        
        <div className="metric-card danger">
          <div className="metric-value currency">{formatCurrency(receivables.overdueAmount)}</div>
          <div className="metric-label">Overdue Amount</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        
        {/* Recent Transactions */}
        <div className="card">
          <div className="card-header">
            🏦 Recent Transactions
          </div>
          <div className="card-body">
            {banking.recentTransactions.length > 0 ? (
              <div>
                {banking.recentTransactions.map(transaction => (
                  <div key={transaction._id} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '0.75rem 0',
                    borderBottom: '1px solid #e9ecef'
                  }}>
                    <div>
                      <div style={{ fontWeight: '500' }}>{transaction.description}</div>
                      <div style={{ color: '#6c757d', fontSize: '0.875rem' }}>
                        {new Date(transaction.transactionDate).toLocaleDateString('en-IN')}
                      </div>
                    </div>
                    <div style={{ 
                      color: transaction.transactionType === 'Credit' ? '#27ae60' : '#e74c3c',
                      fontWeight: 'bold'
                    }}>
                      {transaction.transactionType === 'Credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#6c757d', textAlign: 'center' }}>No recent transactions</p>
            )}
          </div>
        </div>

        {/* GST Summary */}
        <div className="card">
          <div className="card-header">
            📋 GST Summary (This Month)
          </div>
          <div className="card-body">
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Output GST:</span>
                <span className="currency gst-highlight">{formatCurrency(compliance.gstSummary.outputGST)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Input Tax Credit:</span>
                <span className="currency">{formatCurrency(compliance.gstSummary.inputGST)}</span>
              </div>
              <hr />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                <span>Net GST Payable:</span>
                <span className="currency" style={{ color: '#e74c3c' }}>
                  {formatCurrency(compliance.gstSummary.netGSTPayable)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts & Reminders */}
        <div className="card">
          <div className="card-header">
            🔔 Important Alerts
          </div>
          <div className="card-body">
            {compliance.alerts.length > 0 ? (
              <div>
                {compliance.alerts.map((alert, index) => (
                  <div key={index} className={`alert alert-${alert.priority === 'high' ? 'danger' : alert.priority === 'medium' ? 'warning' : 'info'}`}>
                    <strong>{alert.type}:</strong> {alert.message}
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#6c757d', textAlign: 'center' }}>No pending alerts</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <div className="card-header">
            ⚡ Quick Actions
          </div>
          <div className="card-body">
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              <button className="btn btn-primary">+ Create Invoice</button>
              <button className="btn btn-success">+ Add Customer</button>
              <button className="btn btn-warning">+ Record Expense</button>
              <button className="btn btn-info">📊 View Reports</button>
            </div>
          </div>
        </div>
      </div>

      {/* Business Summary */}
      <div className="card" style={{ marginTop: '1.5rem' }}>
        <div className="card-header">
          📈 Business Summary
        </div>
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3498db' }}>
                {receivables.outstandingCount}
              </div>
              <div style={{ color: '#6c757d' }}>Outstanding Invoices</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#e74c3c' }}>
                {receivables.overdueCount}
              </div>
              <div style={{ color: '#6c757d' }}>Overdue Invoices</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f39c12' }}>
                {payables.billsDueCount}
              </div>
              <div style={{ color: '#6c757d' }}>Bills Due</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#27ae60' }}>
                {((financialSummary.netProfit / financialSummary.monthlyRevenue) * 100).toFixed(1)}%
              </div>
              <div style={{ color: '#6c757d' }}>Profit Margin</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 