import React from 'react';
import './Admin.css';

function AdminNavbar({ currentUser, activeTab, onSelectTab, onLogout }) {
  return (
    <nav className="admin-navbar">
      <div className="admin-brand">
        <div className="admin-logo-box">🏛️</div>
        <div>
          <p className="admin-brand-title">CAMPUS UNIVERSITAR</p>
          <p className="admin-brand-sub">Administrare Sport</p>
        </div>
      </div>

      <div className="admin-nav-tabs">
        <button
          type="button"
          className={`admin-tab-btn ${activeTab === 'panou' ? 'active' : ''}`}
          onClick={() => onSelectTab('panou')}
        >
          🏠 Panou
        </button>

        <button
          type="button"
          className={`admin-tab-btn ${activeTab === 'calendar' ? 'active' : ''}`}
          onClick={() => onSelectTab('calendar')}
        >
          📅 Calendar Rezervări
        </button>

        <button
          type="button"
          className={`admin-tab-btn ${activeTab === 'mentenanta' ? 'active' : ''}`}
          onClick={() => onSelectTab('mentenanta')}
        >
          🔧 Adaugă Mentenanță
        </button>
      </div>

      <div className="admin-user-area">
        <span className="admin-badge">👤 {currentUser.nume}</span>
        <button type="button" className="admin-logout-btn" onClick={onLogout}>
          Deconectare
        </button>
      </div>
    </nav>
  );
}

export default AdminNavbar;