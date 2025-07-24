import React, { useState, useEffect } from 'react';

function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    customerName: '',
    customerEmail: '',
    description: '',
    quantity: 1,
    rate: 0,
    gstRate: 18,
    dueDate: ''
  });
  const [success, setSuccess] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    async function fetchInvoices() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('http://localhost:5000/api/invoices', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch invoices');
        setInvoices(data);
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    }
    fetchInvoices();
  }, [token, success]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const item = {
      description: form.description,
      quantity: Number(form.quantity),
      rate: Number(form.rate),
      gstRate: Number(form.gstRate)
    };
    const total = item.quantity * item.rate;
    const gstAmount = (total * item.gstRate) / 100;
    try {
      const res = await fetch('http://localhost:5000/api/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          customerName: form.customerName,
          customerEmail: form.customerEmail,
          items: [item],
          total,
          gstAmount,
          dueDate: form.dueDate
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create invoice');
      setSuccess('Invoice created!');
      setForm({ customerName: '', customerEmail: '', description: '', quantity: 1, rate: 0, gstRate: 18, dueDate: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Invoices</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
        <h4>Create New Invoice</h4>
        <input name="customerName" placeholder="Customer Name" value={form.customerName} onChange={handleChange} required />{' '}
        <input name="customerEmail" placeholder="Customer Email" value={form.customerEmail} onChange={handleChange} />{' '}
        <input name="description" placeholder="Item Description" value={form.description} onChange={handleChange} required />{' '}
        <input name="quantity" type="number" min="1" placeholder="Qty" value={form.quantity} onChange={handleChange} required style={{ width: 60 }} />{' '}
        <input name="rate" type="number" min="0" placeholder="Rate" value={form.rate} onChange={handleChange} required style={{ width: 80 }} />{' '}
        <input name="gstRate" type="number" min="0" max="28" placeholder="GST %" value={form.gstRate} onChange={handleChange} required style={{ width: 60 }} />{' '}
        <input name="dueDate" type="date" value={form.dueDate} onChange={handleChange} />{' '}
        <button type="submit">Create</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      {loading ? <p>Loading...</p> : (
        <table border="1" cellPadding="6" style={{ width: '100%', marginTop: 16 }}>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Email</th>
              <th>Item</th>
              <th>Qty</th>
              <th>Rate</th>
              <th>GST %</th>
              <th>Total</th>
              <th>GST Amt</th>
              <th>Status</th>
              <th>Due</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map(inv => (
              <tr key={inv._id}>
                <td>{inv.customerName}</td>
                <td>{inv.customerEmail}</td>
                <td>{inv.items[0]?.description}</td>
                <td>{inv.items[0]?.quantity}</td>
                <td>{inv.items[0]?.rate}</td>
                <td>{inv.items[0]?.gstRate}</td>
                <td>{inv.total}</td>
                <td>{inv.gstAmount}</td>
                <td>{inv.status}</td>
                <td>{inv.dueDate ? inv.dueDate.slice(0,10) : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Invoices; 