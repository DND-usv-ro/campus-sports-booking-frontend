import React, { useState } from 'react';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminNavbar from './pages/admin/AdminNavbar';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminCalendarPage from './pages/admin/AdminCalendarPage';
import AdminMaintenancePage from './pages/admin/AdminMaintenancePage';
import UserHomePage from './pages/UserHomePage/UserHomePage';

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

  // Interfața pentru Student / Profesor (Home Page)
  return (
    <UserHomePage
      currentUser={currentUser}
      onLogout={() => setCurrentUser(null)}
    />
  );
}

export default App;