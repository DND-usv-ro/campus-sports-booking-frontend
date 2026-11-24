import React, { useState } from 'react';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminNavbar from './pages/admin/AdminNavbar';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminCalendarPage from './pages/admin/AdminCalendarPage';
import AdminMaintenancePage from './pages/admin/AdminMaintenancePage';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authView, setAuthView] = useState('login');
  const [adminTab, setAdminTab] = useState('panou');

  if (!currentUser) {
    if (authView === 'register') {
      return (
        <RegisterPage
          onRegisterSuccess={(user) => setCurrentUser(user)}
          onSwitchToLogin={() => setAuthView('login')}
        />
      );
    }

    return (
      <LoginPage
        onLoginSuccess={(user) => setCurrentUser(user)}
        onSwitchToRegister={() => setAuthView('register')}
      />
    );
  }

  // Interfața pentru Administrator
  if (currentUser.rol === 'Admin') {
    return (
      <div className="admin-layout">
        <AdminNavbar
          currentUser={currentUser}
          activeTab={adminTab}
          onSelectTab={(tab) => setAdminTab(tab)}
          onLogout={() => {
            setCurrentUser(null);
            setAdminTab('panou');
          }}
        />

        {adminTab === 'panou' && <AdminDashboardPage />}
        {adminTab === 'calendar' && <AdminCalendarPage />}
        {adminTab === 'mentenanta' && <AdminMaintenancePage />}
      </div>
    );
  }

  // Interfața pentru Student / Profesor (unde lucrează colega ta)
  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <span
        style={{
          padding: '6px 14px',
          borderRadius: '20px',
          backgroundColor: '#dbeafe',
          color: '#1e3a8a',
          fontWeight: 'bold',
          fontSize: '13px',
        }}
      >
        Rol: {currentUser.rol}
      </span>

      <h2 style={{ marginTop: '16px' }}>Bun venit, {currentUser.nume}!</h2>
      <p style={{ color: '#64748b' }}>{currentUser.email}</p>
      <p style={{ color: '#0f172a', fontWeight: '500' }}>
        Pagina principală de utilizator (în lucru de către colegă).
      </p>

      <button
        onClick={() => setCurrentUser(null)}
        style={{
          marginTop: '20px',
          padding: '12px 24px',
          backgroundColor: '#1e3a8a',
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          cursor: 'pointer',
          fontWeight: 'bold',
        }}
      >
        Deconectare
      </button>
    </div>
  );
}

export default App;