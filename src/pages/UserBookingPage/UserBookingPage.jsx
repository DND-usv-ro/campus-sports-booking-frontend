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
  { start: '14:00', full: '14:00 - 15:00' },
  { start: '15:30', full: '15:30 - 16:30' },
  { start: '17:00', full: '17:00 - 18:00' },
];

const SportIcon = ({ type, color = '#1e3a8a', size = 22 }) => {
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

// Generează cele 5 zile lucrătoare (Lun - Vin) pentru săptămâna curentă + offset
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

function UserBookingPage({ currentUser, initialFacility, onBack, onBookingSuccess }) {
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

  // Verifică dacă un interval este ocupat pentru facilitatea și ziua selectată
  const isSlotOccupied = (fullInterval) => {
    return allBookings.some(
      (b) =>
        b.facilityId === facility.id &&
        b.data === selectedDate &&
        b.intervalOrar === fullInterval &&
        b.status === 'Activa'
    );
  };

  // Calculează câte rezervări active are utilizatorul în săptămâna afișată
  const weekStart = weekDays[0]?.iso;
  const weekEnd = weekDays[4]?.iso;
  const userWeeklyCount = allBookings.filter(
    (b) =>
      b.userId === currentUser.userId &&
      b.status === 'Activa' &&
      b.data >= weekStart &&
      b.data <= weekEnd
  ).length;

  // Titlul lunii (ex. "Noiembrie 2026")
  const monthLabel = weekDays[2]?.dateObj.toLocaleDateString('ro-RO', {
    month: 'long',
    year: 'numeric',
  });

  // Textul de rezumat deasupra butonului (ex. "Mie, 25 nov. • 17:00 - 18:00")
  const selectedDayObj = weekDays.find((d) => d.iso === selectedDate);
  const summaryDateText = selectedDayObj
    ? selectedDayObj.dateObj.toLocaleDateString('ro-RO', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
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
    <div className="booking-page">
      {/* Header cu buton Înapoi */}
      <header className="booking-header">
        <button className="booking-back-btn" onClick={onBack} title="Înapoi la Acasă">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>
        <h1 className="booking-header-title">Rezervare</h1>
      </header>

      {/* Dropdown alegere facilitate */}
      <div className="facility-selector-wrapper">
        <div
          className="facility-selector-card"
          onClick={() => setDropdownOpen((prev) => !prev)}
        >
          <div className="facility-selector-left">
            <div className="facility-selector-icon">
              <SportIcon type={facility.nume} color="#1e3a8a" size={24} />
            </div>
            <div>
              <h2 className="facility-selector-name">{facility.nume}</h2>
              <p className="facility-selector-loc">{facility.locatie}</p>
            </div>
          </div>

          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
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
                    <SportIcon type={fac.nume} color={isOpen ? '#1e3a8a' : '#94a3b8'} size={20} />
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

      {/* Navigare săptămână & zile */}
      <div className="calendar-nav-row">
        <h2 className="calendar-month-label">{monthLabel}</h2>
        <div className="calendar-arrows">
          <button
            className="calendar-arrow-btn"
            onClick={() => setWeekOffset((w) => w - 1)}
            title="Săptămâna anterioară"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            className="calendar-arrow-btn"
            onClick={() => setWeekOffset((w) => w + 1)}
            title="Săptămâna următoare"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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

      {/* Alegere interval orar */}
      <div className="slots-header">
        <h3 className="slots-title">Alege intervalul</h3>
        <span className="slots-duration">Durată: 60 min</span>
      </div>

      <div className="slots-grid">
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
              <div className="slot-time-row">
                <span>{slot.start}</span>
                {isSelected && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                )}
              </div>
              <span className="slot-status">
                {occupied ? 'Ocupat' : isSelected ? 'Selectat' : 'Disponibil'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Banner limită 3 rezervări / săptămână */}
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

      {/* Mesaj confirmare sau eroare */}
      {feedback && (
        <div className={`booking-feedback ${feedback.type}`}>
          {feedback.text}
        </div>
      )}

      {/* Rezumat și buton Confirmă rezervarea */}
      <p className="booking-summary-text">
        {selectedSlot
          ? `${summaryDateText} • ${selectedSlot.full}`
          : 'Selectează un interval disponibil'}
      </p>

      <button
        className="confirm-booking-btn"
        disabled={!selectedSlot || loading || userWeeklyCount >= 3}
        onClick={handleConfirmBooking}
      >
        {loading ? 'Se salvează...' : 'Confirmă rezervarea'}
      </button>
    </div>
  );
}

export default UserBookingPage;