import React from 'react';

function Purchases() {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">📋 Purchase Bills</h1>
        <p className="page-subtitle">Manage supplier bills with TDS calculation and ITC tracking</p>
      </div>

      <div className="card">
        <div className="card-header">
          Purchase Management
        </div>
        <div className="card-body">
          <p>Coming soon - Purchase bill management:</p>
          <ul>
            <li>Automated TDS calculation</li>
            <li>Input Tax Credit (ITC) tracking</li>
            <li>Multi-item bills</li>
            <li>Payment tracking</li>
            <li>Vendor bill reconciliation</li>
            <li>GST compliance</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Purchases;