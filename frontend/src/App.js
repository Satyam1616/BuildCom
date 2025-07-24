import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Invoices from './pages/Invoices';
import Expenses from './pages/Expenses';
import Banking from './pages/Banking';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

// Auth context
const AuthContext = createContext();
export function useAuth() {
  return useContext(AuthContext);
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for token and user info in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      // In a real app, decode token or fetch user info
      setUser({ token });
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    setUser({ token });
  };
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) {
    return <div>Please log in to access this page.</div>;
  }
  return children;
}

function AppNav() {
  const { user, logout } = useAuth();
  return (
    <nav style={{ padding: '1rem', background: '#f0f0f0', marginBottom: '2rem' }}>
      <Link to="/" style={{ marginRight: 16 }}>Dashboard</Link>
      <Link to="/invoices" style={{ marginRight: 16 }}>Invoices</Link>
      <Link to="/expenses" style={{ marginRight: 16 }}>Expenses</Link>
      <Link to="/banking" style={{ marginRight: 16 }}>Banking</Link>
      {user && <Link to="/profile" style={{ marginRight: 16 }}>Profile</Link>}
      {user ? (
        <button onClick={logout} style={{ marginLeft: 16 }}>Logout</button>
      ) : (
        <>
          <Link to="/login" style={{ marginRight: 16 }}>Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
}

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  return <Login onLogin={token => { login(token); navigate('/'); }} />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppNav />
        <Routes>
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/invoices" element={<ProtectedRoute><Invoices /></ProtectedRoute>} />
          <Route path="/expenses" element={<ProtectedRoute><Expenses /></ProtectedRoute>} />
          <Route path="/banking" element={<ProtectedRoute><Banking /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
