import React, { useState, useEffect } from 'react';

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    vendorName: '',
    category: '',
    amount: '',
    paymentMethod: '',
    expenseDate: '',
    description: '',
    status: 'pending'
  });
  const [success, setSuccess] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    async function fetchExpenses() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('http://localhost:5000/api/expenses', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch expenses');
        setExpenses(data);
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    }
    fetchExpenses();
  }, [token, success]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetch('http://localhost:5000/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create expense');
      setSuccess('Expense created!');
      setForm({ vendorName: '', category: '', amount: '', paymentMethod: '', expenseDate: '', description: '', status: 'pending' });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Expenses</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
        <h4>Add New Expense</h4>
        <input name="vendorName" placeholder="Vendor Name" value={form.vendorName} onChange={handleChange} />{' '}
        <input name="category" placeholder="Category" value={form.category} onChange={handleChange} required />{' '}
        <input name="amount" type="number" min="0" placeholder="Amount" value={form.amount} onChange={handleChange} required style={{ width: 80 }} />{' '}
        <input name="paymentMethod" placeholder="Payment Method" value={form.paymentMethod} onChange={handleChange} />{' '}
        <input name="expenseDate" type="date" value={form.expenseDate} onChange={handleChange} />{' '}
        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />{' '}
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
        </select>{' '}
        <button type="submit">Add</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      {loading ? <p>Loading...</p> : (
        <table border="1" cellPadding="6" style={{ width: '100%', marginTop: 16 }}>
          <thead>
            <tr>
              <th>Vendor</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Payment</th>
              <th>Date</th>
              <th>Description</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map(exp => (
              <tr key={exp._id}>
                <td>{exp.vendorName}</td>
                <td>{exp.category}</td>
                <td>{exp.amount}</td>
                <td>{exp.paymentMethod}</td>
                <td>{exp.expenseDate ? exp.expenseDate.slice(0,10) : ''}</td>
                <td>{exp.description}</td>
                <td>{exp.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Expenses; 