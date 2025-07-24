import React, { useEffect, useState } from 'react';

function Dashboard() {
  const [apiStatus, setApiStatus] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/health')
      .then(res => res.json())
      .then(data => setApiStatus(data.message))
      .catch(() => setApiStatus('Backend not reachable'));
  }, []);

  return (
    <div>
      <h2>Dashboard (MVP)</h2>
      <p>Financial Overview (placeholder)</p>
      <p>Backend status: {apiStatus}</p>
      {/* Add cash in/out, outstanding invoices, bills due, bank balance, alerts, etc. here */}
    </div>
  );
}

export default Dashboard; 