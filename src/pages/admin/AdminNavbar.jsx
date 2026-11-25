import React from 'react';
import './Admin.css';

function AdminNavbar({ currentUser, activeTab, onSelectTab, onLogout }) {
  return (
    <aside className="admin-sidebar">
      <div>
        <div className="admin-sidebar-brand">
          <div className="admin-sidebar-logo">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 21h18" />
              <path d="M5 21V7l7-4 7 4v14" />
              <path d="M9 21v-6h6v6" />
            </svg>
          </div>
          <div>
            <h2 className="admin-sidebar-title">CAMPUS UNIVERSITAR</h2>
            <p className="admin-sidebar-sub">Administrare Sport</p>
          </div>
        </div>

        <nav className="admin-sidebar-nav">
          <button
            type="button"
            className={`admin-nav-btn ${activeTab === 'panou' ? 'active' : ''}`}
            onClick={() => onSelectTab('panou')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span>Panou</span>
          </button>

          <button
            type="button"
            className={`admin-nav-btn ${activeTab === 'calendar' ? 'active' : ''}`}
            onClick={() => onSelectTab('calendar')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span>Calendar Rezervări</span>
          </button>

          <button
            type="button"
            className={`admin-nav-btn ${activeTab === 'mentenanta' ? 'active' : ''}`}
            onClick={() => onSelectTab('mentenanta')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
            <span>Adaugă Mentenanță</span>
          </button>
        </nav>
      </div>

      <div className="admin-sidebar-footer">
        <div className="admin-role-pill">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <span>{currentUser.nume}</span>
        </div>

        <button type="button" className="admin-logout-btn" onClick={onLogout}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span>Ieșire</span>
        </button>
      </div>
    </aside>
  );
}

export default AdminNavbar;