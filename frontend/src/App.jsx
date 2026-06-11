import React, { useState, useEffect } from 'react';
import CustomerView from './views/CustomerView';
import AdminLogin from './views/admin/AdminLogin';
import AdminDashboard from './views/admin/AdminDashboard';

function isLoggedIn() {
  return Boolean(localStorage.getItem('raffle_token'));
}

export default function App() {
  const [view, setView] = useState('customer');

  // If token exists on mount, go straight to dashboard
  useEffect(() => {
    if (isLoggedIn()) setView('admin-dashboard');
  }, []);

  function goAdmin() {
    if (isLoggedIn()) {
      setView('admin-dashboard');
    } else {
      setView('admin-login');
    }
  }

  function handleLoginSuccess() {
    setView('admin-dashboard');
  }

  function handleLogout() {
    setView('customer');
  }

  return (
    <React.Fragment>
      {view === 'customer' && (
        <CustomerView onAdminClick={goAdmin} />
      )}

      {view === 'admin-login' && (
        <AdminLogin
          onLogin={handleLoginSuccess}
          onBack={() => setView('customer')}
        />
      )}

      {view === 'admin-dashboard' && (
        <AdminDashboard onLogout={handleLogout} />
      )}
    </React.Fragment>
  );
}