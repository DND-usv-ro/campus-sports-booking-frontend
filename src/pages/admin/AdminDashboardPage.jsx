import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Admin.css';

function AdminDashboardPage() {
  const [bookings, setBookings] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('Toate');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const facilitiesList = ['Toate', 'Bazin', 'Fitness', 'Fotbal', 'Baschet'];

  const formattedDate = new Date().toLocaleDateString('ro-RO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const fetchBookings = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/bookings');
      setBookings(response.data);
    } catch (err) {
      setError('Nu s-au putut încărca rezervările de la server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId, numeUtilizator) => {
    const confirmed = window.confirm(
      `Sigur dorești să anulezi rezervarea pentru ${numeUtilizator}?`
    );
    if (!confirmed) return;

    try {
      await axios.patch(`http://localhost:5000/api/bookings/${bookingId}/cancel`);
      setBookings((prev) =>
        prev.map((b) =>
          b.bookingId === bookingId ? { ...b, status: 'Anulata' } : b
        )
      );
    } catch (err) {
      alert('Eroare la anularea rezervării.');
    }
  };

  const getInitials = (nume) => {
    return nume
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const filteredBookings =
    selectedFilter === 'Toate'
      ? bookings
      : bookings.filter((b) => b.numeFacilitate === selectedFilter);

  const activeBookingsCount = bookings.filter((b) => b.status === 'Activa').length;
  const totalFacilities = 4;
  const occupancyRate = Math.min(100, Math.round((activeBookingsCount / 16) * 100));

  return (
    <main className="admin-main-content">
      <header className="admin-page-header">
        <p className="admin-page-date">{formattedDate}</p>
        <h1 className="admin-page-title">Panou administrare</h1>
      </header>

      {/* 3 Carduri de statistici cu iconițe SVG curate */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <div>
            <p className="stat-label">Rezervări active</p>
            <p className="stat-value">{activeBookingsCount}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
            </svg>
          </div>
          <div>
            <p className="stat-label">Facilități</p>
            <p className="stat-value">{totalFacilities}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
          </div>
          <div>
            <p className="stat-label">Ocupare</p>
            <p className="stat-value">{occupancyRate}%</p>
          </div>
        </div>
      </div>

      {/* Secțiunea Toate rezervările + Filtre */}
      <div className="bookings-section-header">
        <div className="bookings-title-row">
          <h2 className="bookings-section-title">Toate rezervările</h2>
          <span className="bookings-count">{filteredBookings.length} rezervări</span>
        </div>

        <div className="filter-pills">
          {facilitiesList.map((fac) => (
            <button
              key={fac}
              type="button"
              className={`filter-pill ${selectedFilter === fac ? 'active' : ''}`}
              onClick={() => setSelectedFilter(fac)}
            >
              {fac}
            </button>
          ))}
        </div>
      </div>

      {loading && <p>Se încarcă rezervările...</p>}
      {error && <p style={{ color: '#dc2626' }}>{error}</p>}

      {!loading && !error && (
        <div className="bookings-list">
          {filteredBookings.length === 0 ? (
            <p style={{ color: '#64748b' }}>Nu există rezervări pentru această categorie.</p>
          ) : (
            filteredBookings.map((booking) => (
              <div key={booking.bookingId} className="booking-row-card">
                <div className="booking-user-info">
                  <div className="avatar-circle">
                    {getInitials(booking.numeUtilizator)}
                  </div>
                  <div>
                    <p className="booking-user-name">{booking.numeUtilizator}</p>
                    <p className="booking-facility-meta">
                      <strong>{booking.numeFacilitate}</strong> • {booking.locatie}
                    </p>
                  </div>
                </div>

                <div className="booking-right-meta">
                  <div className="booking-time-box">
                    <p className="booking-date-text">{booking.data}</p>
                    <p className="booking-hour-text">{booking.intervalOrar}</p>
                  </div>

                  <span
                    className={`booking-status-badge ${
                      booking.status === 'Activa' ? 'badge-activa' : 'badge-anulata'
                    }`}
                  >
                    {booking.status === 'Activa' ? 'Activă' : 'Anulată'}
                  </span>

                  {booking.status === 'Activa' && (
                    <button
                      type="button"
                      className="cancel-booking-btn"
                      onClick={() =>
                        handleCancelBooking(booking.bookingId, booking.numeUtilizator)
                      }
                    >
                      Anulează
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </main>
  );
}

export default AdminDashboardPage;