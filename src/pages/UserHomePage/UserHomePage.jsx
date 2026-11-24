import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserHomePage.css';
import UserBookingPage from '../UserBookingPage/UserBookingPage';

// Iconițe SVG curate conform machetei
const SunIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
);

const ArrowUpRight = ({ color = 'currentColor' }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 17L17 7M7 7h10v10" />
  </svg>
);

const PinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#bfdbfe" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const SportIcon = ({ type, color = '#1e3a8a', size = 26 }) => {
  if (type === 'Bazin') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
        <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
        <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
      </svg>
    );
  }
  if (type === 'Fitness') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.4 14.4 9.6 9.6" />
        <path d="M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z" />
        <path d="m21.5 21.5-1.4-1.4" />
        <path d="M3.9 3.9 2.5 2.5" />
        <path d="M6.404 12.768a2 2 0 1 1-2.829-2.829l1.768-1.767a2 2 0 1 1-2.828-2.829l2.828-2.828a2 2 0 1 1 2.829 2.828l1.767-1.768a2 2 0 1 1 2.829 2.829z" />
      </svg>
    );
  }
  if (type === 'Fotbal') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polygon points="12 7 16.5 10.3 14.8 15.5 9.2 15.5 7.5 10.3" />
        <path d="M12 2v5M21.5 9l-5 1.3M18 20l-3.2-4.5M6 20l3.2-4.5M2.5 9l5 1.3" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M4.93 4.93c4.08 4.08 4.08 10.06 0 14.14" />
      <path d="M19.07 4.93c-4.08 4.08-4.08 10.06 0 14.14" />
      <line x1="2" y1="12" x2="22" y2="12" />
    </svg>
  );
};

const FACILITIES = [
  { id: 1, nume: 'Bazin', status: 'Deschis', locatie: 'Complex sportiv • Corp A' },
  { id: 2, nume: 'Fitness', status: 'Deschis', locatie: 'Sală de fitness • Corp B' },
  { id: 3, nume: 'Fotbal', status: 'Deschis', locatie: 'Teren principal' },
  { id: 4, nume: 'Baschet', status: 'Mentenanță', locatie: 'Sală polivalentă • Corp C' },
];

function UserHomePage({ currentUser, onLogout }) {
  const [activeTab, setActiveTab] = useState('acasa');
  const [nextBooking, setNextBooking] = useState(null);
  const [selectedFacility, setSelectedFacility] = useState(null);

  // Extragem prenumele (ex. "Ana" din "Ana Popescu")
  const firstName = currentUser?.nume ? currentUser.nume.split(' ')[0] : 'Utilizator';

  // Formatăm data curentă în română (ex. "Miercuri, 25 noiembrie")
  const formattedDate = new Date().toLocaleDateString('ro-RO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  useEffect(() => {
    const fetchUserBookings = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/bookings');
        const userActiveBookings = res.data.filter(
          (b) => b.userId === currentUser.userId && b.status === 'Activa'
        );
        if (userActiveBookings.length > 0) {
          setNextBooking(userActiveBookings[0]);
        }
      } catch (err) {
        console.error('Eroare la încărcarea rezervărilor:', err);
      }
    };

    if (currentUser?.userId) {
      fetchUserBookings();
    }
  }, [currentUser]);

  const formatBookingDate = (dateStr) => {
    if (!dateStr) return '';
    const dateObj = new Date(dateStr);
    return dateObj.toLocaleDateString('ro-RO', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <div className="user-home-wrapper">
      <div className="user-home-container">
        {activeTab === 'acasa' && (
          <>
            {/* Secțiunea de sus: Dată, Salut, Vreme */}
            <header className="home-header">
              <div>
                <p className="home-date">{formattedDate}</p>
                <h1 className="home-greeting">Bun venit, {firstName}</h1>
              </div>
              <div className="home-weather">
                <div className="weather-temp">
                  <SunIcon />
                  <span>22°</span>
                </div>
                <span className="weather-label">Senin</span>
              </div>
            </header>

            {/* Card Următoarea rezervare */}
            <section
              className="next-booking-card"
              onClick={() => setActiveTab('rezerva')}
              title="Vezi detaliile rezervării"
            >
              <div className="next-booking-top">
                <span>Următoarea rezervare</span>
                <ArrowUpRight color="#ffffff" />
              </div>

              {nextBooking ? (
                <>
                  <div className="next-booking-main">
                    <div className="next-booking-icon-box">
                      <SportIcon type={nextBooking.numeFacilitate} color="#ffffff" size={28} />
                    </div>
                    <div>
                      <h2 className="next-booking-title">{nextBooking.numeFacilitate}</h2>
                      <p className="next-booking-time">
                        {formatBookingDate(nextBooking.data)} • {nextBooking.intervalOrar}
                      </p>
                    </div>
                  </div>
                  <div className="next-booking-location">
                    <PinIcon />
                    <span>{nextBooking.locatie}</span>
                  </div>
                </>
              ) : (
                <div className="next-booking-main" style={{ marginBottom: 0 }}>
                  <div>
                    <h2 className="next-booking-title" style={{ fontSize: '18px' }}>
                      Nicio rezervare activă
                    </h2>
                    <p className="next-booking-time">
                      Alege o facilitate de mai jos pentru a face o programare.
                    </p>
                  </div>
                </div>
              )}
            </section>

            {/* Secțiunea Alege-ți mișcarea */}
            <section>
              <div className="facilities-header">
                <h2 className="facilities-title">Alege-ți mișcarea</h2>
                <span className="facilities-count">{FACILITIES.length} facilități</span>
              </div>

              <div className="facilities-grid">
                {FACILITIES.map((fac) => {
                  const isOpen = fac.status === 'Deschis';
                  return (
                    <div
                      key={fac.id}
                      className={`facility-card ${isOpen ? 'available' : 'maintenance'}`}
                      onClick={() => {
                        if (isOpen) {
                          setSelectedFacility(fac);
                          setActiveTab('rezerva');
                        }
                      }}
                    >
                      <div>
                        <div className="facility-card-top">
                          <SportIcon type={fac.nume} color={isOpen ? '#1e3a8a' : '#94a3b8'} />
                          <span className={`status-dot ${isOpen ? 'green' : 'orange'}`} />
                        </div>

                        <h3 className="facility-name">{fac.nume}</h3>
                        <span className={`status-badge ${isOpen ? 'open' : 'maint'}`}>
                          {fac.status}
                        </span>
                      </div>

                      {isOpen ? (
                        <div className="facility-action">
                          <span>Rezervă acum</span>
                          <ArrowUpRight color="#1e3a8a" />
                        </div>
                      ) : (
                        <div className="facility-action disabled">
                          <span>Temporar indisponibil</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          </>
        )}

       {/* Tab Rezervă (componentă separată din folderul UserBookingPage) */}
     {activeTab === 'rezerva' && (
       <UserBookingPage
         currentUser={currentUser}
         initialFacility={selectedFacility}
         onBack={() => {
           setSelectedFacility(null);
           setActiveTab('acasa');
         }}
         onBookingSuccess={async () => {
           try {
             const res = await axios.get('http://localhost:5000/api/bookings');
             const userActiveBookings = res.data.filter(
               (b) => b.userId === currentUser.userId && b.status === 'Activa'
             );
             if (userActiveBookings.length > 0) {
               setNextBooking(userActiveBookings[userActiveBookings.length - 1]);
             }
           } catch (err) {
             console.error(err);
           }
           setSelectedFacility(null);
           setActiveTab('acasa');
         }}
       />
     )}
        {/* Tab Profil (conține datele utilizatorului și butonul de Deconectare) */}
        {activeTab === 'profil' && (
          <div style={{ paddingTop: '20px' }}>
            <h2 style={{ margin: '0 0 4px 0' }}>{currentUser.nume}</h2>
            <p style={{ color: '#64748b', margin: '0 0 12px 0', fontSize: '14px' }}>
              {currentUser.email}
            </p>
            <span
              style={{
                display: 'inline-block',
                padding: '4px 12px',
                borderRadius: '16px',
                backgroundColor: '#dbeafe',
                color: '#1e3a8a',
                fontSize: '12px',
                fontWeight: '700',
                marginBottom: '24px',
              }}
            >
              Rol: {currentUser.rol}
            </span>

            <div>
              <button
                onClick={onLogout}
                style={{
                  width: '100%',
                  padding: '14px',
                  backgroundColor: '#fee2e2',
                  color: '#b91c1c',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                Deconectare
              </button>
            </div>
          </div>
        )}

        {/* Bara de navigare de jos */}
        <nav className="bottom-nav">
          <button
            className={`bottom-nav-item ${activeTab === 'acasa' ? 'active' : ''}`}
            onClick={() => setActiveTab('acasa')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span>Acasă</span>
          </button>

          <button
            className={`bottom-nav-item ${activeTab === 'rezerva' ? 'active' : ''}`}
            onClick={() => setActiveTab('rezerva')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span>Rezervă</span>
          </button>

          <button
            className={`bottom-nav-item ${activeTab === 'profil' ? 'active' : ''}`}
            onClick={() => setActiveTab('profil')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>Profil</span>
          </button>
        </nav>
      </div>
    </div>
  );
}

export default UserHomePage;