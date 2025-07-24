import React from 'react';

function Reports() {
  const reports = [
    {
      category: "GST Reports",
      items: [
        { name: "GSTR-1", description: "Outward supplies return" },
        { name: "GSTR-3B", description: "Monthly summary return" },
        { name: "GSTR-2A", description: "Purchase register" },
        { name: "GST Summary", description: "Monthly GST summary" }
      ]
    },
    {
      category: "Financial Reports",
      items: [
        { name: "Profit & Loss", description: "Income statement" },
        { name: "Balance Sheet", description: "Financial position" },
        { name: "Cash Flow", description: "Cash flow statement" },
        { name: "Trial Balance", description: "Account balances" }
      ]
    },
    {
      category: "TDS Reports",
      items: [
        { name: "TDS Summary", description: "TDS deducted summary" },
        { name: "TDS Quarterly Return", description: "Quarterly TDS return data" },
        { name: "TDS Certificates", description: "TDS certificate generation" }
      ]
    },
    {
      category: "Business Reports",
      items: [
        { name: "Sales Report", description: "Customer-wise sales analysis" },
        { name: "Purchase Report", description: "Vendor-wise purchase analysis" },
        { name: "Outstanding Report", description: "Receivables and payables" },
        { name: "Aging Report", description: "Overdue analysis" }
      ]
    }
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">📊 Reports</h1>
        <p className="page-subtitle">Comprehensive reporting for Indian compliance and business analysis</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        {reports.map((category, index) => (
          <div key={index} className="card">
            <div className="card-header">
              {category.category}
            </div>
            <div className="card-body">
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {category.items.map((report, reportIndex) => (
                  <div key={reportIndex} style={{ 
                    padding: '0.75rem', 
                    border: '1px solid #e9ecef', 
                    borderRadius: '6px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <div style={{ fontWeight: '500' }}>{report.name}</div>
                      <div style={{ color: '#6c757d', fontSize: '0.875rem' }}>{report.description}</div>
                    </div>
                    <button className="btn btn-primary btn-sm">Generate</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: '1.5rem' }}>
        <div className="card-header">
          📈 Quick Analytics
        </div>
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            <div className="metric-card">
              <div className="metric-value">₹2,50,000</div>
              <div className="metric-label">This Month Revenue</div>
            </div>
            <div className="metric-card">
              <div className="metric-value">₹12,600</div>
              <div className="metric-label">GST Payable</div>
            </div>
            <div className="metric-card">
              <div className="metric-value">₹8,400</div>
              <div className="metric-label">TDS Deducted</div>
            </div>
            <div className="metric-card">
              <div className="metric-value">28.0%</div>
              <div className="metric-label">Profit Margin</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;