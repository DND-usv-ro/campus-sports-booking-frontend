import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Admin.css';

const FACILITIES = [
  { id: 1, nume: 'Bazin', locatie: 'Complex sportiv • Corp A' },
  { id: 2, nume: 'Fitness', locatie: 'Sală de fitness • Corp B' },
  { id: 3, nume: 'Fotbal', locatie: 'Teren principal' },
  { id: 4, nume: 'Baschet', locatie: 'Sală polivalentă • Corp C' },
];

const WEEK_DAYS = ['Lun', 'Mar', 'Mie', 'Joi', 'Vin', 'Sâm', 'Dum'];

const SportIcon = ({ type }) => {
  if (type === 'Bazin') {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
        <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
        <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
      </svg>
    );
  }
  if (type === 'Fitness') {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polygon points="12 7 16.5 10.3 14.8 15.5 9.2 15.5 7.5 10.3" />
        <path d="M12 2v5M21.5 9l-5 1.3M18 20l-3.2-4.5M6 20l3.2-4.5M2.5 9l5 1.3" />
      </svg>
    );
  }
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M4.93 4.93c4.08 4.08 4.08 10.06 0 14.14" />
      <path d="M19.07 4.93c-4.08 4.08-4.08 10.06 0 14.14" />
      <line x1="2" y1="12" x2="22" y2="12" />
    </svg>
  );
};

function AdminCalendarPage() {
  const [bookings, setBookings] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState(FACILITIES[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDayDetails, setSelectedDayDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/bookings');
        setBookings(res.data);
      } catch (err) {
        console.error('Eroare la încărcarea rezervărilor:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  //  meniul dropdown se inchide daca dai click in afara lui
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const changeMonth = (offset) => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
  };

  const toLocalDateStr = (year, monthIndex, day) => {
    const mm = String(monthIndex + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
  };

  const todayStr = (() => {
    const now = new Date();
    return toLocalDateStr(now.getFullYear(), now.getMonth(), now.getDate());
  })();

  const monthTitle = currentMonth.toLocaleDateString('ro-RO', {
    month: 'long',
    year: 'numeric',
  });

  // Construirea celulelor lunii
  const buildMonthCells = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 = Dum, 1 = Lun...
    const leadingEmpty = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells = [];
    for (let i = 0; i < leadingEmpty; i++) {
      cells.push({ empty: true, key: `empty-${i}` });
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = toLocalDateStr(year, month, day);
      const dayBookings = bookings
        .filter(
          (b) =>
            b.numeFacilitate === selectedFacility.nume &&
            b.data === dateStr &&
            b.status === 'Activa'
        )
        .sort((a, b) => a.intervalOrar.localeCompare(b.intervalOrar));

      cells.push({
        empty: false,
        key: dateStr,
        day,
        dateStr,
        dayBookings,
      });
    }
    return cells;
  };

  const handleCancelFromModal = async (bookingId, numeUtilizator) => {
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
      setSelectedDayDetails((prev) =>
        prev
          ? {
              ...prev,
              dayBookings: prev.dayBookings.filter((b) => b.bookingId !== bookingId),
            }
          : null
      );
    } catch (err) {
      alert('Eroare la anularea rezervării.');
    }
  };

  const formatModalDate = (dateStr) => {
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('ro-RO', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const monthCells = buildMonthCells();

  return (
    <main className="admin-main-content">
      <header className="admin-page-header">
        <p className="admin-page-date">Vizualizare lunară pe facilități</p>
        <h1 className="admin-page-title">Calendar rezervări</h1>
      </header>

      <div className="calendar-container-card">
        {/* Bara de sus: Dropdown custom rotund + Navigator lună */}
        <div className="calendar-controls-bar">
          {/* Custom Dropdown rotund (nu mai e negru/pătrat) */}
          <div className="custom-facility-dropdown" ref={dropdownRef}>
            <button
              type="button"
              className="custom-dropdown-trigger"
              onClick={() => setDropdownOpen((o) => !o)}
            >
              <div className="calendar-facility-icon">
                <SportIcon type={selectedFacility.nume} />
              </div>
              <div className="calendar-facility-select-wrap">
                <span className="custom-dropdown-title">{selectedFacility.nume}</span>
                <span className="calendar-facility-loc">{selectedFacility.locatie}</span>
              </div>
              <span className={`custom-dropdown-caret ${dropdownOpen ? 'open' : ''}`}>
                ▾
              </span>
            </button>

            {dropdownOpen && (
              <div className="custom-dropdown-menu">
                {FACILITIES.map((fac) => (
                  <button
                    key={fac.id}
                    type="button"
                    className={`custom-dropdown-item ${
                      fac.nume === selectedFacility.nume ? 'selected' : ''
                    }`}
                    onClick={() => {
                      setSelectedFacility(fac);
                      setDropdownOpen(false);
                    }}
                  >
                    <div className="custom-dropdown-item-icon">
                      <SportIcon type={fac.nume} />
                    </div>
                    <div>
                      <div className="custom-dropdown-item-name">{fac.nume}</div>
                      <div className="custom-dropdown-item-loc">{fac.locatie}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Navigator Luna*/}
          <div className="calendar-date-navigator">
            <button
              type="button"
              className="calendar-nav-arrow"
              onClick={() => changeMonth(-1)}
              title="Luna anterioară"
            >
              ‹
            </button>

            <span className="calendar-current-date-text">{monthTitle}</span>

            <button
              type="button"
              className="calendar-nav-arrow"
              onClick={() => changeMonth(1)}
              title="Luna următoare"
            >
              ›
            </button>
          </div>
        </div>

        
        <div className="calendar-legend">
          <span className="legend-item">
            <span className="legend-dot free" /> Disponibil
          </span>
          <span className="legend-item">
            <span className="legend-dot booked" /> Rezervat (click pentru detalii)
          </span>
          <span className="legend-item">
            <span className="legend-dot maint" /> Mentenanță
          </span>
        </div>

        {loading ? (
          <p style={{ color: '#64748b' }}>Se încarcă calendarul...</p>
        ) : (
          <div className="month-calendar-wrapper">
            {/* Capul de tabel Luni - Duminică */}
            <div className="month-weekdays-grid">
              {WEEK_DAYS.map((dayName) => (
                <div key={dayName} className="month-weekday-header">
                  {dayName}
                </div>
              ))}
            </div>

            {/* Gridul cu toate zilele lunii */}
            <div className="month-days-grid">
              {monthCells.map((cell) => {
                if (cell.empty) {
                  return <div key={cell.key} className="month-day-cell empty" />;
                }

                const isToday = cell.dateStr === todayStr;
                const hasBookings = cell.dayBookings.length > 0;

                return (
                  <div
                    key={cell.key}
                    className={`month-day-cell ${isToday ? 'today' : ''} ${
                      hasBookings ? 'has-bookings' : ''
                    }`}
                    onClick={() =>
                      setSelectedDayDetails({
                        dateStr: cell.dateStr,
                        dayBookings: cell.dayBookings,
                      })
                    }
                  >
                    <div className="month-day-top">
                      <span className={`month-day-number ${isToday ? 'today-badge' : ''}`}>
                        {cell.day}
                      </span>
                      {!hasBookings && (
                        <span className="month-day-free-label">Disponibil</span>
                      )}
                    </div>

                    <div className="month-day-events">
                      {cell.dayBookings.slice(0, 3).map((b) => {
                        const isMaint =
                          b.tip === 'Mentenanta' ||
                          b.numeUtilizator?.toLowerCase().includes('mentenan');
                        const startHour = b.intervalOrar.split(' - ')[0];
                        return (
                          <div
                            key={b.bookingId}
                            className={`month-event-pill ${isMaint ? 'maint' : 'booked'}`}
                            title={`${b.intervalOrar} • ${b.numeUtilizator} (${b.locatie})`}
                          >
                            <span className="event-pill-hour">{startHour}</span>
                            <span className="event-pill-name">
                              {isMaint ? 'Mentenanță' : b.numeUtilizator}
                            </span>
                          </div>
                        );
                      })}

                      {cell.dayBookings.length > 3 && (
                        <div className="month-more-events">
                          +{cell.dayBookings.length - 3} în plus
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* detalii zi la click */}
      {selectedDayDetails && (
        <div
          className="calendar-modal-backdrop"
          onClick={() => setSelectedDayDetails(null)}
        >
          <div
            className="calendar-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="calendar-modal-header">
              <div>
                <p className="calendar-modal-eyebrow">{selectedFacility.nume}</p>
                <h3 className="calendar-modal-title">
                  {formatModalDate(selectedDayDetails.dateStr)}
                </h3>
              </div>
              <button
                type="button"
                className="calendar-modal-close"
                onClick={() => setSelectedDayDetails(null)}
              >
                ✕
              </button>
            </div>

            {selectedDayDetails.dayBookings.length === 0 ? (
              <div className="calendar-modal-empty">
                <p>Toate intervalele orare sunt disponibile în această zi.</p>
              </div>
            ) : (
              <div className="calendar-modal-list">
                {selectedDayDetails.dayBookings.map((b) => {
                  const isMaint =
                    b.tip === 'Mentenanta' ||
                    b.numeUtilizator?.toLowerCase().includes('mentenan');
                  return (
                    <div
                      key={b.bookingId}
                      className={`calendar-modal-item ${isMaint ? 'maint' : 'booked'}`}
                    >
                      <div>
                        <p className="modal-item-time">{b.intervalOrar}</p>
                        <p className="modal-item-user">{b.numeUtilizator}</p>
                        {b.emailUtilizator && (
                          <p className="modal-item-email">{b.emailUtilizator}</p>
                        )}
                      </div>

                      <button
                        type="button"
                        className="cancel-booking-btn"
                        onClick={() =>
                          handleCancelFromModal(b.bookingId, b.numeUtilizator)
                        }
                      >
                        Anulează
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

export default AdminCalendarPage;