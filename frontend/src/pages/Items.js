import React from 'react';

function Items() {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">📦 Items</h1>
        <p className="page-subtitle">Inventory management with HSN/SAC codes and GST rates</p>
      </div>

      <div className="card">
        <div className="card-header">
          Item Master
        </div>
        <div className="card-body">
          <p>Coming soon - Item management features:</p>
          <ul>
            <li>HSN/SAC code management</li>
            <li>GST rate configuration</li>
            <li>Stock tracking</li>
            <li>Purchase and sale price management</li>
            <li>Unit of measurement</li>
            <li>Category classification</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Items;