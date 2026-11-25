import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserBookingPage.css';

const FACILITIES = [
  { id: 1, nume: 'Bazin', status: 'Deschis', locatie: 'Complex sportiv • Corp A' },
  { id: 2, nume: 'Fitness', status: 'Deschis', locatie: 'Sală de fitness • Corp B' },
  { id: 3, nume: 'Fotbal', status: 'Deschis', locatie: 'Teren principal' },
  { id: 4, nume: 'Baschet', status: 'Mentenanță', locatie: 'Sală polivalentă • Corp C' },
];

const TIME_SLOTS = [
  { start: '08:00', full: '08:00 - 09:00' },
  { start: '09:30', full: '09:30 - 10:30' },
  { start: '11:00', full: '11:00 - 12:00' },
  { start: '12:00', full: '12:00 - 13:00' },
  { start: '14:00', full: '14:00 - 15:00' },
  { start: '15:30', full: '15:30 - 16:30' },
  { start: '16:00', full: '16:00 - 17:00' },
  { start: '17:00', full: '17:00 - 18:00' },
];

const SportIcon = ({ type, color = '#1e3a8a', size = 20 }) => {
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

const getWeekdaysForOffset = (weekOffset) => {
  const today = new Date();
  const day = today.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(today);
  monday.setDate(today.getDate() + diffToMonday + weekOffset * 7);

  const days = [];
  for (let i = 0; i < 5; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    days.push({
      iso: `${yyyy}-${mm}-${dd}`,
      dayShort: d.toLocaleDateString('ro-RO', { weekday: 'short' }).replace('.', ''),
      dayNum: d.getDate(),
      dateObj: d,
    });
  }
  return days;
};

function UserBookingPage({ currentUser, initialFacility, onBookingSuccess }) {
  const [facility, setFacility] = useState(initialFacility || FACILITIES[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);
  const [weekDays, setWeekDays] = useState(() => getWeekdaysForOffset(0));
  const [selectedDate, setSelectedDate] = useState(() => getWeekdaysForOffset(0)[0].iso);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (initialFacility && initialFacility.status === 'Deschis') {
      setFacility(initialFacility);
    }
  }, [initialFacility]);

  useEffect(() => {
    const days = getWeekdaysForOffset(weekOffset);
    setWeekDays(days);
    setSelectedDate(days[0].iso);
    setSelectedSlot(null);
  }, [weekOffset]);

  const fetchBookings = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/bookings');
      setAllBookings(res.data);
    } catch (err) {
      console.error('Eroare la citirea rezervărilor:', err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const isSlotOccupied = (fullInterval) => {
    return allBookings.some(
      (b) =>
        b.facilityId === facility.id &&
        b.data === selectedDate &&
        b.intervalOrar === fullInterval &&
        b.status === 'Activa'
    );
  };

  const weekStart = weekDays[0]?.iso;
  const weekEnd = weekDays[4]?.iso;
  const userWeeklyCount = allBookings.filter(
    (b) =>
      b.userId === currentUser.userId &&
      b.status === 'Activa' &&
      b.data >= weekStart &&
      b.data <= weekEnd
  ).length;

  const monthLabel = weekDays[2]?.dateObj.toLocaleDateString('ro-RO', {
    month: 'long',
    year: 'numeric',
  });

  const selectedDayObj = weekDays.find((d) => d.iso === selectedDate);
  const detailDateText = selectedDayObj
    ? selectedDayObj.dateObj.toLocaleDateString('ro-RO', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : '';

  const handleConfirmBooking = async () => {
    if (!selectedSlot) return;
    setLoading(true);
    setFeedback(null);

    try {
      await axios.post('http://localhost:5000/api/bookings', {
        userId: currentUser.userId,
        numeUtilizator: currentUser.nume,
        emailUtilizator: currentUser.email,
        facilityId: facility.id,
        numeFacilitate: facility.nume,
        locatie: facility.locatie,
        data: selectedDate,
        intervalOrar: selectedSlot.full,
      });

      setFeedback({ type: 'success', text: 'Rezervarea a fost confirmată cu succes!' });
      await fetchBookings();
      setSelectedSlot(null);

      if (onBookingSuccess) {
        setTimeout(() => {
          onBookingSuccess();
        }, 900);
      }
    } catch (err) {
      const msg = err.response?.data?.error || 'Nu s-a putut confirma rezervarea.';
      setFeedback({ type: 'error', text: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header pagină */}
      <header className="booking-desktop-header">
        <h1 className="booking-desktop-title">Calendar de rezervare</h1>
        <p className="booking-desktop-subtitle">Alege data și intervalul dorit</p>
      </header>

      {/* Layout 2 coloane */}
      <div className="booking-two-col-grid">
        {/* Coloana stângă */}
        <div className="booking-left-card">
          <span className="field-label-small">Facilitate</span>

          <div className="facility-selector-wrapper">
            <div
              className="facility-selector-card"
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              <div className="facility-selector-left">
                <div className="facility-selector-icon">
                  <SportIcon type={facility.nume} color="#1e3a8a" size={20} />
                </div>
                <div>
                  <h2 className="facility-selector-name">{facility.nume}</h2>
                  <p className="facility-selector-loc">{facility.locatie}</p>
                </div>
              </div>

              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>

            {dropdownOpen && (
              <div className="facility-dropdown-menu">
                {FACILITIES.map((fac) => {
                  const isOpen = fac.status === 'Deschis';
                  return (
                    <div
                      key={fac.id}
                      className={`facility-dropdown-item ${!isOpen ? 'disabled' : ''}`}
                      onClick={() => {
                        if (isOpen) {
                          setFacility(fac);
                          setSelectedSlot(null);
                          setFeedback(null);
                          setDropdownOpen(false);
                        }
                      }}
                    >
                      <div className="facility-selector-left">
                        <SportIcon type={fac.nume} color={isOpen ? '#1e3a8a' : '#94a3b8'} size={18} />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '14px', color: '#0f172a' }}>
                            {fac.nume} {!isOpen && '(Mentenanță)'}
                          </div>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>{fac.locatie}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Navigare lună și zile */}
          <div className="calendar-nav-row">
            <h2 className="calendar-month-label">{monthLabel}</h2>
            <div className="calendar-arrows">
              <button
                className="calendar-arrow-btn"
                onClick={() => setWeekOffset((w) => w - 1)}
                title="Săptămâna anterioară"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                className="calendar-arrow-btn"
                onClick={() => setWeekOffset((w) => w + 1)}
                title="Săptămâna următoare"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>

          <div className="days-strip">
            {weekDays.map((day) => {
              const isSelected = day.iso === selectedDate;
              return (
                <button
                  key={day.iso}
                  className={`day-pill ${isSelected ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedDate(day.iso);
                    setSelectedSlot(null);
                    setFeedback(null);
                  }}
                >
                  <span className="day-pill-name">{day.dayShort}</span>
                  <span className="day-pill-num">{day.dayNum}</span>
                </button>
              );
            })}
          </div>

          {/* Grid 8 intervale orare */}
          <div className="slots-grid-desktop">
            {TIME_SLOTS.map((slot) => {
              const occupied = isSlotOccupied(slot.full);
              const isSelected = selectedSlot?.full === slot.full;

              return (
                <button
                  key={slot.full}
                  disabled={occupied}
                  className={`slot-card ${occupied ? 'occupied' : ''} ${isSelected ? 'selected' : ''}`}
                  onClick={() => {
                    if (!occupied) {
                      setSelectedSlot(slot);
                      setFeedback(null);
                    }
                  }}
                >
                  <span className="slot-time-row">{slot.start}</span>
                  <span className="slot-status">
                    {occupied ? 'Ocupat' : isSelected ? 'Selectat' : 'Disponibil'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Banner limită */}
          <div className="limit-banner">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <span>
              Maxim 3 rezervări pe săptămână ({userWeeklyCount}/3 utilizate)
            </span>
          </div>
        </div>

        {/* Coloana dreaptă: Detalii rezervare */}
        <aside className="booking-right-card">
          <h3 className="details-card-title">Detalii rezervare</h3>

          <div className="detail-row">
            <div className="detail-icon-box">
              <SportIcon type={facility.nume} color="#1e3a8a" size={18} />
            </div>
            <div>
              <span className="detail-label">Facilitate</span>
              <span className="detail-value">{facility.nume}</span>
            </div>
          </div>

          <div className="detail-row">
            <div className="detail-icon-box">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <div>
              <span className="detail-label">Dată</span>
              <span className="detail-value">{detailDateText}</span>
            </div>
          </div>

          <div className="detail-row">
            <div className="detail-icon-box">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div>
              <span className="detail-label">Interval</span>
              <span className="detail-value">
                {selectedSlot ? selectedSlot.full : 'Neselectat'}
              </span>
            </div>
          </div>

          {feedback && (
            <div className={`booking-feedback ${feedback.type}`}>
              {feedback.text}
            </div>
          )}

          <button
            className="confirm-booking-btn"
            disabled={!selectedSlot || loading || userWeeklyCount >= 3}
            onClick={handleConfirmBooking}
          >
            {loading ? 'Se salvează...' : 'Confirmă rezervarea'}
          </button>

          <div className="details-footer-note">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            <span>Se va crea o rezervare în numele tău</span>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default UserBookingPage;