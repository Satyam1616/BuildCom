import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Invoices from './pages/Invoices';
import Expenses from './pages/Expenses';
import Banking from './pages/Banking';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Customers from './pages/Customers';
import Vendors from './pages/Vendors';
import Items from './pages/Items';
import Purchases from './pages/Purchases';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import './App.css';

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
  
  if (!user) {
    return (
      <nav className="navbar">
        <div className="nav-brand">
          <h2>🏢 Small Firm Accounting</h2>
        </div>
        <div className="nav-links">
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/register" className="nav-link">Register</Link>
        </div>
      </nav>
    );
  }

  return (
    <div className="app-layout">
      <nav className="sidebar">
        <div className="sidebar-header">
          <h3>📊 Accounting</h3>
        </div>
        
        <div className="nav-section">
          <h4>Overview</h4>
          <Link to="/" className="nav-item">📈 Dashboard</Link>
        </div>

        <div className="nav-section">
          <h4>Sales</h4>
          <Link to="/customers" className="nav-item">👥 Customers</Link>
          <Link to="/invoices" className="nav-item">📄 Invoices</Link>
        </div>

        <div className="nav-section">
          <h4>Purchases</h4>
          <Link to="/vendors" className="nav-item">🏭 Vendors</Link>
          <Link to="/purchases" className="nav-item">📋 Bills</Link>
          <Link to="/expenses" className="nav-item">💰 Expenses</Link>
        </div>

        <div className="nav-section">
          <h4>Inventory</h4>
          <Link to="/items" className="nav-item">📦 Items</Link>
        </div>

        <div className="nav-section">
          <h4>Banking</h4>
          <Link to="/banking" className="nav-item">🏦 Banking</Link>
        </div>

        <div className="nav-section">
          <h4>Reports</h4>
          <Link to="/reports" className="nav-item">📊 Reports</Link>
        </div>

        <div className="nav-section">
          <h4>Settings</h4>
          <Link to="/settings" className="nav-item">⚙️ Settings</Link>
          <Link to="/profile" className="nav-item">👤 Profile</Link>
        </div>

        <div className="nav-footer">
          <button onClick={logout} className="logout-btn">🚪 Logout</button>
        </div>
      </nav>
      
      <main className="main-content">
        <Routes>
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
          <Route path="/vendors" element={<ProtectedRoute><Vendors /></ProtectedRoute>} />
          <Route path="/items" element={<ProtectedRoute><Items /></ProtectedRoute>} />
          <Route path="/invoices" element={<ProtectedRoute><Invoices /></ProtectedRoute>} />
          <Route path="/purchases" element={<ProtectedRoute><Purchases /></ProtectedRoute>} />
          <Route path="/expenses" element={<ProtectedRoute><Expenses /></ProtectedRoute>} />
          <Route path="/banking" element={<ProtectedRoute><Banking /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
}

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  return <Login onLogin={token => { login(token); navigate('/'); }} />;
}

function App() {
  const { user } = useAuth();
  
  return (
    <Router>
      {user ? (
        <AppNav />
      ) : (
        <>
          <AppNav />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<LoginPage />} />
          </Routes>
        </>
      )}
    </Router>
  );
}

function AppWithAuth() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

export default AppWithAuth;
