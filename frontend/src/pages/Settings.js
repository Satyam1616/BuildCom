import React from 'react';

function Settings() {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">⚙️ Settings</h1>
        <p className="page-subtitle">Configure your business and system preferences</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        
        {/* Company Information */}
        <div className="card">
          <div className="card-header">
            🏢 Company Information
          </div>
          <div className="card-body">
            <div className="form-group">
              <label className="form-label">Company Name</label>
              <input type="text" className="form-control" placeholder="Enter company name" />
            </div>
            <div className="form-group">
              <label className="form-label">GST Number</label>
              <input type="text" className="form-control" placeholder="Enter GST number" />
            </div>
            <div className="form-group">
              <label className="form-label">PAN Number</label>
              <input type="text" className="form-control" placeholder="Enter PAN number" />
            </div>
            <div className="form-group">
              <label className="form-label">Business Type</label>
              <select className="form-control">
                <option>Sole Proprietorship</option>
                <option>Partnership</option>
                <option>Private Limited Company</option>
                <option>LLP</option>
              </select>
            </div>
            <button className="btn btn-primary">Update Company Info</button>
          </div>
        </div>

        {/* Tax Configuration */}
        <div className="card">
          <div className="card-header">
            💰 Tax Configuration
          </div>
          <div className="card-body">
            <div className="form-group">
              <label className="form-label">GST Filing Frequency</label>
              <select className="form-control">
                <option>Monthly</option>
                <option>Quarterly</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Financial Year Start</label>
              <select className="form-control">
                <option>April</option>
                <option>January</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">TAN Number</label>
              <input type="text" className="form-control" placeholder="Enter TAN number" />
            </div>
            <div className="form-group">
              <label className="form-label">Composite Scheme</label>
              <select className="form-control">
                <option>No</option>
                <option>Yes</option>
              </select>
            </div>
            <button className="btn btn-primary">Update Tax Settings</button>
          </div>
        </div>

        {/* Invoice Settings */}
        <div className="card">
          <div className="card-header">
            📄 Invoice Settings
          </div>
          <div className="card-body">
            <div className="form-group">
              <label className="form-label">Invoice Prefix</label>
              <input type="text" className="form-control" defaultValue="INV" />
            </div>
            <div className="form-group">
              <label className="form-label">Invoice Numbering</label>
              <select className="form-control">
                <option>Sequential</option>
                <option>Reset Yearly</option>
                <option>Reset Monthly</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Payment Terms</label>
              <input type="text" className="form-control" placeholder="Payment due within 30 days" />
            </div>
            <div className="form-group">
              <label className="form-label">Invoice Notes</label>
              <textarea className="form-control" rows="3" placeholder="Default notes for invoices"></textarea>
            </div>
            <button className="btn btn-primary">Update Invoice Settings</button>
          </div>
        </div>

        {/* Banking Settings */}
        <div className="card">
          <div className="card-header">
            🏦 Banking Settings
          </div>
          <div className="card-body">
            <div className="form-group">
              <label className="form-label">Primary Bank Account</label>
              <select className="form-control">
                <option>Select bank account</option>
                <option>HDFC Bank - ****1234</option>
                <option>ICICI Bank - ****5678</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Base Currency</label>
              <select className="form-control">
                <option>INR</option>
                <option>USD</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Decimal Places</label>
              <select className="form-control">
                <option>2</option>
                <option>0</option>
              </select>
            </div>
            <button className="btn btn-primary">Update Banking Settings</button>
          </div>
        </div>

      </div>

      {/* User Preferences */}
      <div className="card" style={{ marginTop: '1.5rem' }}>
        <div className="card-header">
          👤 User Preferences
        </div>
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <div>
              <h5>Notifications</h5>
              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input type="checkbox" defaultChecked />
                  Email notifications for due invoices
                </label>
              </div>
              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input type="checkbox" defaultChecked />
                  GST filing reminders
                </label>
              </div>
              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input type="checkbox" />
                  Weekly business summary
                </label>
              </div>
            </div>
            
            <div>
              <h5>Display Options</h5>
              <div className="form-group">
                <label className="form-label">Date Format</label>
                <select className="form-control">
                  <option>DD/MM/YYYY</option>
                  <option>MM/DD/YYYY</option>
                  <option>YYYY-MM-DD</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Number Format</label>
                <select className="form-control">
                  <option>Indian (1,00,000)</option>
                  <option>International (100,000)</option>
                </select>
              </div>
            </div>
            
            <div>
              <h5>Security</h5>
              <div className="form-group">
                <button className="btn btn-warning">Change Password</button>
              </div>
              <div className="form-group">
                <button className="btn btn-info">Enable Two-Factor Authentication</button>
              </div>
              <div className="form-group">
                <button className="btn btn-secondary">Download Account Data</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="card" style={{ marginTop: '1.5rem' }}>
        <div className="card-header">
          💾 Data Management
        </div>
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <button className="btn btn-success">📥 Import Data</button>
            <button className="btn btn-primary">📤 Export Data</button>
            <button className="btn btn-info">🔄 Backup Data</button>
            <button className="btn btn-warning">🗄️ Archive Old Records</button>
          </div>
          
          <div className="alert alert-info" style={{ marginTop: '1rem' }}>
            <strong>📋 Chart of Accounts:</strong> 
            <button className="btn btn-outline btn-sm" style={{ marginLeft: '1rem' }}>Reset to Default</button>
            <button className="btn btn-outline btn-sm" style={{ marginLeft: '0.5rem' }}>Customize Accounts</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;