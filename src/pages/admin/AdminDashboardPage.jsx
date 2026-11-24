import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Admin.css';

function AdminDashboardPage() {
  const [bookings, setBookings] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('Toate');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const facilitiesList = ['Toate', 'Bazin', 'Fitness', 'Fotbal', 'Baschet'];

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

  // Filtrare rezer
  const filteredBookings =
    selectedFilter === 'Toate'
      ? bookings
      : bookings.filter((b) => b.numeFacilitate === selectedFilter);

  // Calcul statistici 
  const activeBookingsCount = bookings.filter((b) => b.status === 'Activa').length;
  const totalFacilities = 4;
  const occupancyRate = Math.min(100, Math.round((activeBookingsCount / 16) * 100));

  return (
    <div className="admin-container">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Panou administrare</h1>
        <p className="admin-page-subtitle">
          Monitorizează rezervările din campus și gestionează disponibilitatea terenurilor
        </p>
      </div>

      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div>
            <p className="stat-label">Rezervări active</p>
            <p className="stat-value">{activeBookingsCount}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏟️</div>
          <div>
            <p className="stat-label">Facilități</p>
            <p className="stat-value">{totalFacilities}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
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
      {error && <p style={{ color: '#b91c1c' }}>{error}</p>}

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
    </div>
  );
}

export default AdminDashboardPage;